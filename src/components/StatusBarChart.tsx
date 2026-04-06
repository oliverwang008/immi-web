"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { ALL_STATUSES } from "@/data/visas";
// ALL_STATUSES is now ["eoi_invited", "grant_received"]

interface StatusBarChartProps {
  data: Record<string, number>;
  loading: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  eoi_invited: "#8BB8DC",
  grant_received: "#00A651",
};

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-4 py-3 text-sm shadow-2xl max-w-48">
      <div className="font-semibold text-[#F0F4FF] mb-1 text-xs leading-tight">{label}</div>
      <div className="text-[#FFD200] font-bold">{payload[0].value.toLocaleString()}</div>
    </div>
  );
}

export default function StatusBarChart({ data, loading }: StatusBarChartProps) {
  const { t } = useLanguage();

  const chartData = ALL_STATUSES.map((s) => ({
    key: s.key,
    name: t(`status.${s.key}` as Parameters<typeof t>[0]),
    shortName: s.label.length > 22 ? s.label.slice(0, 20) + "…" : s.label,
    value: data[s.key] || 0,
    color: STATUS_COLORS[s.key] || "#3D6080",
  }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 12);

  if (loading) return <div className="glass-card p-6 h-80 shimmer" />;

  if (!chartData.length) {
    return (
      <div className="glass-card p-6 flex items-center justify-center h-80">
        <p className="text-[#3D6080] text-sm">{t("home.noData")}</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 animate-fade-up stagger-2">
      <h3 className="font-display font-semibold text-[#F0F4FF] mb-1">
        {t("home.charts.statusBreakdown")}
      </h3>
      <p className="text-xs text-[#3D6080] mb-6">Current status of all submissions</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 24 }}>
          <XAxis
            type="number"
            tick={{ fill: "#3D6080", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="shortName"
            tick={{ fill: "#8BB8DC", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={140}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,61,165,0.2)" }} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={20}>
            {chartData.map((entry) => (
              <Cell key={entry.key} fill={entry.color} opacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
