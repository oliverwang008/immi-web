"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { ALL_VISA_TYPES } from "@/data/visas";

interface VisaDonutChartProps {
  data: Record<string, number>;
  loading: boolean;
  title: string;
  subtitle?: string;
}

const RADIAN = Math.PI / 180;

function CustomLabel({
  cx, cy, midAngle, innerRadius, outerRadius, percent,
}: {
  cx: number; cy: number; midAngle: number;
  innerRadius: number; outerRadius: number; percent: number;
}) {
  if (percent < 0.06) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="rgba(232,240,254,0.9)" textAnchor="middle"
      dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

function CustomTooltip({ active, payload }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { total: number; fullName: string } }>;
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const total = item.payload.total;
  return (
    <div className="glass-card px-4 py-3 text-sm shadow-2xl max-w-[200px]">
      <div className="font-semibold text-[#F0F4FF] mb-1 text-xs leading-tight">{item.payload.fullName}</div>
      <div className="text-[#8BB8DC]">{item.value.toLocaleString()} submissions</div>
      <div className="text-[#FFD200] font-medium">
        {total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%
      </div>
    </div>
  );
}

export default function VisaDonutChart({ data, loading, title, subtitle }: VisaDonutChartProps) {
  const { t } = useLanguage();

  const total = Object.values(data).reduce((a, b) => a + b, 0);

  const chartData = ALL_VISA_TYPES
    .filter((visa) => visa.subclass in data && data[visa.subclass] > 0)
    .map((visa) => ({
      name: `SC ${visa.subclass}`,
      fullName: `SC ${visa.subclass} — ${visa.shortName}`,
      value: data[visa.subclass],
      color: visa.color,
      total,
    }));

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
      <h3 className="font-display font-semibold text-[#F0F4FF] mb-1">{title}</h3>
      <p className="text-xs text-[#3D6080] mb-4">
        {subtitle ?? `${total.toLocaleString()} ${t("common.submissions")}`}
      </p>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            labelLine={false}
            label={CustomLabel}
          >
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} stroke="transparent" opacity={0.9} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span style={{ color: "#8BB8DC", fontSize: "11px" }}>{value}</span>
            )}
            iconSize={8}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
