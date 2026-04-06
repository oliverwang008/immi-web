"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine,
} from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { VISA_TYPES } from "@/data/visas";
import { getAvgProcessingTime } from "@/lib/firestore";

interface ProcessingTimeChartProps {
  processingTimes: Record<string, number[]>;
  loading: boolean;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  const days = payload[0].value;
  return (
    <div className="glass-card px-4 py-3 text-sm shadow-2xl">
      <div className="font-semibold text-[#F0F4FF] mb-2">{label}</div>
      <div className="text-[#FFD200] font-bold">{days} days</div>
      <div className="text-[#8BB8DC] text-xs">{Math.round(days / 30)} months</div>
    </div>
  );
}

export default function ProcessingTimeChart({ processingTimes, loading }: ProcessingTimeChartProps) {
  const { t } = useLanguage();

  const chartData = VISA_TYPES.map((visa) => {
    const times = processingTimes[visa.subclass] || [];
    const avg = getAvgProcessingTime(times);
    const min = times.length ? Math.min(...times) : 0;
    const max = times.length ? Math.max(...times) : 0;
    return {
      name: `SC ${visa.subclass}`,
      fullName: visa.shortName,
      avg,
      min,
      max,
      color: visa.color,
      count: times.length,
    };
  }).filter((d) => d.avg > 0);

  if (loading) return <div className="glass-card p-6 h-80 shimmer" />;

  if (!chartData.length) {
    return (
      <div className="glass-card p-6 flex items-center justify-center h-64">
        <p className="text-[#3D6080] text-sm">{t("home.noData")}</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 animate-fade-up stagger-3">
      <h3 className="font-display font-semibold text-[#F0F4FF] mb-1">
        {t("home.charts.processingTime")}
      </h3>
      <p className="text-xs text-[#3D6080] mb-6">
        Application lodged → Visa granted (in days)
      </p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <XAxis
            dataKey="name"
            tick={{ fill: "#8BB8DC", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#3D6080", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}d`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,61,165,0.2)" }} />
          <Bar dataKey="avg" radius={[6, 6, 0, 0]} maxBarSize={48}>
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} opacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend detail */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-[rgba(0,61,165,0.3)]">
        {chartData.map((d) => (
          <div key={d.name} className="text-xs">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
              <span className="text-[#8BB8DC]">{d.name}</span>
            </div>
            <div className="font-bold" style={{ color: d.color }}>{d.avg}d avg</div>
            {d.min > 0 && (
              <div className="text-[10px] text-[#3D6080]">
                {d.min}–{d.max}d range
              </div>
            )}
            <div className="text-[10px] text-[#3D6080]">{d.count} samples</div>
          </div>
        ))}
      </div>
    </div>
  );
}
