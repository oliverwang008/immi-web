"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import DatePicker from "@/components/DatePicker";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  ALL_VISA_TYPES, SKILL_VISA_SUBCLASSES, AUSTRALIAN_STATES,
  isStateSponsored, FAMILY_SPONSORED_VISAS, VISA_CATEGORY_LABELS,
  getVisaBySubclass,
} from "@/data/visas";
import { searchOccupations, Occupation } from "@/data/occupations";
import {
  POINTS_CRITERIA, DEFAULT_POINTS_SCORE,
  PointsScore, calcTotalPoints, POINTS_MIN, UNSET_POINTS,
} from "@/data/points";
import { submitVisa } from "@/lib/firestore";
import {
  Search, ChevronRight, CheckCircle2,
  Shield, Clock, Star, Mail, Calendar, Info, MapPin,
} from "lucide-react";
import clsx from "clsx";

// ── Form state ─────────────────────────────────────────────────────────
interface FormState {
  currentStatus: string;        // "eoi_invited" | "grant_received"
  statusDate: string;           // required
  visaApplicationDate: string;  // required for grant_received; before grant date
  eoiInvitedDate: string;       // optional – grant_received only
  eoiLodgeDate: string;         // optional – both statuses
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
  visaApplicationDate: "",
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

const DATE_MAX = new Date().toISOString().split("T")[0];

function isValidDate(d: string) {
  if (!d) return false;
  if (d > DATE_MAX) return false;
  return !isNaN(new Date(d).getTime());
}

// Group ALL_VISA_TYPES by category for the grouped dropdown
const GROUPED_VISAS = Object.entries(VISA_CATEGORY_LABELS).map(([cat, label]) => ({
  label,
  visas: ALL_VISA_TYPES.filter((v) => v.category === cat),
})).filter((g) => g.visas.length > 0);

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
  const [pointsOptIdx, setPointsOptIdx] = useState<Record<string, number>>({});
  const [shareScore, setShareScore] = useState<boolean | null>(null);
  const occRef = useRef<HTMLDivElement>(null);

  const selectedVisa = useMemo(() => getVisaBySubclass(form.visaSubclass), [form.visaSubclass]);
  const isPointsTested = selectedVisa?.hasPoints ?? false;
  const needsOccupation = selectedVisa?.hasOccupation ?? false;
  const isStateSponsoredVisa = isStateSponsored(form.visaSubclass);
  const hasFamilyOption = FAMILY_SPONSORED_VISAS.includes(form.visaSubclass);
  const totalPoints = calcTotalPoints(form.points);

  // Dynamic steps: step 0 = outcome+visa, step 1 (conditional) = occupation, last = details
  const steps = useMemo(() => [
    t("submit.step.statusHistory"),
    ...(needsOccupation ? [t("submit.step.occupation")] : []),
    t("submit.step.review"),
  ], [t, needsOccupation]);

  const stepIcons = useMemo(() => [
    Clock,
    ...(needsOccupation ? [Search] : []),
    Star,
  ], [needsOccupation]);

  const detailsStep = steps.length - 1;

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

  // Reset occupation if new visa doesn't need it
  useEffect(() => {
    if (form.visaSubclass && !needsOccupation) {
      setForm((f) => ({ ...f, occupationCode: "", occupationTitle: "", occupationCategory: "" }));
      setOccupationSearch("");
    }
  }, [form.visaSubclass, needsOccupation]);

  const clearErr = (key: string) =>
    setErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });

  // ── Validation ──────────────────────────────────────────────────────
  const validate = (s: number): boolean => {
    const newErrors: Record<string, string> = {};

    // Step 0 — Outcome, dates, visa type, state
    if (s === 0) {
      if (!form.currentStatus) {
        newErrors.currentStatus = t("submit.required");
      } else {
        // Status date
        if (!form.statusDate) {
          newErrors.statusDate = t("submit.required");
        } else if (!isValidDate(form.statusDate)) {
          newErrors.statusDate = t("submit.error.invalidDate");
        }

        // Visa application date — mandatory for grant_received
        if (form.currentStatus === "grant_received") {
          if (!form.visaApplicationDate) {
            newErrors.visaApplicationDate = t("submit.required");
          } else if (!isValidDate(form.visaApplicationDate)) {
            newErrors.visaApplicationDate = t("submit.error.invalidDate");
          } else if (form.statusDate && form.visaApplicationDate >= form.statusDate) {
            newErrors.visaApplicationDate = t("submit.error.visaAppBeforeGrant");
          }
        }

        // EOI invited date (optional, grant_received)
        if (form.eoiInvitedDate) {
          if (!isValidDate(form.eoiInvitedDate)) {
            newErrors.eoiInvitedDate = t("submit.error.invalidDate");
          } else if (form.statusDate && form.eoiInvitedDate >= form.statusDate) {
            newErrors.eoiInvitedDate = t("submit.error.eoiInvitedBeforeGrant");
          } else if (form.visaApplicationDate && form.eoiInvitedDate >= form.visaApplicationDate) {
            newErrors.eoiInvitedDate = t("submit.error.eoiInvitedBeforeGrant");
          }
        }

        // EOI lodge date (optional)
        if (form.eoiLodgeDate) {
          if (!isValidDate(form.eoiLodgeDate)) {
            newErrors.eoiLodgeDate = t("submit.error.invalidDate");
          } else if (form.currentStatus === "eoi_invited") {
            if (form.statusDate && form.eoiLodgeDate >= form.statusDate) {
              newErrors.eoiLodgeDate = t("submit.error.eoiLodgeBeforeInvited");
            }
          } else if (form.currentStatus === "grant_received") {
            if (form.eoiInvitedDate && form.eoiLodgeDate >= form.eoiInvitedDate) {
              newErrors.eoiLodgeDate = t("submit.error.eoiLodgeBeforeInvited");
            } else if (!form.eoiInvitedDate && form.visaApplicationDate && form.eoiLodgeDate >= form.visaApplicationDate) {
              newErrors.eoiLodgeDate = t("submit.error.eoiLodgeBeforeInvited");
            }
          }
        }
      }

      // Visa subclass required
      if (!form.visaSubclass) newErrors.visaSubclass = t("submit.required");

      // State required if applicable
      if (isStateSponsoredVisa && !form.sponsoringState) newErrors.sponsoringState = t("submit.required");
    }

    // Step 1 — Occupation (only when needsOccupation)
    if (s === 1 && needsOccupation) {
      if (!form.occupationCode) newErrors.occupation = t("submit.required");
    }

    // Details step
    if (s === detailsStep) {
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
    if (!validate(detailsStep)) return;
    setSubmitting(true);
    setError("");
    try {
      const statuses: { status: string; date: string }[] = [];
      if (form.eoiLodgeDate) statuses.push({ status: "eoi_submitted", date: form.eoiLodgeDate });
      if (form.currentStatus === "grant_received" && form.eoiInvitedDate) {
        statuses.push({ status: "eoi_invited", date: form.eoiInvitedDate });
      }
      if (form.currentStatus === "grant_received" && form.visaApplicationDate) {
        statuses.push({ status: "application_lodged", date: form.visaApplicationDate });
      }
      statuses.push({ status: form.currentStatus, date: form.statusDate });
      statuses.sort((a, b) => a.date.localeCompare(b.date));

      const storedPoints = Object.fromEntries(
        Object.entries(form.points).filter(([, v]) => v >= 0)
      ) as Record<string, number>;

      await submitVisa({
        visaSubclass: form.visaSubclass,
        ...(needsOccupation && form.occupationCode ? {
          occupationCode: form.occupationCode,
          occupationTitle: form.occupationTitle,
          occupationCategory: form.occupationCategory,
        } : {
          occupationCode: "",
          occupationTitle: "",
          occupationCategory: "",
        }),
        ...(isStateSponsoredVisa && form.sponsoringState ? { sponsoringState: form.sponsoringState } : {}),
        statuses,
        currentStatus: form.currentStatus,
        statusDate: form.statusDate,
        ...(form.eoiLodgeDate ? { eoiLodgeDate: form.eoiLodgeDate } : {}),
        ...(form.currentStatus === "grant_received" && form.eoiInvitedDate
          ? { eoiInvitedDate: form.eoiInvitedDate } : {}),
        ...(form.currentStatus === "grant_received" && form.visaApplicationDate
          ? { visaApplicationDate: form.visaApplicationDate } : {}),
        ...(isPointsTested && shareScore === true && Object.keys(storedPoints).length
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
    setShareScore(null);
    setPointsOptIdx({});
  };

  // ── Success ─────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="glass-card border-gold-glow p-10 text-center animate-scale-in max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-[rgba(0,166,81,0.15)] border border-[rgba(0,166,81,0.3)] flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={32} className="text-[#00A651]" />
        </div>
        <h2 className="font-display text-2xl font-semibold text-[#F0F4FF] mb-3">{t("submit.success")}</h2>
        <p className="text-[#8BB8DC] leading-relaxed">{t("submit.successMsg")}</p>
      </div>
    );
  }

  const statusOptions = [
    { key: "eoi_invited",    label: t("submit.status.eoiInvited"),  icon: <Calendar size={18} />, color: "#8BB8DC" },
    { key: "grant_received", label: t("submit.status.visaGranted"), icon: <CheckCircle2 size={18} />, color: "#00A651" },
  ];

  // Visa options depend on selected outcome
  const availableVisas = form.currentStatus === "eoi_invited"
    ? ALL_VISA_TYPES.filter((v) => SKILL_VISA_SUBCLASSES.includes(v.subclass))
    : ALL_VISA_TYPES;

  // ── Main form ────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto">

      {/* Progress stepper */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((label, i) => {
          const Icon = stepIcons[i];
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

        {/* ── Step 0: Outcome + Visa + State ───────────────────────── */}
        {step === 0 && (
          <div>
            <h2 className="font-display text-xl font-semibold text-[#F0F4FF] mb-1">
              {t("submit.step.statusHistory")}
            </h2>

            {/* Eligibility notice */}
            <div className="flex items-start gap-2.5 mt-3 mb-6 p-3.5 rounded-xl border border-[rgba(255,210,0,0.25)] bg-[rgba(255,210,0,0.05)]">
              <Info size={15} className="text-[#FFD200] shrink-0 mt-0.5" />
              <p className="text-xs text-[#8BB8DC] leading-relaxed">
                {t("submit.status.eligibilityNotice")}
              </p>
            </div>

            {/* Outcome selection */}
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
                      visaApplicationDate: "",
                      eoiInvitedDate: "",
                      eoiLodgeDate: "",
                      visaSubclass: "",
                      sponsoringState: "",
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
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${opt.color}18`, color: opt.color, border: `1px solid ${opt.color}30` }}>
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

            {/* Fields shown after outcome is chosen */}
            {form.currentStatus && (
              <div className="space-y-4 mt-5 animate-fade-in">

                {/* ① Visa subclass — first choice after outcome */}
                <div className="p-4 rounded-xl border border-[rgba(0,61,165,0.4)] bg-[rgba(0,16,40,0.4)]">
                  <label className="text-sm font-semibold text-[#F0F4FF] block mb-2">
                    Visa Subclass <span className="text-[#C8102E]">*</span>
                    {form.currentStatus === "eoi_invited" && (
                      <span className="ml-2 text-[10px] text-[#3D6080] font-normal">(EOI-eligible visas only)</span>
                    )}
                  </label>
                  <select
                    className="input-field"
                    value={form.visaSubclass}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, visaSubclass: e.target.value, sponsoringState: "" }));
                      clearErr("visaSubclass");
                    }}
                  >
                    <option value="">Select visa subclass</option>
                    {form.currentStatus === "eoi_invited" ? (
                      availableVisas.map((v) => (
                        <option key={v.subclass} value={v.subclass}>
                          SC {v.subclass} — {v.name}
                        </option>
                      ))
                    ) : (
                      GROUPED_VISAS.map((group) => (
                        <optgroup key={group.label} label={group.label}>
                          {group.visas.map((v) => (
                            <option key={v.subclass} value={v.subclass}>
                              SC {v.subclass} — {v.name}
                            </option>
                          ))}
                        </optgroup>
                      ))
                    )}
                  </select>
                  {errors.visaSubclass && <p className="text-[#C8102E] text-xs mt-1.5">{errors.visaSubclass}</p>}
                </div>

                {/* ② Sponsoring state — appears immediately if applicable */}
                {form.visaSubclass && isStateSponsoredVisa && (
                  <div className="p-4 rounded-xl border border-[rgba(0,61,165,0.4)] bg-[rgba(0,61,165,0.06)] animate-fade-in">
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
                )}

                {/* ③ Date fields */}
                {/* Grant / EOI date */}
                <div className="p-4 rounded-xl border border-[rgba(0,61,165,0.4)] bg-[rgba(0,16,40,0.4)]">
                  <label className="text-sm font-semibold text-[#F0F4FF] block mb-2">
                    {form.currentStatus === "eoi_invited"
                      ? t("submit.status.eoiInvited")
                      : t("submit.status.visaGrantedDate")}
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

                {/* Visa Application Date — mandatory for grant_received */}
                {form.currentStatus === "grant_received" && (
                  <div className="p-4 rounded-xl border border-[rgba(0,61,165,0.4)] bg-[rgba(0,16,40,0.4)] animate-fade-in">
                    <label className="text-sm font-semibold text-[#F0F4FF] block mb-1">
                      {t("submit.status.visaApplicationDate")} <span className="text-[#C8102E]">*</span>
                    </label>
                    <p className="text-[10px] text-[#3D6080] mb-2">{t("submit.status.visaApplicationDateHint")}</p>
                    <DatePicker
                      value={form.visaApplicationDate}
                      max={form.statusDate || DATE_MAX}
                      hasError={!!errors.visaApplicationDate}
                      onChange={(v) => { setForm((f) => ({ ...f, visaApplicationDate: v })); clearErr("visaApplicationDate"); }}
                    />
                    {errors.visaApplicationDate && <p className="text-[#C8102E] text-[10px] mt-1">{errors.visaApplicationDate}</p>}
                  </div>
                )}

                {/* EOI Invited Date — optional, grant_received + skill visas only */}
                {form.currentStatus === "grant_received" && SKILL_VISA_SUBCLASSES.includes(form.visaSubclass) && (
                  <div className="p-4 rounded-xl border border-[rgba(0,61,165,0.3)] bg-[rgba(0,16,40,0.3)] animate-fade-in">
                    <label className="text-sm font-medium text-[#8BB8DC] block mb-1">
                      {t("submit.status.eoiInvitedDate")}
                    </label>
                    <p className="text-[10px] text-[#3D6080] mb-2">{t("submit.status.eoiInvitedDateHint")}</p>
                    <DatePicker
                      value={form.eoiInvitedDate}
                      max={form.visaApplicationDate || form.statusDate || DATE_MAX}
                      hasError={!!errors.eoiInvitedDate}
                      clearable
                      onChange={(v) => { setForm((f) => ({ ...f, eoiInvitedDate: v })); clearErr("eoiInvitedDate"); }}
                    />
                    {errors.eoiInvitedDate && <p className="text-[#C8102E] text-[10px] mt-1">{errors.eoiInvitedDate}</p>}
                  </div>
                )}

                {/* EOI Submission Date — skill visas only */}
                {SKILL_VISA_SUBCLASSES.includes(form.visaSubclass) && (
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
                          : (form.eoiInvitedDate || form.visaApplicationDate || form.statusDate || DATE_MAX)
                      }
                      hasError={!!errors.eoiLodgeDate}
                      clearable
                      onChange={(v) => { setForm((f) => ({ ...f, eoiLodgeDate: v })); clearErr("eoiLodgeDate"); }}
                    />
                    {errors.eoiLodgeDate && <p className="text-[#C8102E] text-[10px] mt-1">{errors.eoiLodgeDate}</p>}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Occupation step ───────────────────────────────────────── */}
        {needsOccupation && step === 1 && (
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
                  <Search size={18} className="text-[#00A651] shrink-0" />
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

        {/* ── Details step ─────────────────────────────────────────── */}
        {step === detailsStep && (
          <div>
            <h2 className="font-display text-xl font-semibold text-[#F0F4FF] mb-6">{t("submit.step.review")}</h2>

            {/* Points — only for 189 / 190 / 491 */}
            {isPointsTested && (
              <div className="mb-8">
                <div className="p-4 rounded-xl border border-[rgba(255,210,0,0.25)] bg-[rgba(255,210,0,0.05)]">
                  <div className="flex items-center gap-2 mb-1">
                    <Star size={15} className="text-[#FFD200]" />
                    <span className="text-sm font-semibold text-[#F0F4FF]">Would you like to share your points score breakdown?</span>
                  </div>
                  <p className="text-xs text-[#3D6080] mb-4">This is optional — sharing your score helps the community compare invitation thresholds.</p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShareScore(true)}
                      className={clsx(
                        "flex-1 py-2 rounded-lg text-sm font-semibold border transition-all",
                        shareScore === true
                          ? "bg-[rgba(255,210,0,0.12)] border-[rgba(255,210,0,0.5)] text-[#FFD200]"
                          : "border-[rgba(0,61,165,0.45)] text-[#3D6080] hover:border-[rgba(255,210,0,0.3)] hover:text-[#8BB8DC]"
                      )}
                    >
                      Yes, share my score
                    </button>
                    <button
                      type="button"
                      onClick={() => setShareScore(false)}
                      className={clsx(
                        "flex-1 py-2 rounded-lg text-sm font-semibold border transition-all",
                        shareScore === false
                          ? "bg-[rgba(0,61,165,0.12)] border-[rgba(0,61,165,0.5)] text-[#8BB8DC]"
                          : "border-[rgba(0,61,165,0.45)] text-[#3D6080] hover:border-[rgba(0,61,165,0.6)] hover:text-[#8BB8DC]"
                      )}
                    >
                      No, skip this
                    </button>
                  </div>
                </div>

                {shareScore === true && (
                  <div className="mt-4 animate-fade-in">
                    <p className="text-xs text-[#3D6080] mb-4">{t("submit.points.subtitle")}</p>
                    <div className="space-y-3">
                      {POINTS_CRITERIA.filter(
                        (c) => !c.applicableTo || c.applicableTo.includes(form.visaSubclass)
                      ).map((criterion) => {
                        const visibleOptions = criterion.key === "nomination"
                          ? criterion.options.filter((opt) => {
                              if (opt.value === 0) return true;
                              if (opt.value === 5) return form.visaSubclass === "190";
                              if (opt.value === 15) return form.visaSubclass === "491";
                              return true;
                            })
                          : criterion.options;
                        const selectedIdx = pointsOptIdx[criterion.key];
                        return (
                          <div key={criterion.key} className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                            <label className="text-xs text-[#8BB8DC] font-medium">
                              {t(`submit.points.${criterion.label}` as Parameters<typeof t>[0])}
                            </label>
                            <select
                              className="input-field !py-2 text-sm"
                              value={selectedIdx !== undefined ? String(selectedIdx) : ""}
                              onChange={(e) => {
                                const idx = e.target.value === "" ? undefined : Number(e.target.value);
                                setPointsOptIdx((prev) => {
                                  const next = { ...prev };
                                  if (idx === undefined) delete next[criterion.key];
                                  else next[criterion.key] = idx;
                                  return next;
                                });
                                updatePoints(criterion.key, idx === undefined ? "" : String(visibleOptions[idx].value));
                              }}
                            >
                              <option value="">{t("submit.points.selectOption")}</option>
                              {visibleOptions.map((opt, idx) => (
                                <option key={`${criterion.key}|${idx}`} value={String(idx)}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-5 p-4 rounded-xl border border-[rgba(255,210,0,0.2)] bg-[rgba(255,210,0,0.04)] flex items-center justify-between">
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
              </div>
            )}

            {/* Optional email */}
            <div className="mb-6 p-4 rounded-xl border border-[rgba(139,184,220,0.2)] bg-[rgba(139,184,220,0.04)]">
              <div className="flex items-center gap-2 mb-1">
                <Mail size={15} className="text-[#8BB8DC]" />
                <label className="text-sm font-semibold text-[#F0F4FF]">{t("submit.email.label")}</label>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(139,184,220,0.15)] text-[#8BB8DC] border border-[rgba(139,184,220,0.25)]">Newsletter</span>
              </div>
              <p className="text-[10px] text-[#3D6080] mb-2 leading-relaxed">{t("submit.email.hint")}</p>
              <input
                type="email"
                className="input-field"
                placeholder={t("submit.email.placeholder")}
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                autoComplete="email"
              />
              {errors.email && <p className="text-[#C8102E] text-xs mt-1">{errors.email}</p>}
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
                  <span className="text-sm font-semibold text-[#F0F4FF]">
                    I agree to the{" "}
                    <a href="/terms" target="_blank" rel="noopener noreferrer"
                      className="text-[#FFD200] underline underline-offset-2 hover:text-[#CCB000] transition-colors"
                      onClick={(e) => e.stopPropagation()}>
                      Terms and Conditions
                    </a>
                  </span>
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
            className={clsx("btn-secondary !px-4 sm:!px-5", step === 0 && "opacity-0 pointer-events-none")}
          >
            {t("submit.nav.back")}
          </button>
          {step < steps.length - 1 ? (
            <button onClick={nextStep} className="btn-primary !px-4 sm:!px-7">
              {t("submit.nav.next")} <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={clsx("btn-primary !px-4 sm:!px-7", submitting && "opacity-60 cursor-not-allowed")}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#000918] border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline">{t("submit.submitting")}</span>
                  <span className="sm:hidden">Submitting…</span>
                </span>
              ) : (
                <>
                  <Shield size={15} />
                  <span className="hidden sm:inline">{t("submit.submit")}</span>
                  <span className="sm:hidden">Submit</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
