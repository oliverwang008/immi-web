"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { AggregatedStats } from "@/lib/firestore";
import AnimatedCounter from "./AnimatedCounter";
import { MailOpen, CheckCircle, Layers } from "lucide-react";

interface StatsCardsProps {
  stats: AggregatedStats | null;
  loading: boolean;
}

export default function StatsCards({ stats, loading }: StatsCardsProps) {
  const { t } = useLanguage();

  const grantRate =
    stats && stats.total > 0
      ? `${((stats.granted / stats.total) * 100).toFixed(1)}%`
      : "—";

  const cards = [
    {
      label: t("home.stats.eoiInvited"),
      value: stats?.eoiInvited ?? 0,
      icon: <MailOpen size={20} />,
      suffix: "",
      color: "#8BB8DC",
      bg: "rgba(139,184,220,0.08)",
      border: "rgba(139,184,220,0.2)",
      detail: stats?.total
        ? `${(((stats.eoiInvited) / stats.total) * 100).toFixed(1)}% ${t("common.percentage")}`
        : "—",
    },
    {
      label: t("home.stats.visaGranted"),
      value: stats?.granted ?? 0,
      icon: <CheckCircle size={20} />,
      suffix: "",
      color: "#00A651",
      bg: "rgba(0,166,81,0.08)",
      border: "rgba(0,166,81,0.2)",
      detail: `${grantRate} grant rate`,
    },
    {
      label: t("home.stats.total"),
      value: stats?.total ?? 0,
      icon: <Layers size={20} />,
      suffix: "",
      color: "#FFD200",
      bg: "rgba(255,210,0,0.08)",
      border: "rgba(255,210,0,0.2)",
      detail: `${Object.keys(stats?.byVisa ?? {}).length} visa types`,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="glass-card p-5 h-28 shimmer"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className="glass-card p-5 animate-fade-up"
          style={{
            animationDelay: `${i * 0.1}s`,
            background: card.bg,
            borderColor: card.border,
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <div
              className="p-2 rounded-lg"
              style={{ background: `${card.color}20`, color: card.color }}
            >
              {card.icon}
            </div>
          </div>
          <div
            className="text-3xl font-display font-bold mb-1"
            style={{ color: card.color }}
          >
            <AnimatedCounter target={card.value} suffix={card.suffix} duration={1600 + i * 100} />
          </div>
          <div className="text-xs text-[#8BB8DC] font-medium uppercase tracking-wider leading-tight">
            {card.label}
          </div>
          {card.detail && (
            <div className="text-[10px] text-[#3D6080] mt-1">{card.detail}</div>
          )}
        </div>
      ))}
    </div>
  );
}
