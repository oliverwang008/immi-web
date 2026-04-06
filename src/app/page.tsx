"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import StatsCards from "@/components/StatsCards";
import VisaDonutChart from "@/components/VisaDonutChart";
import MonthlyOutcomesChart from "@/components/MonthlyOutcomesChart";
import OccupationChart from "@/components/OccupationChart";
import { useLanguage } from "@/contexts/LanguageContext";
import { fetchSubmissions, aggregateStats, AggregatedStats, VisaSubmission } from "@/lib/firestore";
import { VISA_TYPES } from "@/data/visas";
import { OCCUPATION_CATEGORIES } from "@/data/occupations";
import { PlusCircle, RefreshCw, Filter, Users, X } from "lucide-react";
import DatePicker from "@/components/DatePicker";
import clsx from "clsx";

const DATE_MAX = new Date().toISOString().split("T")[0];

function applyFilters(
  submissions: VisaSubmission[],
  filterVisa: string,
  filterDateFrom: string,
  filterDateTo: string,
  filterCategory: string,
  filterOccupation: string,
): VisaSubmission[] {
  return submissions.filter((sub) => {
    if (filterVisa && sub.visaSubclass !== filterVisa) return false;
    if (filterCategory && sub.occupationCategory !== filterCategory) return false;
    if (filterOccupation) {
      const q = filterOccupation.toLowerCase();
      if (
        !sub.occupationTitle?.toLowerCase().includes(q) &&
        !sub.occupationCode?.includes(filterOccupation)
      ) return false;
    }
    if (filterDateFrom || filterDateTo) {
      // Use explicit statusDate when available; fall back to submittedAt
      const dateStr =
        sub.statusDate ??
        (sub.submittedAt?.toDate
          ? sub.submittedAt.toDate().toISOString().split("T")[0]
          : null);
      if (!dateStr) return false;
      if (filterDateFrom && dateStr < filterDateFrom) return false;
      if (filterDateTo && dateStr > filterDateTo) return false;
    }
    return true;
  });
}

export default function HomePage() {
  const { t } = useLanguage();
  const [allSubmissions, setAllSubmissions] = useState<VisaSubmission[]>([]);
  const [stats, setStats] = useState<AggregatedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [filterVisa, setFilterVisa] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterOccupation, setFilterOccupation] = useState("");

  const hasActiveFilter = filterVisa || filterDateFrom || filterDateTo || filterCategory || filterOccupation;

  const clearFilters = () => {
    setFilterVisa("");
    setFilterDateFrom("");
    setFilterDateTo("");
    setFilterCategory("");
    setFilterOccupation("");
  };

  // Recompute stats whenever submissions or filters change
  useEffect(() => {
    if (!allSubmissions.length && !loading) { setStats(null); return; }
    const filtered = applyFilters(allSubmissions, filterVisa, filterDateFrom, filterDateTo, filterCategory, filterOccupation);
    setStats(aggregateStats(filtered));
  }, [allSubmissions, filterVisa, filterDateFrom, filterDateTo, filterCategory, filterOccupation, loading]);

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      const submissions = await fetchSubmissions(500);
      setAllSubmissions(submissions);
      setLastUpdated(new Date());
    } catch {
      setError(t("common.error"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [t]);

  useEffect(() => { loadData(); }, [loadData]);

  return (
    <div className="min-h-screen bg-[#000918] relative">
      <div className="fixed inset-0 bg-grid opacity-100 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,210,0,0.08) 0%, transparent 60%)" }} />
      </div>
      <div className="fixed bottom-0 right-0 w-96 h-96 pointer-events-none">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 100% 100%, rgba(0,166,81,0.04) 0%, transparent 60%)" }} />
      </div>

      <Header />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20">

        {/* Hero */}
        <section className="pt-14 pb-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(255,210,0,0.25)] bg-[rgba(255,210,0,0.06)] mb-5 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A651] animate-pulse" />
              <span className="text-xs font-medium text-[#FFD200] tracking-wide">Live community data</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight mb-4 animate-fade-up">
              <span className="text-[#F0F4FF]">{t("home.hero.title").split(" ").slice(0, 3).join(" ")}</span>
              <br />
              <span style={{ background: "linear-gradient(135deg, #FFF080 0%, #FFD200 50%, #CCB000 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                {t("home.hero.title").split(" ").slice(3).join(" ")}
              </span>
            </h1>
            <p className="text-[#8BB8DC] text-lg leading-relaxed mb-8 animate-fade-up stagger-1">
              {t("home.hero.subtitle")}
            </p>
            <div className="flex flex-wrap items-center gap-3 animate-fade-up stagger-2">
              <Link href="/submit" className="btn-primary">
                <PlusCircle size={16} />
                {t("home.hero.cta")}
              </Link>
              <div className="flex items-center gap-2 text-xs text-[#3D6080]">
                <Users size={13} />
                <span>{stats?.total?.toLocaleString() ?? "—"} {t("common.submissions")}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Filter bar */}
        <div className="glass-card p-4 mb-8 animate-fade-up stagger-2">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={13} className="text-[#3D6080]" />
            <span className="text-xs font-semibold text-[#8BB8DC] uppercase tracking-wider">{t("home.filter.title")}</span>
            {hasActiveFilter && (
              <button
                onClick={clearFilters}
                className="ml-auto flex items-center gap-1 text-[10px] text-[#3D6080] hover:text-[#C8102E] transition-colors"
              >
                <X size={11} />
                {t("home.filter.clear")}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* Visa type */}
            <select
              className="input-field !py-2 text-sm col-span-1"
              value={filterVisa}
              onChange={(e) => setFilterVisa(e.target.value)}
            >
              <option value="">{t("home.filter.allVisas")}</option>
              {VISA_TYPES.map((v) => (
                <option key={v.subclass} value={v.subclass}>
                  SC {v.subclass} — {v.name}
                </option>
              ))}
            </select>

            {/* Industry / category */}
            <select
              className="input-field !py-2 text-sm col-span-1"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">{t("home.filter.allIndustries")}</option>
              {OCCUPATION_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Occupation search */}
            <input
              type="text"
              className="input-field !py-2 text-sm col-span-2 sm:col-span-1"
              placeholder={t("home.filter.occupation")}
              value={filterOccupation}
              onChange={(e) => setFilterOccupation(e.target.value)}
            />

            {/* Date from */}
            <div className="flex flex-col gap-0.5 col-span-1">
              <label className="text-[10px] text-[#3D6080] px-0.5">{t("home.filter.dateFrom")}</label>
              <DatePicker
                value={filterDateFrom}
                max={filterDateTo || DATE_MAX}
                placeholder={t("home.filter.dateFrom")}
                onChange={(v) => setFilterDateFrom(v)}
              />
            </div>

            {/* Date to */}
            <div className="flex flex-col gap-0.5 col-span-1">
              <label className="text-[10px] text-[#3D6080] px-0.5">{t("home.filter.dateTo")}</label>
              <DatePicker
                value={filterDateTo}
                min={filterDateFrom}
                max={DATE_MAX}
                placeholder={t("home.filter.dateTo")}
                onChange={(v) => setFilterDateTo(v)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[rgba(0,61,165,0.2)]">
            <button
              onClick={() => loadData(true)}
              className={clsx("btn-secondary !py-1.5 text-xs", refreshing && "opacity-60")}
              disabled={refreshing}
            >
              <RefreshCw size={12} className={clsx(refreshing && "animate-spin")} />
              Refresh
            </button>
            {lastUpdated && (
              <span className="text-[10px] text-[#3D6080]">Updated {lastUpdated.toLocaleTimeString()}</span>
            )}
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl border border-[rgba(200,16,46,0.3)] bg-[rgba(200,16,46,0.06)] text-[#C8102E] text-sm mb-6">
            {error}. Make sure your Firebase project is configured in{" "}
            <code className="text-xs bg-[rgba(200,16,46,0.1)] px-1 py-0.5 rounded">.env.local</code>
          </div>
        )}

        {/* Stats cards */}
        <section className="mb-8">
          <StatsCards stats={stats} loading={loading} />
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <VisaDonutChart data={stats?.byVisa ?? {}} loading={loading} />
          <MonthlyOutcomesChart
            eoiInvitedByMonth={stats?.eoiInvitedByMonth ?? {}}
            grantedByMonth={stats?.grantedByMonth ?? {}}
            loading={loading}
          />
        </section>

        <section className="mb-6">
          <OccupationChart data={stats?.byOccupationCategory ?? {}} loading={loading} />
        </section>

        {/* CTA */}
        <div className="relative rounded-2xl overflow-hidden border border-[rgba(255,210,0,0.2)] animate-fade-up">
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(255,210,0,0.06) 0%, rgba(0,16,40,0.8) 50%, rgba(0,166,81,0.04) 100%)" }} />
          <div className="relative p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-display text-2xl font-semibold text-[#F0F4FF] mb-2">
                Help the community grow
              </h2>
              <p className="text-[#8BB8DC] text-sm">
                Share your anonymous visa journey and help thousands of applicants make informed decisions.
              </p>
            </div>
            <Link href="/submit" className="btn-primary shrink-0">
              <PlusCircle size={16} />
              {t("home.hero.cta")}
            </Link>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-[rgba(0,61,165,0.3)] py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#3D6080] text-center sm:text-left max-w-xl leading-relaxed">
              {t("footer.disclaimer")}
            </div>
            <div className="text-xs text-[#3D6080] whitespace-nowrap">
              © 2025 AussieVisa Tracker · {t("footer.rights")}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
