"use client";

import { useLanguage } from "@/contexts/LanguageContext";

interface CountryChartProps {
  data: Record<string, number>;
  loading: boolean;
}

const COUNTRY_FLAGS: Record<string, string> = {
  India: "🇮🇳",
  China: "🇨🇳",
  "United Kingdom": "🇬🇧",
  Philippines: "🇵🇭",
  Nepal: "🇳🇵",
  Vietnam: "🇻🇳",
  Pakistan: "🇵🇰",
  "Sri Lanka": "🇱🇰",
  Ireland: "🇮🇪",
  "United States": "🇺🇸",
  Bangladesh: "🇧🇩",
  Malaysia: "🇲🇾",
  "South Africa": "🇿🇦",
  Nigeria: "🇳🇬",
  Indonesia: "🇮🇩",
  Brazil: "🇧🇷",
  Canada: "🇨🇦",
  Germany: "🇩🇪",
  France: "🇫🇷",
  Italy: "🇮🇹",
  "New Zealand": "🇳🇿",
  Singapore: "🇸🇬",
  Thailand: "🇹🇭",
  Myanmar: "🇲🇲",
  "South Korea": "🇰🇷",
  Japan: "🇯🇵",
  Zimbabwe: "🇿🇼",
  Ghana: "🇬🇭",
  Kenya: "🇰🇪",
};

const GRADIENT_COLORS = [
  "#FFD200", "#FFE040", "#c47ac7", "#8BB8DC",
  "#00A651", "#5ab8c4", "#e07c5a", "#CCB000",
  "#00C65E", "#007A3D",
];

export default function CountryChart({ data, loading }: CountryChartProps) {
  const { t } = useLanguage();

  const total = Object.values(data).reduce((a, b) => a + b, 0);
  const sorted = Object.entries(data)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  if (loading) return <div className="glass-card p-6 h-80 shimmer" />;

  if (!sorted.length) {
    return (
      <div className="glass-card p-6 flex items-center justify-center h-80">
        <p className="text-[#3D6080] text-sm">{t("home.noData")}</p>
      </div>
    );
  }

  const maxVal = sorted[0][1];

  return (
    <div className="glass-card p-6 animate-fade-up stagger-4">
      <h3 className="font-display font-semibold text-[#e8f0fe] mb-1">
        {t("home.charts.topCountries")}
      </h3>
      <p className="text-xs text-[#3D6080] mb-5">
        {total.toLocaleString()} {t("common.submissions")}
      </p>

      <div className="space-y-3">
        {sorted.map(([country, count], i) => {
          const pct = total > 0 ? ((count / total) * 100).toFixed(1) : "0";
          const barPct = maxVal > 0 ? (count / maxVal) * 100 : 0;
          const color = GRADIENT_COLORS[i % GRADIENT_COLORS.length];
          const flag = COUNTRY_FLAGS[country] || "🌍";

          return (
            <div
              key={country}
              className="animate-fade-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base shrink-0">{flag}</span>
                  <span className="text-xs text-[#8BB8DC] font-medium truncate">{country}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold" style={{ color }}>
                    {count.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[#3D6080] w-10 text-right">
                    {pct}%
                  </span>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-[rgba(0,61,165,0.4)] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${barPct}%`,
                    background: color,
                    opacity: 0.85,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
