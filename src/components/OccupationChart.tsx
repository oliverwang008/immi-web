"use client";

import {
  RadialBarChart, RadialBar, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { CATEGORY_COLORS, OCCUPATION_CATEGORIES, OccupationCategory } from "@/data/occupations";

interface OccupationChartProps {
  data: Record<string, number>;
  loading: boolean;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-4 py-3 text-sm shadow-2xl">
      <div className="font-semibold text-[#F0F4FF] mb-1">{payload[0].name}</div>
      <div className="text-[#FFD200] font-bold">{payload[0].value.toLocaleString()} submissions</div>
    </div>
  );
}

export default function OccupationChart({ data, loading }: OccupationChartProps) {
  const { t } = useLanguage();

  const total = Object.values(data).reduce((a, b) => a + b, 0);

  const chartData = OCCUPATION_CATEGORIES.map((cat) => ({
    name: cat,
    value: data[cat] || 0,
    fill: CATEGORY_COLORS[cat as OccupationCategory],
  }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  if (loading) return <div className="glass-card p-6 h-80 shimmer" />;

  if (!chartData.length) {
    return (
      <div className="glass-card p-6 flex items-center justify-center h-80">
        <p className="text-[#3D6080] text-sm">{t("home.noData")}</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 animate-fade-up stagger-3">
      <h3 className="font-display font-semibold text-[#F0F4FF] mb-1">
        {t("home.charts.occupationCategories")}
      </h3>
      <p className="text-xs text-[#3D6080] mb-4">
        {total.toLocaleString()} {t("common.submissions")}
      </p>

      {/* Custom bar list */}
      <div className="space-y-3 mt-2">
        {chartData.map((item, i) => (
          <div key={item.name} className="animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[#8BB8DC] font-medium truncate pr-2">{item.name}</span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold" style={{ color: item.fill }}>
                  {item.value}
                </span>
                <span className="text-[10px] text-[#3D6080]">
                  ({total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%)
                </span>
              </div>
            </div>
            <div className="h-1.5 rounded-full bg-[rgba(0,61,165,0.4)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${total > 0 ? (item.value / chartData[0].value) * 100 : 0}%`,
                  background: item.fill,
                  opacity: 0.85,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
