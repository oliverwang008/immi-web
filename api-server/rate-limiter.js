// Token-bucket rate limiter, per-IP cost tracker, and retry helper.

// ── Token Bucket ──────────────────────────────────────────────────────────────

export class TokenBucket {
  /**
   * @param {number} capacity   - max tokens (burst size)
   * @param {number} refillRate - tokens added per second
   */
  constructor(capacity, refillRate) {
    this.capacity = capacity;
    this.refillRate = refillRate;
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  _refill() {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.refillRate);
    this.lastRefill = now;
  }

  // Synchronous — returns immediately rather than queuing.
  tryAcquire(amount = 1) {
    this._refill();
    if (this.tokens >= amount) {
      this.tokens -= amount;
      return { allowed: true, retryAfterMs: 0 };
    }
    const retryAfterMs = Math.ceil(((amount - this.tokens) / this.refillRate) * 1000);
    return { allowed: false, retryAfterMs };
  }
}

// ── Per-IP Rate Limiter ───────────────────────────────────────────────────────

export class PerIpRateLimiter {
  /**
   * @param {object} opts
   * @param {number} opts.capacity   - burst size per IP (default 5)
   * @param {number} opts.refillRate - tokens/s per IP (default 1)
   */
  constructor({ capacity = 5, refillRate = 1 } = {}) {
    this.capacity = capacity;
    this.refillRate = refillRate;
    this._buckets = new Map();
    // Evict idle buckets every 10 minutes to prevent unbounded growth.
    setInterval(() => this._evict(), 10 * 60 * 1000).unref();
  }

  _getBucket(ip) {
    if (!this._buckets.has(ip)) {
      this._buckets.set(ip, new TokenBucket(this.capacity, this.refillRate));
    }
    return this._buckets.get(ip);
  }

  _evict() {
    for (const [ip, bucket] of this._buckets) {
      bucket._refill();
      if (bucket.tokens >= bucket.capacity) this._buckets.delete(ip);
    }
  }

  _getIp(req) {
    // Trust x-forwarded-for set by Firebase Hosting / Cloud Run proxy.
    const forwarded = req.headers['x-forwarded-for'];
    return (forwarded ? forwarded.split(',')[0].trim() : null)
      ?? req.socket?.remoteAddress
      ?? 'unknown';
  }

  middleware() {
    return (req, res, next) => {
      const ip = this._getIp(req);
      const bucket = this._getBucket(ip);
      const { allowed, retryAfterMs } = bucket.tryAcquire(1);

      res.setHeader('X-RateLimit-Limit', this.capacity);
      res.setHeader('X-RateLimit-Remaining', Math.floor(bucket.tokens));

      if (!allowed) {
        res.setHeader('Retry-After', Math.ceil(retryAfterMs / 1000));
        return res.status(429).json({
          error: 'Too many requests — please slow down.',
          retryAfterMs,
        });
      }

      // Attach ip to request so the route handler can use it for cost tracking.
      req.clientIp = ip;
      next();
    };
  }
}

// ── Cost Tracker ──────────────────────────────────────────────────────────────

export class CostTracker {
  // Claude Sonnet 4.6 pricing (USD per 1M tokens)
  static INPUT_COST_PER_1M = 3.0;
  static OUTPUT_COST_PER_1M = 15.0;
  static CACHE_READ_COST_PER_1M = 0.30;  // prompt cache read
  static CACHE_WRITE_COST_PER_1M = 3.75; // prompt cache write

  constructor() {
    this._usage = new Map();
  }

  record(ip, { inputTokens = 0, outputTokens = 0, cacheReadTokens = 0, cacheWriteTokens = 0 } = {}) {
    const e = this._usage.get(ip) ?? { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, requests: 0 };
    e.input += inputTokens;
    e.output += outputTokens;
    e.cacheRead += cacheReadTokens;
    e.cacheWrite += cacheWriteTokens;
    e.requests += 1;
    this._usage.set(ip, e);
  }

  costUsd(ip) {
    const e = this._usage.get(ip);
    if (!e) return 0;
    return (
      (e.input       / 1_000_000) * CostTracker.INPUT_COST_PER_1M +
      (e.output      / 1_000_000) * CostTracker.OUTPUT_COST_PER_1M +
      (e.cacheRead   / 1_000_000) * CostTracker.CACHE_READ_COST_PER_1M +
      (e.cacheWrite  / 1_000_000) * CostTracker.CACHE_WRITE_COST_PER_1M
    );
  }

  totalCostUsd() {
    let total = 0;
    for (const ip of this._usage.keys()) total += this.costUsd(ip);
    return total;
  }

  summary() {
    const rows = [];
    for (const [ip, e] of this._usage) {
      rows.push({
        ip,
        requests: e.requests,
        inputTokens: e.input,
        outputTokens: e.output,
        cacheReadTokens: e.cacheRead,
        costUsd: +this.costUsd(ip).toFixed(6),
      });
    }
    return { rows, totalCostUsd: +this.totalCostUsd().toFixed(6) };
  }
}

// ── Retry with Exponential Backoff ────────────────────────────────────────────

/**
 * Retry an async function with exponential backoff.
 * @param {() => Promise<T>} fn
 * @param {{ maxAttempts?: number, minDelayMs?: number, maxDelayMs?: number }} opts
 */
export async function withRetry(fn, { maxAttempts = 4, minDelayMs = 1000, maxDelayMs = 30000 } = {}) {
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === maxAttempts) break;
      // Don't retry client errors (4xx) — only transient server/network failures.
      if (err?.status >= 400 && err?.status < 500) break;
      const base = minDelayMs * Math.pow(2, attempt - 1);
      const jitter = Math.random() * 0.3 * base;
      const delay = Math.min(base + jitter, maxDelayMs);
      console.warn(`[retry] attempt ${attempt} failed — retrying in ${Math.round(delay)}ms`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastError;
}
