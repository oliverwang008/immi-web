"use client";

import Header from "@/components/Header";
import SubmissionForm from "@/components/SubmissionForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, Users, TrendingUp, Clock } from "lucide-react";

export default function SubmitPage() {
  const { t } = useLanguage();

  const benefits = [
    {
      icon: <Users size={18} />,
      title: t("submit.benefit.helpOthers.title"),
      desc: t("submit.benefit.helpOthers.desc"),
      color: "#FFD200",
    },
    {
      icon: <Shield size={18} />,
      title: t("submit.benefit.anonymous.title"),
      desc: t("submit.benefit.anonymous.desc"),
      color: "#00A651",
    },
    {
      icon: <TrendingUp size={18} />,
      title: t("submit.benefit.insights.title"),
      desc: t("submit.benefit.insights.desc"),
      color: "#8BB8DC",
    },
    {
      icon: <Clock size={18} />,
      title: t("submit.benefit.quick.title"),
      desc: t("submit.benefit.quick.desc"),
      color: "#c47ac7",
    },
  ];

  return (
    <div className="min-h-screen bg-[#000918] relative">
      {/* Background */}
      <div className="fixed inset-0 bg-grid pointer-events-none" />
      <div className="fixed top-0 right-0 w-[600px] h-[400px] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 100% 0%, rgba(0,166,81,0.06) 0%, transparent 60%)",
          }}
        />
      </div>
      <div className="fixed bottom-0 left-0 w-96 h-96 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 0% 100%, rgba(255,210,0,0.04) 0%, transparent 60%)",
          }}
        />
      </div>

      <Header />

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        {/* Hero */}
        <section className="pt-12 pb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(0,166,81,0.3)] bg-[rgba(0,166,81,0.06)] mb-5 animate-fade-in">
            <Shield size={12} className="text-[#00A651]" />
            <span className="text-xs font-medium text-[#00A651] tracking-wide">
              {t("submit.badge")}
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#F0F4FF] mb-4 animate-fade-up">
            {t("submit.title")}
          </h1>
          <p className="text-[#8BB8DC] text-lg max-w-xl mx-auto animate-fade-up stagger-1">
            {t("submit.subtitle")}
          </p>
        </section>

        {/* Benefits */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 animate-fade-up stagger-2">
          {benefits.map((b, i) => (
            <div
              key={b.title}
              className="glass-card p-4 text-center animate-fade-up"
              style={{
                animationDelay: `${i * 0.08}s`,
                borderColor: `${b.color}20`,
                background: `${b.color}06`,
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ background: `${b.color}15`, color: b.color }}
              >
                {b.icon}
              </div>
              <div className="text-xs font-bold text-[#F0F4FF] mb-1">{b.title}</div>
              <div className="text-[10px] text-[#3D6080] leading-relaxed">{b.desc}</div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="animate-fade-up stagger-3">
          <SubmissionForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[rgba(0,61,165,0.3)] py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs text-[#3D6080] text-center max-w-xl mx-auto leading-relaxed">
            {t("footer.disclaimer")}
          </p>
        </div>
      </footer>
    </div>
  );
}
