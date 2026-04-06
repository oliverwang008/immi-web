"use client";

import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";

interface TrendChartProps {
  data: Record<string, number>;
  loading: boolean;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-4 py-3 text-sm shadow-2xl">
      <div className="font-semibold text-[#F0F4FF] mb-1">{label}</div>
      <div className="text-[#FFD200] font-bold">{payload[0].value} submissions</div>
    </div>
  );
}

export default function TrendChart({ data, loading }: TrendChartProps) {
  const { t } = useLanguage();

  const chartData = Object.entries(data)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-24)
    .map(([month, count]) => {
      const [year, m] = month.split("-");
      const date = new Date(parseInt(year), parseInt(m) - 1, 1);
      return {
        month: format(date, "MMM yy"),
        count,
      };
    });

  if (loading) return <div className="glass-card p-6 h-64 shimmer" />;

  if (!chartData.length) {
    return (
      <div className="glass-card p-6 flex items-center justify-center h-64">
        <p className="text-[#3D6080] text-sm">{t("home.noData")}</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 animate-fade-up stagger-4">
      <h3 className="font-display font-semibold text-[#F0F4FF] mb-1">
        {t("home.charts.submissionsOverTime")}
      </h3>
      <p className="text-xs text-[#3D6080] mb-6">Monthly community submissions</p>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFD200" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#FFD200" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(0,61,165,0.2)"
            vertical={false}
          />
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
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,210,0,0.3)", strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#FFD200"
            strokeWidth={2}
            fill="url(#goldGradient)"
            dot={false}
            activeDot={{ r: 4, fill: "#FFD200", stroke: "#f0d080", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
