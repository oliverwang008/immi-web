"use client";

import Header from "@/components/Header";
import SubmissionForm from "@/components/SubmissionForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { Shield } from "lucide-react";

export default function SubmitPage() {
  const { t } = useLanguage();

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

        {/* Form */}
        <div className="animate-fade-up stagger-3">
          <SubmissionForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[rgba(0,61,165,0.3)] py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#3D6080] text-center sm:text-left max-w-xl leading-relaxed">
            {t("footer.disclaimer")}
          </p>
          <div className="flex flex-col sm:items-end gap-1 shrink-0">
            <a href="mailto:support@olitech.org" className="text-xs text-[#3D6080] hover:text-[#8BB8DC] transition-colors">
              support@olitech.org
            </a>
            <div className="text-xs text-[#3D6080] whitespace-nowrap">
              © 2025 OLITECH AI PTY LTD · {t("footer.rights")}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
