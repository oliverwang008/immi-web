"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend,
} from "recharts";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

const STATE_COLORS: Record<string, string> = {
  NSW: "#8BB8DC",
  VIC: "#FFD200",
  QLD: "#00A651",
  SA:  "#C47AC7",
  WA:  "#E4823A",
  TAS: "#5BA3DC",
  NT:  "#D4651A",
  ACT: "#4EC3A8",
  FAMILY: "#9CA3AF",
};

interface MonthlyOutcomesChartProps {
  /** state code → { "YYYY-MM" → count } — EOI invites for SC 190 & 491 only */
  eoiByStateByMonth: Record<string, Record<string, number>>;
  loading: boolean;
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + (p.value || 0), 0);
  return (
    <div className="glass-card px-4 py-3 text-sm shadow-2xl">
      <div className="font-semibold text-[#F0F4FF] mb-2">{label}</div>
      {payload.filter((p) => p.value > 0).map((p) => (
        <div key={p.name} className="flex items-center gap-2 mb-0.5">
          <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: p.color }} />
          <span className="text-[#8BB8DC] text-xs">{p.name}:</span>
          <span className="font-bold text-xs" style={{ color: p.color }}>{p.value}</span>
        </div>
      ))}
      {payload.filter((p) => p.value > 0).length > 1 && (
        <div className="flex items-center gap-2 mt-1.5 pt-1.5 border-t border-[rgba(255,255,255,0.08)]">
          <span className="text-[#3D6080] text-xs">Total:</span>
          <span className="font-bold text-xs text-[#F0F4FF]">{total}</span>
        </div>
      )}
    </div>
  );
}

export default function MonthlyOutcomesChart({ eoiByStateByMonth, loading }: MonthlyOutcomesChartProps) {
  const { t } = useLanguage();

  const states = Object.keys(eoiByStateByMonth).sort();

  const allMonths = Array.from(
    new Set(states.flatMap((st) => Object.keys(eoiByStateByMonth[st])))
  ).sort().slice(-18);

  const chartData = allMonths.map((m) => {
    const [year, mon] = m.split("-");
    const label = format(new Date(parseInt(year), parseInt(mon) - 1, 1), "MMM yy");
    const row: Record<string, string | number> = { month: label };
    states.forEach((st) => { row[st] = eoiByStateByMonth[st]?.[m] || 0; });
    return row;
  });

  if (loading) return <div className="glass-card p-6 h-72 shimmer" />;

  if (!chartData.length || !states.length) {
    return (
      <div className="glass-card p-6 flex items-center justify-center h-72">
        <p className="text-[#3D6080] text-sm">{t("home.noData")}</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 animate-fade-up">
      <h3 className="font-display font-semibold text-[#F0F4FF] mb-1">EOI Invitations by State</h3>
      <p className="text-xs text-[#3D6080] mb-5">Monthly EOI invites for SC 190 &amp; 491 — by sponsoring state</p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -10 }} barCategoryGap="28%" barGap={0}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,61,165,0.2)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "#3D6080", fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#3D6080", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Legend wrapperStyle={{ fontSize: 10, color: "#8BB8DC", paddingTop: 10 }} iconType="square" iconSize={9} />
          {states.map((st, i) => (
            <Bar
              key={st}
              dataKey={st}
              stackId="state"
              fill={STATE_COLORS[st] ?? `hsl(${i * 47}, 60%, 55%)`}
              radius={i === states.length - 1 ? [3, 3, 0, 0] : [0, 0, 0, 0]}
              maxBarSize={32}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
