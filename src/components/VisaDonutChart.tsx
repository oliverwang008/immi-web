"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { VISA_TYPES } from "@/data/visas";

interface VisaDonutChartProps {
  data: Record<string, number>;
  loading: boolean;
}

const RADIAN = Math.PI / 180;

function CustomLabel({
  cx, cy, midAngle, innerRadius, outerRadius, percent,
}: {
  cx: number; cy: number; midAngle: number;
  innerRadius: number; outerRadius: number; percent: number;
}) {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x} y={y}
      fill="rgba(232,240,254,0.9)"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { total: number } }> }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const total = item.payload.total;
  return (
    <div className="glass-card px-4 py-3 text-sm shadow-2xl">
      <div className="font-semibold text-[#F0F4FF] mb-1">Subclass {item.name}</div>
      <div className="text-[#8BB8DC]">
        {item.value.toLocaleString()} submissions
      </div>
      <div className="text-[#FFD200] font-medium">
        {total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%
      </div>
    </div>
  );
}

export default function VisaDonutChart({ data, loading }: VisaDonutChartProps) {
  const { t } = useLanguage();

  const total = Object.values(data).reduce((a, b) => a + b, 0);
  const chartData = VISA_TYPES.map((visa) => ({
    name: visa.subclass,
    label: visa.shortName,
    value: data[visa.subclass] || 0,
    color: visa.color,
    total,
  })).filter((d) => d.value > 0);

  if (loading) {
    return (
      <div className="glass-card p-6 h-80 shimmer" />
    );
  }

  if (!chartData.length) {
    return (
      <div className="glass-card p-6 flex items-center justify-center h-80">
        <p className="text-[#3D6080] text-sm">{t("home.noData")}</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 animate-fade-up stagger-1">
      <h3 className="font-display font-semibold text-[#F0F4FF] mb-1">
        {t("home.charts.visaDistribution")}
      </h3>
      <p className="text-xs text-[#3D6080] mb-6">
        {total.toLocaleString()} {t("common.submissions")}
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            labelLine={false}
            label={CustomLabel}
          >
            {chartData.map((entry) => (
              <Cell
                key={entry.name}
                fill={entry.color}
                stroke="transparent"
                opacity={0.9}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span style={{ color: "#8BB8DC", fontSize: "12px" }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
