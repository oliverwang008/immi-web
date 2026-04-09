"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { ALL_VISA_TYPES } from "@/data/visas";

interface ProcessingTimeChartProps {
  /** visaSubclass → array of day counts (app-to-grant) */
  data: Record<string, number[]>;
  loading: boolean;
}

const RANGES = [
  { key: "lt3mo",   label: "< 3 months",  min: 0,   max: 90  },
  { key: "3to6mo",  label: "3–6 months",  min: 90,  max: 180 },
  { key: "6to12mo", label: "6–12 months", min: 180, max: 365 },
  { key: "1to2yr",  label: "1–2 years",   min: 365, max: 730 },
  { key: "gt2yr",   label: "> 2 years",   min: 730, max: Infinity },
];

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
          <span className="font-bold text-xs" style={{ color: p.color }}>{p.value} reports</span>
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

export default function ProcessingTimeChart({ data, loading }: ProcessingTimeChartProps) {
  const { t } = useLanguage();

  // Visa types that have at least one data point
  const activeVisas = ALL_VISA_TYPES.filter((v) => (data[v.subclass]?.length ?? 0) > 0);

  // Build range-bucket data: each row = one range, columns = visa subclasses
  const chartData = RANGES.map((range) => {
    const row: Record<string, string | number> = { range: range.label };
    activeVisas.forEach((v) => {
      row[`SC ${v.subclass}`] = (data[v.subclass] ?? []).filter(
        (d) => d >= range.min && d < range.max
      ).length;
    });
    return row;
  // Only include rows that have at least one report
  }).filter((row) => activeVisas.some((v) => (row[`SC ${v.subclass}`] as number) > 0));

  const totalReports = activeVisas.reduce((s, v) => s + (data[v.subclass]?.length ?? 0), 0);

  if (loading) return <div className="glass-card p-6 h-64 shimmer" />;

  if (!chartData.length) {
    return (
      <div className="glass-card p-6 flex flex-col items-center justify-center h-48 gap-2">
        <p className="text-[#3D6080] text-sm">{t("home.noData")}</p>
        <p className="text-[#3D6080] text-xs text-center max-w-xs">
          Requires visa application lodged date — being collected from new submissions
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 animate-fade-up">
      <h3 className="font-display font-semibold text-[#F0F4FF] mb-1">Processing Time Distribution</h3>
      <p className="text-xs text-[#3D6080] mb-5">
        Reports by time range — application lodged to visa granted · {totalReports} reports
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -10 }} barCategoryGap="28%" barGap={0}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,61,165,0.2)" vertical={false} />
          <XAxis dataKey="range" tick={{ fill: "#3D6080", fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#3D6080", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Legend wrapperStyle={{ fontSize: 10, color: "#8BB8DC", paddingTop: 10 }} iconType="square" iconSize={9} />
          {activeVisas.map((v, i) => (
            <Bar
              key={v.subclass}
              dataKey={`SC ${v.subclass}`}
              stackId="visa"
              fill={v.color}
              opacity={0.88}
              radius={i === activeVisas.length - 1 ? [3, 3, 0, 0] : [0, 0, 0, 0]}
              maxBarSize={48}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
      <p className="text-[10px] text-[#3D6080] mt-3 italic">
        * Includes backfilled estimates for submissions missing lodgement date.
      </p>
    </div>
  );
}
