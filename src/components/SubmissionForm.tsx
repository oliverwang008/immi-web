"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { VISA_TYPES, AUSTRALIAN_STATES, isStateSponsored, FAMILY_SPONSORED_VISAS } from "@/data/visas";
import { searchOccupations, Occupation } from "@/data/occupations";
import {
  POINTS_CRITERIA, POINTS_TESTED_VISAS, DEFAULT_POINTS_SCORE,
  PointsScore, calcTotalPoints, POINTS_MIN, UNSET_POINTS,
} from "@/data/points";
import { submitVisa } from "@/lib/firestore";
import {
  Search, ChevronRight, CheckCircle2,
  Shield, FileText, Clock, Award, MapPin, Star, Mail, Calendar, Info,
} from "lucide-react";
import clsx from "clsx";

// ── DatePicker ─────────────────────────────────────────────────────────
// Wraps <input type="date"> and calls showPicker() on the whole area so
// clicking anywhere (including the calendar icon) opens the OS picker.
interface DatePickerProps {
  value: string;
  onChange: (v: string) => void;
  max?: string;
  min?: string;
  hasError?: boolean;
}
function DatePicker({ value, onChange, max, min, hasError }: DatePickerProps) {
  const ref = useRef<HTMLInputElement>(null);
  const open = useCallback(() => {
    try { ref.current?.showPicker(); } catch { ref.current?.focus(); }
  }, []);
  return (
    <div
      className={clsx(
        "input-icon-wrap cursor-pointer rounded-[10px] transition-all",
        hasError ? "ring-1 ring-[#C8102E]" : ""
      )}
      onClick={open}
    >
      <Calendar size={15} className="input-icon pointer-events-none" />
      <input
        ref={ref}
        type="date"
        className={clsx("input-field cursor-pointer", hasError && "!border-[#C8102E]")}
        style={{ paddingLeft: "2.5rem" }}
        value={value}
        max={max}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => { e.stopPropagation(); open(); }}
      />
    </div>
  );
}

// ── Form state ─────────────────────────────────────────────────────────
interface FormState {
  currentStatus: string;   // "eoi_invited" | "grant_received" | ""
  statusDate: string;      // required
  eoiInvitedDate: string;  // optional – grant_received only
  eoiLodgeDate: string;    // optional – both statuses
  visaSubclass: string;
  sponsoringState: string;
  occupationCode: string;
  occupationTitle: string;
  occupationCategory: string;
  points: PointsScore;
  email: string;
  agreedToTerms: boolean;
}

const INITIAL_STATE: FormState = {
  currentStatus: "",
  statusDate: "",
  eoiInvitedDate: "",
  eoiLodgeDate: "",
  visaSubclass: "",
  sponsoringState: "",
  occupationCode: "",
  occupationTitle: "",
  occupationCategory: "",
  points: { ...DEFAULT_POINTS_SCORE },
  email: "",
  agreedToTerms: false,
};

// Step 0 → Status, Step 1 → Visa, Step 2 → Occupation, Step 3 → Details
const STEP_ICONS = [Clock, FileText, Search, Star];
const DATE_MAX = new Date().toISOString().split("T")[0];

function isValidDate(d: string) {
  if (!d) return false;
  if (d > DATE_MAX) return false;
  return !isNaN(new Date(d).getTime());
}

export default function SubmissionForm() {
  const { t, lang } = useLanguage();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [occupationSearch, setOccupationSearch] = useState("");
  const [occupationResults, setOccupationResults] = useState<Occupation[]>([]);
  const [showOccDropdown, setShowOccDropdown] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const occRef = useRef<HTMLDivElement>(null);

  const isPointsTested = POINTS_TESTED_VISAS.includes(form.visaSubclass);
  const isStateSponsoredVisa = isStateSponsored(form.visaSubclass);
  const hasFamilyOption = FAMILY_SPONSORED_VISAS.includes(form.visaSubclass);
  const totalPoints = calcTotalPoints(form.points);

  const steps = [
    t("submit.step.statusHistory"),
    t("submit.step.visa"),
    t("submit.step.occupation"),
    t("submit.step.details"),
  ];

  useEffect(() => {
    if (occupationSearch.trim().length > 0) {
      setOccupationResults(searchOccupations(occupationSearch, 12));
    } else {
      setOccupationResults([]);
      setShowOccDropdown(false);
    }
  }, [occupationSearch]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (occRef.current && !occRef.current.contains(e.target as Node)) {
        setShowOccDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isStateSponsored(form.visaSubclass)) {
      setForm((f) => ({ ...f, sponsoringState: "" }));
    }
  }, [form.visaSubclass]);

  const clearErr = (key: string) =>
    setErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });

  // ── Validation ──────────────────────────────────────────────────────
  const validate = (s: number): boolean => {
    const newErrors: Record<string, string> = {};

    // Step 0 — Status & dates
    if (s === 0) {
      if (!form.currentStatus) {
        newErrors.currentStatus = t("submit.required");
      } else {
        if (!form.statusDate) {
          newErrors.statusDate = t("submit.required");
        } else if (!isValidDate(form.statusDate)) {
          newErrors.statusDate = t("submit.error.invalidDate");
        } else if (form.statusDate > DATE_MAX) {
          newErrors.statusDate = t("submit.error.dateFuture");
        }

        if (form.eoiInvitedDate) {
          if (!isValidDate(form.eoiInvitedDate)) {
            newErrors.eoiInvitedDate = t("submit.error.invalidDate");
          } else if (form.eoiInvitedDate > DATE_MAX) {
            newErrors.eoiInvitedDate = t("submit.error.dateFuture");
          } else if (form.statusDate && form.eoiInvitedDate >= form.statusDate) {
            newErrors.eoiInvitedDate = t("submit.error.eoiInvitedBeforeGrant");
          }
        }

        if (form.eoiLodgeDate) {
          if (!isValidDate(form.eoiLodgeDate)) {
            newErrors.eoiLodgeDate = t("submit.error.invalidDate");
          } else if (form.eoiLodgeDate > DATE_MAX) {
            newErrors.eoiLodgeDate = t("submit.error.dateFuture");
          } else if (form.currentStatus === "eoi_invited") {
            if (form.statusDate && form.eoiLodgeDate >= form.statusDate) {
              newErrors.eoiLodgeDate = t("submit.error.eoiLodgeBeforeInvited");
            }
          } else if (form.currentStatus === "grant_received") {
            if (form.eoiInvitedDate && form.eoiLodgeDate >= form.eoiInvitedDate) {
              newErrors.eoiLodgeDate = t("submit.error.eoiLodgeBeforeInvited");
            } else if (!form.eoiInvitedDate && form.statusDate && form.eoiLodgeDate >= form.statusDate) {
              newErrors.eoiLodgeDate = t("submit.error.eoiLodgeBeforeGrant");
            }
          }
        }
      }
    }

    // Step 1 — Visa type
    if (s === 1) {
      if (!form.visaSubclass) newErrors.visaSubclass = t("submit.required");
      if (isStateSponsoredVisa && !form.sponsoringState) newErrors.sponsoringState = t("submit.required");
    }

    // Step 2 — Occupation
    if (s === 2 && !form.occupationCode) newErrors.occupation = t("submit.required");

    // Step 3 — Details
    if (s === 3) {
      if (!form.agreedToTerms) newErrors.terms = t("submit.terms.required");
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        newErrors.email = t("submit.required");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validate(step)) setStep((s) => Math.min(s + 1, steps.length - 1));
  };
  const prevStep = () => { setErrors({}); setStep((s) => Math.max(s - 1, 0)); };

  const handleSelectOccupation = (occ: Occupation) => {
    setForm((f) => ({
      ...f,
      occupationCode: occ.code,
      occupationTitle: occ.title,
      occupationCategory: occ.category,
    }));
    setOccupationSearch(occ.title);
    setShowOccDropdown(false);
  };

  const updatePoints = (key: keyof PointsScore, raw: string) => {
    const value = raw === "" ? UNSET_POINTS : Number(raw);
    setForm((f) => ({ ...f, points: { ...f.points, [key]: value } }));
  };

  const handleSubmit = async () => {
    if (!validate(3)) return;
    setSubmitting(true);
    setError("");
    try {
      const statuses: { status: string; date: string }[] = [];
      if (form.eoiLodgeDate) statuses.push({ status: "eoi_submitted", date: form.eoiLodgeDate });
      if (form.currentStatus === "grant_received" && form.eoiInvitedDate) {
        statuses.push({ status: "eoi_invited", date: form.eoiInvitedDate });
      }
      statuses.push({ status: form.currentStatus, date: form.statusDate });
      statuses.sort((a, b) => a.date.localeCompare(b.date));

      const storedPoints = Object.fromEntries(
        Object.entries(form.points).filter(([, v]) => v >= 0)
      ) as Record<string, number>;

      await submitVisa({
        visaSubclass: form.visaSubclass,
        occupationCode: form.occupationCode,
        occupationTitle: form.occupationTitle,
        occupationCategory: form.occupationCategory,
        ...(isStateSponsoredVisa && form.sponsoringState ? { sponsoringState: form.sponsoringState } : {}),
        statuses,
        currentStatus: form.currentStatus,
        statusDate: form.statusDate,
        ...(form.eoiLodgeDate ? { eoiLodgeDate: form.eoiLodgeDate } : {}),
        ...(form.currentStatus === "grant_received" && form.eoiInvitedDate
          ? { eoiInvitedDate: form.eoiInvitedDate } : {}),
        ...(isPointsTested && Object.keys(storedPoints).length
          ? { pointsScore: storedPoints, totalPoints } : {}),
        ...(form.email ? { email: form.email } : {}),
        lang,
      });
      setSubmitted(true);
    } catch {
      setError(t("submit.error"));
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setForm(INITIAL_STATE);
    setOccupationSearch("");
    setStep(0);
    setSubmitted(false);
    setError("");
    setErrors({});
  };

  // ── Success ─────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="glass-card border-gold-glow p-10 text-center animate-scale-in max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-[rgba(0,166,81,0.15)] border border-[rgba(0,166,81,0.3)] flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={32} className="text-[#00A651]" />
        </div>
        <h2 className="font-display text-2xl font-semibold text-[#F0F4FF] mb-3">{t("submit.success")}</h2>
        <p className="text-[#8BB8DC] mb-8 leading-relaxed">{t("submit.successMsg")}</p>
        <button onClick={reset} className="btn-primary mx-auto">{t("submit.anotherSubmit")}</button>
      </div>
    );
  }

  const statusOptions = [
    { key: "eoi_invited",    label: t("submit.status.eoiInvited"),  icon: <Calendar size={18} />, color: "#8BB8DC" },
    { key: "grant_received", label: t("submit.status.visaGranted"), icon: <CheckCircle2 size={18} />, color: "#00A651" },
  ];

  // ── Main form ────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto">

      {/* Progress stepper */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((label, i) => {
          const Icon = STEP_ICONS[i];
          const isActive = i === step;
          const isDone = i < step;
          return (
            <div key={i} className="flex items-center flex-1">
              <div
                className={clsx(
                  "flex flex-col items-center gap-1.5 cursor-pointer transition-all",
                  isActive ? "opacity-100" : isDone ? "opacity-80" : "opacity-40"
                )}
                onClick={() => isDone && setStep(i)}
              >
                <div className={clsx(
                  "w-9 h-9 rounded-xl flex items-center justify-center border transition-all",
                  isActive ? "bg-[rgba(255,210,0,0.12)] border-[rgba(255,210,0,0.5)] text-[#FFD200]"
                  : isDone  ? "bg-[rgba(0,166,81,0.12)]  border-[rgba(0,166,81,0.4)]  text-[#00A651]"
                            : "border-[rgba(0,61,165,0.5)] text-[#3D6080]"
                )}>
                  {isDone ? <CheckCircle2 size={16} /> : <Icon size={16} />}
                </div>
                <span className={clsx(
                  "text-[10px] font-medium text-center leading-tight hidden sm:block",
                  isActive ? "text-[#FFD200]" : isDone ? "text-[#00A651]" : "text-[#3D6080]"
                )}>
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-px mx-2 mt-[-14px] sm:mt-[-20px]">
                  <div className="h-full transition-all duration-500"
                    style={{ background: i < step ? "rgba(0,166,81,0.5)" : "rgba(0,61,165,0.35)" }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Step card */}
      <div className="glass-card p-6 sm:p-8 animate-fade-up">

        {/* ── Step 0: Status & Dates ────────────────────────────────── */}
        {step === 0 && (
          <div>
            <h2 className="font-display text-xl font-semibold text-[#F0F4FF] mb-1">
              {t("submit.step.statusHistory")}
            </h2>

            {/* Eligibility notice */}
            <div className="flex items-start gap-2.5 mt-3 mb-6 p-3.5 rounded-xl border border-[rgba(255,210,0,0.25)] bg-[rgba(255,210,0,0.05)]">
              <Info size={15} className="text-[#FFD200] shrink-0 mt-0.5" />
              <p className="text-xs text-[#8BB8DC] leading-relaxed">
                This tracker is for applicants who have already received an{" "}
                <span className="text-[#FFD200] font-semibold">EOI Invitation (ITA)</span> or had their{" "}
                <span className="text-[#00A651] font-semibold">Visa Granted</span>.
              </p>
            </div>

            {/* Status selection cards */}
            <p className="text-sm text-[#3D6080] mb-3">{t("submit.status.selectStatus")}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
              {statusOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => {
                    setForm((f) => ({
                      ...f,
                      currentStatus: opt.key,
                      statusDate: "",
                      eoiInvitedDate: "",
                      eoiLodgeDate: "",
                    }));
                    setErrors({});
                  }}
                  className={clsx(
                    "text-left p-4 rounded-xl border transition-all duration-200",
                    form.currentStatus === opt.key
                      ? "border-[rgba(255,210,0,0.5)] bg-[rgba(255,210,0,0.05)]"
                      : "border-[rgba(0,61,165,0.45)] bg-[rgba(0,16,40,0.4)] hover:border-[rgba(0,61,165,0.8)] hover:bg-[rgba(0,30,85,0.4)]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${opt.color}18`, color: opt.color, border: `1px solid ${opt.color}30` }}
                    >
                      {opt.icon}
                    </div>
                    <span className="text-sm font-semibold text-[#F0F4FF] flex-1">{opt.label}</span>
                    {form.currentStatus === opt.key && (
                      <CheckCircle2 size={15} className="shrink-0 text-[#FFD200]" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            {errors.currentStatus && <p className="text-[#C8102E] text-xs mb-4 mt-1">{errors.currentStatus}</p>}

            {/* Date fields — shown after status is chosen */}
            {form.currentStatus && (
              <div className="space-y-4 mt-5 animate-fade-in">

                {/* Required: date of selected status */}
                <div className="p-4 rounded-xl border border-[rgba(0,61,165,0.4)] bg-[rgba(0,16,40,0.4)]">
                  <label className="text-sm font-semibold text-[#F0F4FF] block mb-2">
                    {form.currentStatus === "eoi_invited"
                      ? t("submit.status.eoiInvited")
                      : t("submit.status.visaGranted")}
                    {" "}<span className="text-[#C8102E]">*</span>
                  </label>
                  <DatePicker
                    value={form.statusDate}
                    max={DATE_MAX}
                    hasError={!!errors.statusDate}
                    onChange={(v) => { setForm((f) => ({ ...f, statusDate: v })); clearErr("statusDate"); }}
                  />
                  {errors.statusDate && <p className="text-[#C8102E] text-[10px] mt-1">{errors.statusDate}</p>}
                </div>

                {/* Optional: EOI Invited Date — only for grant_received */}
                {form.currentStatus === "grant_received" && (
                  <div className="p-4 rounded-xl border border-[rgba(0,61,165,0.3)] bg-[rgba(0,16,40,0.3)] animate-fade-in">
                    <label className="text-sm font-medium text-[#8BB8DC] block mb-1">
                      {t("submit.status.eoiInvitedDate")}
                    </label>
                    <p className="text-[10px] text-[#3D6080] mb-2">{t("submit.status.eoiInvitedDateHint")}</p>
                    <DatePicker
                      value={form.eoiInvitedDate}
                      max={form.statusDate || DATE_MAX}
                      hasError={!!errors.eoiInvitedDate}
                      onChange={(v) => { setForm((f) => ({ ...f, eoiInvitedDate: v })); clearErr("eoiInvitedDate"); }}
                    />
                    {errors.eoiInvitedDate && <p className="text-[#C8102E] text-[10px] mt-1">{errors.eoiInvitedDate}</p>}
                  </div>
                )}

                {/* Optional: EOI Lodge Date — both statuses */}
                <div className="p-4 rounded-xl border border-[rgba(0,61,165,0.3)] bg-[rgba(0,16,40,0.3)]">
                  <label className="text-sm font-medium text-[#8BB8DC] block mb-1">
                    {t("submit.status.eoiLodgeDate")}
                  </label>
                  <p className="text-[10px] text-[#3D6080] mb-2">{t("submit.status.eoiLodgeDateHint")}</p>
                  <DatePicker
                    value={form.eoiLodgeDate}
                    max={
                      form.currentStatus === "eoi_invited"
                        ? (form.statusDate || DATE_MAX)
                        : (form.eoiInvitedDate || form.statusDate || DATE_MAX)
                    }
                    hasError={!!errors.eoiLodgeDate}
                    onChange={(v) => { setForm((f) => ({ ...f, eoiLodgeDate: v })); clearErr("eoiLodgeDate"); }}
                  />
                  {errors.eoiLodgeDate && <p className="text-[#C8102E] text-[10px] mt-1">{errors.eoiLodgeDate}</p>}
                </div>

              </div>
            )}
          </div>
        )}

        {/* ── Step 1: Visa Type ─────────────────────────────────────── */}
        {step === 1 && (
          <div>
            <h2 className="font-display text-xl font-semibold text-[#F0F4FF] mb-1">{t("submit.step.visa")}</h2>
            <p className="text-sm text-[#3D6080] mb-6">{t("submit.visa.select")}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {VISA_TYPES.map((visa) => (
                <button
                  key={visa.subclass}
                  onClick={() => setForm((f) => ({ ...f, visaSubclass: visa.subclass }))}
                  className={clsx(
                    "text-left p-4 rounded-xl border transition-all duration-200",
                    form.visaSubclass === visa.subclass
                      ? "border-[rgba(255,210,0,0.5)] bg-[rgba(255,210,0,0.05)]"
                      : "border-[rgba(0,61,165,0.45)] bg-[rgba(0,16,40,0.4)] hover:border-[rgba(0,61,165,0.8)] hover:bg-[rgba(0,30,85,0.4)]"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-display font-bold text-sm"
                      style={{ background: `${visa.color}18`, color: visa.color, border: `1px solid ${visa.color}30` }}
                    >
                      {visa.subclass}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#F0F4FF] leading-tight">{visa.shortName}</div>
                      <div className="text-[10px] text-[#3D6080] mt-1 leading-tight line-clamp-2">{visa.name}</div>
                    </div>
                    {form.visaSubclass === visa.subclass && (
                      <CheckCircle2 size={16} className="shrink-0 ml-auto" style={{ color: visa.color }} />
                    )}
                  </div>
                </button>
              ))}
            </div>
            {errors.visaSubclass && <p className="text-[#C8102E] text-xs mb-4">{errors.visaSubclass}</p>}

            {/* Sponsoring state */}
            {isStateSponsoredVisa && (
              <div className="animate-fade-in">
                <div className="p-4 rounded-xl border border-[rgba(0,61,165,0.4)] bg-[rgba(0,61,165,0.06)]">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin size={15} className="text-[#8BB8DC] shrink-0" />
                    <label className="text-sm font-semibold text-[#F0F4FF]">
                      {t("submit.state.label")} <span className="text-[#C8102E]">*</span>
                    </label>
                  </div>
                  <select
                    className="input-field"
                    value={form.sponsoringState}
                    onChange={(e) => setForm((f) => ({ ...f, sponsoringState: e.target.value }))}
                  >
                    <option value="">{t("submit.state.select")}</option>
                    {AUSTRALIAN_STATES.map((s) => (
                      <option key={s.code} value={s.code}>{s.name} ({s.code})</option>
                    ))}
                    {hasFamilyOption && (
                      <option value="FAMILY">{t("submit.state.family")}</option>
                    )}
                  </select>
                  {errors.sponsoringState && (
                    <p className="text-[#C8102E] text-xs mt-1.5">{errors.sponsoringState}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Step 2: Occupation ────────────────────────────────────── */}
        {step === 2 && (
          <div>
            <h2 className="font-display text-xl font-semibold text-[#F0F4FF] mb-1">{t("submit.step.occupation")}</h2>
            <p className="text-sm text-[#3D6080] mb-6">{t("submit.occupation.search")}</p>

            <div ref={occRef} className="relative mb-4">
              <div className="input-icon-wrap">
                <Search size={15} className="input-icon" />
                <input
                  type="text"
                  className="input-field"
                  style={{ paddingLeft: "2.5rem" }}
                  placeholder={t("submit.occupation.searchPlaceholder")}
                  value={occupationSearch}
                  onChange={(e) => {
                    setOccupationSearch(e.target.value);
                    setShowOccDropdown(true);
                    if (!e.target.value) {
                      setForm((f) => ({ ...f, occupationCode: "", occupationTitle: "", occupationCategory: "" }));
                    }
                  }}
                  onFocus={() => { if (occupationSearch.trim()) setShowOccDropdown(true); }}
                  autoComplete="off"
                />
              </div>

              {showOccDropdown && occupationResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl border border-[rgba(0,61,165,0.6)] bg-[#001540]/98 backdrop-blur-xl shadow-2xl overflow-hidden animate-fade-in">
                  <div className="max-h-72 overflow-y-auto">
                    {occupationResults.map((occ) => (
                      <button
                        key={occ.code}
                        className={clsx(
                          "w-full text-left px-4 py-3 transition-all hover:bg-[rgba(0,61,165,0.35)]",
                          form.occupationCode === occ.code && "bg-[rgba(255,210,0,0.07)]"
                        )}
                        onClick={() => handleSelectOccupation(occ)}
                      >
                        <div className="flex items-baseline gap-2">
                          <span className="text-[10px] font-mono text-[#3D6080] shrink-0 w-[52px]">{occ.code}</span>
                          <span className="text-sm text-[#F0F4FF] truncate">{occ.title}</span>
                        </div>
                        <div className="text-[10px] text-[#3D6080] mt-0.5 pl-[60px]">{occ.category}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {form.occupationCode && (
              <div className="p-4 rounded-xl border border-[rgba(0,166,81,0.3)] bg-[rgba(0,166,81,0.05)] animate-fade-in">
                <div className="flex items-center gap-3">
                  <Award size={18} className="text-[#00A651] shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-[#F0F4FF]">{form.occupationTitle}</div>
                    <div className="text-xs text-[#8BB8DC]">ANZSCO {form.occupationCode} · {form.occupationCategory}</div>
                  </div>
                </div>
              </div>
            )}
            {errors.occupation && <p className="text-[#C8102E] text-xs mt-2">{errors.occupation}</p>}
          </div>
        )}

        {/* ── Step 3: Details ───────────────────────────────────────── */}
        {step === 3 && (
          <div>
            <h2 className="font-display text-xl font-semibold text-[#F0F4FF] mb-6">{t("submit.step.details")}</h2>

            {/* Points — only for 189 / 190 / 491 */}
            {isPointsTested && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                  <Star size={15} className="text-[#FFD200]" />
                  <span className="text-sm font-semibold text-[#F0F4FF]">{t("submit.points.title")}</span>
                </div>
                <p className="text-xs text-[#3D6080] mb-5">{t("submit.points.subtitle")}</p>
                <div className="space-y-3">
                  {POINTS_CRITERIA.filter(
                    (c) => !c.applicableTo || c.applicableTo.includes(form.visaSubclass)
                  ).map((criterion) => {
                    const currentVal = form.points[criterion.key];
                    const selectVal = currentVal === UNSET_POINTS ? "" : String(currentVal);
                    return (
                      <div key={criterion.key} className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                        <label className="text-xs text-[#8BB8DC] font-medium">
                          {t(`submit.points.${criterion.label}` as Parameters<typeof t>[0])}
                        </label>
                        <select
                          className="input-field !py-2 text-sm"
                          value={selectVal}
                          onChange={(e) => updatePoints(criterion.key, e.target.value)}
                        >
                          <option value="">{t("submit.points.selectOption")}</option>
                          {criterion.options.map((opt) => (
                            <option key={`${criterion.key}|${opt.value}|${opt.label}`} value={String(opt.value)}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-5 p-4 rounded-xl border border-[rgba(255,210,0,0.25)] bg-[rgba(255,210,0,0.05)] flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#8BB8DC]">{t("submit.points.total")}</div>
                    <div className="text-[10px] text-[#3D6080]">{t("submit.points.minimum")}</div>
                  </div>
                  <div className={clsx(
                    "text-3xl font-display font-bold transition-colors",
                    totalPoints >= POINTS_MIN ? "text-[#00A651]"
                    : totalPoints > 0        ? "text-[#FFD200]"
                                             : "text-[#3D6080]"
                  )}>
                    {totalPoints}
                    <span className="text-sm font-normal text-[#3D6080] ml-1">pts</span>
                  </div>
                </div>
              </div>
            )}

            {/* Optional email */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Mail size={15} className="text-[#8BB8DC]" />
                <label className="text-sm font-semibold text-[#F0F4FF]">{t("submit.email.label")}</label>
              </div>
              <input
                type="email"
                className="input-field"
                placeholder={t("submit.email.placeholder")}
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                autoComplete="email"
              />
              {errors.email && <p className="text-[#C8102E] text-xs mt-1">{errors.email}</p>}
              <p className="text-[10px] text-[#3D6080] mt-1.5 leading-relaxed">{t("submit.email.hint")}</p>
            </div>

            {/* Terms */}
            <div className={clsx(
              "p-4 rounded-xl border transition-all",
              form.agreedToTerms ? "border-[rgba(0,166,81,0.35)] bg-[rgba(0,166,81,0.05)]"
              : errors.terms      ? "border-[rgba(200,16,46,0.4)] bg-[rgba(200,16,46,0.04)]"
                                  : "border-[rgba(0,61,165,0.4)]  bg-[rgba(0,16,40,0.3)]"
            )}>
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <div
                  className={clsx(
                    "w-5 h-5 rounded-md shrink-0 mt-0.5 flex items-center justify-center border-2 transition-all",
                    form.agreedToTerms ? "bg-[#00A651] border-[#00A651]" : "border-[rgba(0,61,165,0.8)] bg-transparent"
                  )}
                  onClick={() => setForm((f) => ({ ...f, agreedToTerms: !f.agreedToTerms }))}
                >
                  {form.agreedToTerms && (
                    <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                      <path d="M1 4L4 7L10 1" stroke="#000918" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <div>
                  <span className="text-sm font-semibold text-[#F0F4FF]">{t("submit.terms.label")}</span>
                  <p className="text-[11px] text-[#3D6080] mt-1 leading-relaxed">{t("submit.terms.text")}</p>
                </div>
              </label>
            </div>
            {errors.terms && (
              <p className="text-[#C8102E] text-xs mt-2 flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-[#C8102E] text-white text-[9px] flex items-center justify-center font-bold shrink-0">!</span>
                {errors.terms}
              </p>
            )}

            <div className="flex items-start gap-2 mt-4 p-3 rounded-lg bg-[rgba(0,61,165,0.12)] border border-[rgba(0,61,165,0.3)]">
              <Shield size={14} className="text-[#3D6080] shrink-0 mt-0.5" />
              <p className="text-[10px] text-[#3D6080] leading-relaxed">{t("submit.privacy")}</p>
            </div>

            {error && (
              <p className="text-[#C8102E] text-sm mt-3 p-3 rounded-lg bg-[rgba(200,16,46,0.08)] border border-[rgba(200,16,46,0.2)]">
                {error}
              </p>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[rgba(0,61,165,0.3)]">
          <button
            onClick={prevStep}
            className={clsx("btn-secondary", step === 0 && "opacity-0 pointer-events-none")}
          >
            {t("submit.nav.back")}
          </button>
          {step < steps.length - 1 ? (
            <button onClick={nextStep} className="btn-primary">
              {t("submit.nav.next")} <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={clsx("btn-primary", submitting && "opacity-60 cursor-not-allowed")}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#000918] border-t-transparent rounded-full animate-spin" />
                  {t("submit.submitting")}
                </span>
              ) : (
                <><Shield size={15} />{t("submit.submit")}</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
