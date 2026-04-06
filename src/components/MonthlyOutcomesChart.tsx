"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend,
} from "recharts";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

interface MonthlyOutcomesChartProps {
  eoiInvitedByMonth: Record<string, number>;
  grantedByMonth: Record<string, number>;
  loading: boolean;
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-4 py-3 text-sm shadow-2xl">
      <div className="font-semibold text-[#F0F4FF] mb-2">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 mb-0.5">
          <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: p.color }} />
          <span className="text-[#8BB8DC] text-xs">{p.name}:</span>
          <span className="font-bold text-xs" style={{ color: p.color }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function MonthlyOutcomesChart({ eoiInvitedByMonth, grantedByMonth, loading }: MonthlyOutcomesChartProps) {
  const { t } = useLanguage();

  // Merge all months from both datasets
  const allMonths = Array.from(
    new Set([...Object.keys(eoiInvitedByMonth), ...Object.keys(grantedByMonth)])
  ).sort().slice(-18);

  const chartData = allMonths.map((m) => {
    const [year, mon] = m.split("-");
    const label = format(new Date(parseInt(year), parseInt(mon) - 1, 1), "MMM yy");
    return {
      month: label,
      "EOI Invited": eoiInvitedByMonth[m] || 0,
      "Visa Granted": grantedByMonth[m] || 0,
    };
  });

  if (loading) return <div className="glass-card p-6 h-72 shimmer" />;

  if (!chartData.length) {
    return (
      <div className="glass-card p-6 flex items-center justify-center h-72">
        <p className="text-[#3D6080] text-sm">{t("home.noData")}</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 animate-fade-up">
      <h3 className="font-display font-semibold text-[#F0F4FF] mb-1">Monthly Outcomes</h3>
      <p className="text-xs text-[#3D6080] mb-5">EOI invitations and visa grants by month</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -10 }} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,61,165,0.2)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: "#3D6080", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#3D6080", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Legend
            wrapperStyle={{ fontSize: 11, color: "#8BB8DC", paddingTop: 12 }}
            iconType="square"
            iconSize={10}
          />
          <Bar dataKey="EOI Invited" fill="#8BB8DC" radius={[3, 3, 0, 0]} maxBarSize={28} />
          <Bar dataKey="Visa Granted" fill="#00A651" radius={[3, 3, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
