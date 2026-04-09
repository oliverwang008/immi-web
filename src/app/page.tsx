"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import StatsCards from "@/components/StatsCards";
import VisaDonutChart from "@/components/VisaDonutChart";
import MonthlyOutcomesChart from "@/components/MonthlyOutcomesChart";
import OccupationChart from "@/components/OccupationChart";
import ProcessingTimeChart from "@/components/ProcessingTimeChart";
import { useLanguage } from "@/contexts/LanguageContext";
import { fetchSubmissions, aggregateStats, AggregatedStats, VisaSubmission } from "@/lib/firestore";
import { ALL_VISA_TYPES, SKILL_VISA_SUBCLASSES, AUSTRALIAN_STATES } from "@/data/visas";
import { PlusCircle, RefreshCw, Filter, Users, X, Shield, TrendingUp, Clock, ChevronDown } from "lucide-react";
import DatePicker from "@/components/DatePicker";
import clsx from "clsx";

const DATE_MAX = new Date().toISOString().split("T")[0];

function filterByDateAndVisa(
  submissions: VisaSubmission[],
  visa: string,
  from: string,
  to: string,
): VisaSubmission[] {
  return submissions.filter((sub) => {
    if (visa && sub.visaSubclass !== visa) return false;
    const dateStr = sub.statusDate ?? null;
    if (from && (!dateStr || dateStr < from)) return false;
    if (to && (!dateStr || dateStr > to)) return false;
    return true;
  });
}

export default function HomePage() {
  const { t } = useLanguage();
  const [allSubmissions, setAllSubmissions] = useState<VisaSubmission[]>([]);
  const [stats, setStats] = useState<AggregatedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // ── Skill insights filter (monthly outcomes + occupation) ────────────
  const [skillVisa, setSkillVisa] = useState("");  // "" = all 189/190/491
  const [skillState, setSkillState] = useState(""); // "" = all states
  const [skillDateFrom, setSkillDateFrom] = useState("");
  const [skillDateTo, setSkillDateTo] = useState("");

  // ── Processing time filter ───────────────────────────────────────────
  const [ptVisa, setPtVisa] = useState("");
  const [ptDateFrom, setPtDateFrom] = useState("");
  const [ptDateTo, setPtDateTo] = useState("");

  // ── Unfiltered stats for visa distributions + stats cards ────────────
  useEffect(() => {
    if (loading) return; // wait until fetch completes before updating stats
    setStats(aggregateStats(allSubmissions));
  }, [allSubmissions, loading]);

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");
    let lastErr: unknown;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const submissions = await fetchSubmissions(500);
        setAllSubmissions(submissions);
        setLastUpdated(new Date());
        setLoading(false);
        setRefreshing(false);
        return;
      } catch (err) {
        lastErr = err;
        if (attempt < 2) await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
      }
    }
    console.error("Firestore fetch failed after 3 attempts:", lastErr);
    setError(t("common.error"));
    setLoading(false);
    setRefreshing(false);
  }, [t]);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Skill submissions (189/190/491 only) with local filter ───────────
  const skillSubmissions = useMemo(() => {
    const base = allSubmissions.filter((s) => SKILL_VISA_SUBCLASSES.includes(s.visaSubclass));
    const byVisa = filterByDateAndVisa(base, skillVisa, skillDateFrom, skillDateTo);
    return skillState ? byVisa.filter((s) => s.sponsoringState === skillState) : byVisa;
  }, [allSubmissions, skillVisa, skillState, skillDateFrom, skillDateTo]);

  const skillStats = useMemo(() => aggregateStats(skillSubmissions), [skillSubmissions]);

  // ── EOI by state (190 & 491 only) for monthly chart ─────────────────
  const eoiStateData = useMemo((): Record<string, Record<string, number>> => {
    const result: Record<string, Record<string, number>> = {};
    allSubmissions
      .filter((s) =>
        s.currentStatus === "eoi_invited" &&
        ["190", "491"].includes(s.visaSubclass) &&
        s.statusDate &&
        s.sponsoringState &&
        (!skillDateFrom || s.statusDate >= skillDateFrom) &&
        (!skillDateTo || s.statusDate <= skillDateTo) &&
        (!skillState || s.sponsoringState === skillState)
      )
      .forEach((s) => {
        const month = s.statusDate!.slice(0, 7);
        const state = s.sponsoringState!;
        if (!result[state]) result[state] = {};
        result[state][month] = (result[state][month] || 0) + 1;
      });
    return result;
  }, [allSubmissions, skillDateFrom, skillDateTo, skillState]);

  // ── Processing time data (grant_received only, app date required) ────
  const ptData = useMemo((): Record<string, number[]> => {
    const grantSubs = allSubmissions.filter(
      (s) => s.currentStatus === "grant_received" && s.statusDate && s.visaApplicationDate
    );
    const filtered = filterByDateAndVisa(grantSubs, ptVisa, ptDateFrom, ptDateTo);
    return filtered.reduce((acc, sub) => {
      const days = Math.round(
        (new Date(sub.statusDate!).getTime() - new Date(sub.visaApplicationDate!).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      if (days > 0 && days < 3650) {
        if (!acc[sub.visaSubclass]) acc[sub.visaSubclass] = [];
        acc[sub.visaSubclass].push(days);
      }
      return acc;
    }, {} as Record<string, number[]>);
  }, [allSubmissions, ptVisa, ptDateFrom, ptDateTo]);

  // ── Split visa distribution data ─────────────────────────────────────
  const skillByVisa = useMemo(() => Object.fromEntries(
    Object.entries(stats?.byVisa ?? {}).filter(([k]) => SKILL_VISA_SUBCLASSES.includes(k))
  ), [stats]);

  const nonSkillByVisa = useMemo(() => Object.fromEntries(
    Object.entries(stats?.byVisa ?? {}).filter(([k]) => !SKILL_VISA_SUBCLASSES.includes(k))
  ), [stats]);

  const hasSkillFilter = skillVisa || skillState || skillDateFrom || skillDateTo;
  const hasPtFilter = ptVisa || ptDateFrom || ptDateTo;

  return (
    <div className="min-h-screen bg-[#000918] relative">
      <div className="fixed inset-0 bg-grid opacity-100 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,210,0,0.08) 0%, transparent 60%)" }} />
      </div>

      <Header />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20">

        {/* Hero */}
        <section className="pt-14 pb-10 relative overflow-hidden">
          {/* Hero background — Australian flag, zoomed into Southern Cross */}
          <div aria-hidden="true" style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/hero-bg.png')",
            backgroundSize: "180%",
            backgroundPosition: "75% 55%",
            zIndex: 0,
            filter: "brightness(0.6) saturate(1.3)",
          }} />
          {/* Layered dark overlays */}
          <div aria-hidden="true" style={{
            position: "absolute",
            inset: 0,
            background: [
              "linear-gradient(180deg, rgba(0,6,18,0.50) 0%, rgba(0,6,18,0.70) 50%, rgba(0,6,18,1) 100%)",
              "linear-gradient(90deg, rgba(0,6,18,0.78) 0%, rgba(0,6,18,0.10) 55%)",
            ].join(", "),
            zIndex: 1,
          }} />
          <div className="max-w-3xl relative" style={{ zIndex: 2 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(255,210,0,0.25)] bg-[rgba(255,210,0,0.06)] mb-5 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A651] animate-pulse" />
              <span className="text-xs font-medium text-[#FFD200] tracking-wide">Live community data</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight mb-4 animate-fade-up">
              <span className="text-[#F0F4FF]">{t("home.hero.title").split("—")[0].trim()}</span>
              {t("home.hero.title").includes("—") && (
                <>
                  <br />
                  <span style={{ background: "linear-gradient(135deg, #FFF080 0%, #FFD200 50%, #CCB000 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    — {t("home.hero.title").split("—")[1]?.trim()}
                  </span>
                </>
              )}
            </h1>
            <p className="text-[#8BB8DC] text-lg leading-relaxed mb-8 animate-fade-up stagger-1">
              {t("home.hero.subtitle")}
            </p>
            <div className="flex flex-wrap items-center gap-3 animate-fade-up stagger-2">
              <Link href="/submit" className="btn-primary">
                <PlusCircle size={16} />
                {t("home.hero.cta")}
              </Link>
              <div className="flex items-center gap-2 text-xs text-[#3D6080]">
                <Users size={13} />
                <span>{stats?.total?.toLocaleString() ?? "—"} {t("common.submissions")}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 animate-fade-up stagger-2">
          {[
            { icon: <Users size={16} />, title: t("submit.benefit.helpOthers.title"), desc: t("submit.benefit.helpOthers.desc"), color: "#FFD200" },
            { icon: <Shield size={16} />, title: t("submit.benefit.anonymous.title"), desc: t("submit.benefit.anonymous.desc"), color: "#00A651" },
            { icon: <TrendingUp size={16} />, title: t("submit.benefit.insights.title"), desc: t("submit.benefit.insights.desc"), color: "#8BB8DC" },
            { icon: <Clock size={16} />, title: t("submit.benefit.quick.title"), desc: t("submit.benefit.quick.desc"), color: "#c47ac7" },
          ].map((b) => (
            <div key={b.title} className="glass-card p-4 text-center" style={{ borderColor: `${b.color}20`, background: `${b.color}06` }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: `${b.color}15`, color: b.color }}>
                {b.icon}
              </div>
              <div className="text-xs font-bold text-[#F0F4FF] mb-1">{b.title}</div>
              <div className="text-[10px] text-[#3D6080] leading-relaxed">{b.desc}</div>
            </div>
          ))}
        </div>

        {error && (
          <div className="p-4 rounded-xl border border-[rgba(200,16,46,0.3)] bg-[rgba(200,16,46,0.06)] text-[#C8102E] text-sm mb-6">
            {error}. Make sure your Firebase project is configured in{" "}
            <code className="text-xs bg-[rgba(200,16,46,0.1)] px-1 py-0.5 rounded">.env.local</code>
          </div>
        )}

        {/* Stats cards */}
        <section className="mb-10">
          <StatsCards stats={stats} loading={loading} />
        </section>

        {/* ── Visa Subclass Distribution ─────────────────────────────── */}
        <section className="mb-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-semibold text-[#8BB8DC] uppercase tracking-wider">Visa Subclass Distribution</span>
            <div className="flex-1 h-px bg-[rgba(0,61,165,0.3)]" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VisaDonutChart
              data={skillByVisa}
              loading={loading}
              title="Skill Related"
              subtitle="Points-tested skilled visas (189, 190, 491)"
            />
            <VisaDonutChart
              data={nonSkillByVisa}
              loading={loading}
              title="Not Skill Related"
              subtitle="All other immigration visa types"
            />
          </div>
        </section>

        {/* Refresh bar — below visa distributions */}
        <div className="flex items-center justify-between mb-8 px-1">
          <button
            onClick={() => loadData(true)}
            className={clsx("btn-secondary !py-1.5 text-xs", refreshing && "opacity-60")}
            disabled={refreshing}
          >
            <RefreshCw size={12} className={clsx(refreshing && "animate-spin")} />
            Refresh data
          </button>
          {lastUpdated && (
            <span className="text-[10px] text-[#3D6080]">Updated {lastUpdated.toLocaleTimeString()}</span>
          )}
        </div>

        {/* ── Skill Insights (189 / 190 / 491) ──────────────────────── */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-semibold text-[#8BB8DC] uppercase tracking-wider">Skill Visa Insights</span>
            <div className="flex-1 h-px bg-[rgba(0,61,165,0.3)]" />
            <span className="text-[10px] text-[#3D6080]">189 · 190 · 491 only</span>
          </div>

          {/* Skill filter bar */}
          <div className="glass-card p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Filter size={13} className="text-[#3D6080]" />
              <span className="text-xs font-semibold text-[#8BB8DC] uppercase tracking-wider">Filter</span>
              {hasSkillFilter && (
                <button
                  onClick={() => { setSkillVisa(""); setSkillState(""); setSkillDateFrom(""); setSkillDateTo(""); }}
                  className="ml-auto flex items-center gap-1 text-[10px] text-[#3D6080] hover:text-[#C8102E] transition-colors"
                >
                  <X size={11} /> Clear
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <select
                className="input-field !py-2 text-sm"
                value={skillVisa}
                onChange={(e) => setSkillVisa(e.target.value)}
              >
                <option value="">All skill visas</option>
                {SKILL_VISA_SUBCLASSES.map((sc) => {
                  const v = ALL_VISA_TYPES.find((x) => x.subclass === sc);
                  return <option key={sc} value={sc}>SC {sc} — {v?.shortName ?? sc}</option>;
                })}
              </select>
              <select
                className="input-field !py-2 text-sm"
                value={skillState}
                onChange={(e) => setSkillState(e.target.value)}
              >
                <option value="">All states</option>
                {AUSTRALIAN_STATES.map((s) => (
                  <option key={s.code} value={s.code}>{s.code} — {s.name}</option>
                ))}
              </select>
              <div className="flex flex-col gap-0.5">
                <label className="text-[10px] text-[#3D6080] px-0.5">{t("home.filter.dateFrom")}</label>
                <DatePicker value={skillDateFrom} max={skillDateTo || DATE_MAX} onChange={setSkillDateFrom} />
              </div>
              <div className="flex flex-col gap-0.5">
                <label className="text-[10px] text-[#3D6080] px-0.5">{t("home.filter.dateTo")}</label>
                <DatePicker value={skillDateTo} min={skillDateFrom} max={DATE_MAX} onChange={setSkillDateTo} />
              </div>
            </div>
            {skillSubmissions.length > 0 && (
              <div className="mt-2 text-[10px] text-[#3D6080]">
                {skillSubmissions.length.toLocaleString()} matching records
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MonthlyOutcomesChart eoiByStateByMonth={eoiStateData} loading={loading} />
            <OccupationChart data={skillStats.byOccupationCategory} loading={loading} />
          </div>
        </section>

        {/* ── Processing Time ────────────────────────────────────────── */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-semibold text-[#8BB8DC] uppercase tracking-wider">Processing Time</span>
            <div className="flex-1 h-px bg-[rgba(0,61,165,0.3)]" />
            <span className="text-[10px] text-[#3D6080]">Visa granted only</span>
          </div>

          {/* Processing time filter */}
          <div className="glass-card p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Filter size={13} className="text-[#3D6080]" />
              <span className="text-xs font-semibold text-[#8BB8DC] uppercase tracking-wider">Filter</span>
              {hasPtFilter && (
                <button
                  onClick={() => { setPtVisa(""); setPtDateFrom(""); setPtDateTo(""); }}
                  className="ml-auto flex items-center gap-1 text-[10px] text-[#3D6080] hover:text-[#C8102E] transition-colors"
                >
                  <X size={11} /> Clear
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                className="input-field !py-2 text-sm"
                value={ptVisa}
                onChange={(e) => setPtVisa(e.target.value)}
              >
                <option value="">All visa types</option>
                {ALL_VISA_TYPES.map((v) => (
                  <option key={v.subclass} value={v.subclass}>SC {v.subclass} — {v.shortName}</option>
                ))}
              </select>
              <div className="flex flex-col gap-0.5">
                <label className="text-[10px] text-[#3D6080] px-0.5">Grant date from</label>
                <DatePicker value={ptDateFrom} max={ptDateTo || DATE_MAX} onChange={setPtDateFrom} />
              </div>
              <div className="flex flex-col gap-0.5">
                <label className="text-[10px] text-[#3D6080] px-0.5">Grant date to</label>
                <DatePicker value={ptDateTo} min={ptDateFrom} max={DATE_MAX} onChange={setPtDateTo} />
              </div>
            </div>
          </div>

          <ProcessingTimeChart data={ptData} loading={loading} />
        </section>

        {/* CTA */}
        <div className="relative rounded-2xl overflow-hidden border border-[rgba(255,210,0,0.2)] animate-fade-up">
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(255,210,0,0.06) 0%, rgba(0,16,40,0.8) 50%, rgba(0,166,81,0.04) 100%)" }} />
          <div className="relative p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-display text-2xl font-semibold text-[#F0F4FF] mb-2">Help the community grow</h2>
              <p className="text-[#8BB8DC] text-sm">Share your anonymous visa outcome and help thousands of applicants make informed decisions.</p>
            </div>
            <Link href="/submit" className="btn-primary shrink-0">
              <PlusCircle size={16} />
              {t("home.hero.cta")}
            </Link>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-[rgba(0,61,165,0.3)] py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#3D6080] text-center sm:text-left max-w-xl leading-relaxed">
              {t("footer.disclaimer")}
            </div>
            <div className="flex flex-col sm:items-end gap-1">
              <a href="mailto:support@olitech.org" className="text-xs text-[#3D6080] hover:text-[#8BB8DC] transition-colors">
                support@olitech.org
              </a>
              <div className="text-xs text-[#3D6080] whitespace-nowrap">
                © 2025 OLITECH AI PTY LTD · {t("footer.rights")}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
