import Header from "@/components/Header";
import NewsStateCard from "@/components/NewsStateCard";
import { fetchAllImmigrationNews } from "@/lib/immigration-news";
import { Clock, RefreshCw, Newspaper } from "lucide-react";

export const revalidate = 3600;

export const metadata = {
  title: "Immigration News | AussieVisa Tracker",
  description:
    "Latest Australian state & territory immigration news. Updates on skilled visa nominations, migration programs, and state-sponsored visa rounds from NSW, VIC, QLD, WA, SA, TAS, ACT and NT.",
};

export default async function NewsPage() {
  const groups = await fetchAllImmigrationNews();
  const fetchedAt = new Date().toLocaleString("en-AU", {
    timeZone: "Australia/Sydney",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const totalItems = groups.reduce((sum, g) => sum + g.items.length, 0);
  const activeStates = groups.filter((g) => g.items.length > 0).length;

  return (
    <div className="min-h-screen bg-[#000918] relative">
      <div className="fixed inset-0 bg-grid opacity-100 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(255,210,0,0.07) 0%, transparent 60%)",
          }}
        />
      </div>

      <Header />

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        {/* Page hero */}
        <section className="pt-12 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(255,210,0,0.25)] bg-[rgba(255,210,0,0.06)] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD200]" />
            <span className="text-xs font-medium text-[#FFD200] tracking-wide">
              State &amp; Territory Updates
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#F0F4FF] mb-3 leading-tight">
            Australian Immigration{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #FFF080 0%, #FFD200 50%, #CCB000 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              News
            </span>
          </h1>
          <p className="text-[#8BB8DC] text-base leading-relaxed max-w-2xl">
            Latest official updates from all Australian state and territory immigration
            authorities — skilled visa nominations, EOI rounds, and program changes.
          </p>
        </section>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            {
              value: totalItems,
              label: "Articles found",
              color: "#FFD200",
            },
            {
              value: `${activeStates}/8`,
              label: "States with updates",
              color: "#00A651",
            },
            {
              value: "1 hr",
              label: "Cache refresh",
              color: "#8BB8DC",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass-card p-4 text-center"
              style={{ borderColor: `${stat.color}20`, background: `${stat.color}06` }}
            >
              <div
                className="text-xl font-bold font-mono-num"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
              <div className="text-[11px] text-[#3D6080] mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Section heading */}
        <div className="flex items-center gap-3 mb-5">
          <Newspaper size={16} className="text-[#8BB8DC]" />
          <span className="text-sm font-semibold text-[#8BB8DC] uppercase tracking-wider">
            By State &amp; Territory
          </span>
          <div className="flex-1 h-px bg-[rgba(0,61,165,0.3)]" />
          <div className="flex items-center gap-1.5 text-[11px] text-[#3D6080]">
            <Clock size={11} />
            <span>Updated {fetchedAt} AEST</span>
          </div>
        </div>

        {/* State cards */}
        <div className="space-y-3">
          {groups.map((group, i) => (
            <NewsStateCard
              key={group.state}
              group={group}
              defaultOpen={i === 0 && group.items.length > 0}
            />
          ))}
        </div>

        {/* Revalidation note */}
        <div className="mt-8 flex items-start gap-2.5 px-4 py-3 rounded-xl border border-[rgba(0,61,165,0.3)] bg-[rgba(0,21,64,0.4)]">
          <RefreshCw size={13} className="flex-shrink-0 mt-0.5 text-[#3D6080]" />
          <p className="text-xs text-[#3D6080] leading-relaxed">
            News is cached and automatically refreshed every hour. If a state source is
            temporarily unavailable, previously cached data or a fallback message is shown.
            All links open the official government websites directly.
          </p>
        </div>
      </main>

      <footer className="relative z-10 border-t border-[rgba(0,61,165,0.3)] py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#3D6080] text-center sm:text-left max-w-xl leading-relaxed">
            News sourced directly from official Australian state and territory government
            websites. AussieVisa Tracker is not affiliated with any government body.
          </div>
          <div className="flex flex-col sm:items-end gap-1">
            <a
              href="mailto:support@olitech.org"
              className="text-xs text-[#3D6080] hover:text-[#8BB8DC] transition-colors"
            >
              support@olitech.org
            </a>
            <div className="text-xs text-[#3D6080] whitespace-nowrap">
              © 2025 OLITECH AI PTY LTD · All rights reserved
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
