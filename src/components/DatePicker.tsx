"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Calendar, X } from "lucide-react";
import clsx from "clsx";

interface DatePickerProps {
  value: string;
  onChange: (v: string) => void;
  max?: string;
  min?: string;
  hasError?: boolean;
  placeholder?: string;
  clearable?: boolean;
}

const CAL_MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const CAL_DAYS = ["Mo","Tu","We","Th","Fr","Sa","Su"];

/** Choose a sensible initial month: value → max → today */
function initialViewing(value: string, max?: string): Date {
  if (value) return new Date(value + "T12:00:00");
  if (max) {
    const m = new Date(max + "T12:00:00");
    if (m < new Date()) return m;
  }
  return new Date();
}

export default function DatePicker({ value, onChange, max, min, hasError, placeholder, clearable }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewing, setViewing] = useState<Date>(() => initialViewing(value, max));
  const [dropStyle, setDropStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const computePosition = () => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    const dropH = 310; // approximate calendar height
    const spaceBelow = window.innerHeight - r.bottom;
    const flipUp = spaceBelow < dropH + 16;
    setDropStyle({
      position: "absolute",
      left: r.left + window.scrollX,
      top: flipUp
        ? r.top + window.scrollY - dropH - 6
        : r.bottom + window.scrollY + 6,
      minWidth: Math.max(r.width, 272),
      zIndex: 9999,
    });
  };

  const openPicker = () => {
    computePosition();
    setOpen(v => !v);
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
        dropRef.current && !dropRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => { window.removeEventListener("scroll", close, true); window.removeEventListener("resize", close); };
  }, [open]);

  // Sync viewing when value or max changes externally
  useEffect(() => {
    setViewing(initialViewing(value, max));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, max]);

  const todayStr = new Date().toISOString().split("T")[0];
  const maxDate = max ? new Date(max + "T12:00:00") : new Date();
  const minDate = min ? new Date(min + "T12:00:00") : null;

  const year = viewing.getFullYear();
  const month = viewing.getMonth();

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const startOffset = (firstDayOfWeek + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const toDateStr = (day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const isDisabled = (day: number) => {
    const d = new Date(year, month, day);
    if (d > maxDate) return true;
    if (minDate && d < minDate) return true;
    return false;
  };

  const canGoPrevMonth = !minDate || new Date(year, month, 0) >= minDate;
  const canGoNextMonth = new Date(year, month + 1, 1) <= maxDate;
  const canGoPrevYear = !minDate || new Date(year - 1, month + 1, 0) >= minDate;
  const canGoNextYear = new Date(year + 1, month, 1) <= maxDate;

  const displayValue = value
    ? new Date(value + "T12:00:00").toLocaleDateString("en-AU", {
        day: "2-digit", month: "short", year: "numeric",
      })
    : "";

  const dropdown = open ? (
    <div
      ref={dropRef}
      style={{
        ...dropStyle,
        background: "linear-gradient(160deg, #001428 0%, #000E24 100%)",
        border: "1px solid rgba(0,61,165,0.45)",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,210,0,0.06)",
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {/* Header: year ‹‹ | month ‹  Month YYYY  month › | year ›› */}
      <div className="flex items-center justify-between px-3 py-3" style={{ borderBottom: "1px solid rgba(0,61,165,0.3)" }}>
        {/* Prev year */}
        <button type="button" onClick={() => setViewing(new Date(year - 1, month, 1))} disabled={!canGoPrevYear}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-[#3D6080] text-xs font-bold hover:bg-[rgba(255,210,0,0.08)] hover:text-[#FFD200] disabled:opacity-20 disabled:cursor-not-allowed transition-colors" title="Previous year">
          «
        </button>
        {/* Prev month */}
        <button type="button" onClick={() => setViewing(new Date(year, month - 1, 1))} disabled={!canGoPrevMonth}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-[#FFD200] text-lg font-bold hover:bg-[rgba(255,210,0,0.1)] disabled:opacity-25 disabled:cursor-not-allowed transition-colors">
          ‹
        </button>
        <span className="text-[#F0F4FF] text-sm font-semibold tracking-wide flex-1 text-center">
          {CAL_MONTHS[month]} {year}
        </span>
        {/* Next month */}
        <button type="button" onClick={() => setViewing(new Date(year, month + 1, 1))} disabled={!canGoNextMonth}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-[#FFD200] text-lg font-bold hover:bg-[rgba(255,210,0,0.1)] disabled:opacity-25 disabled:cursor-not-allowed transition-colors">
          ›
        </button>
        {/* Next year */}
        <button type="button" onClick={() => setViewing(new Date(year + 1, month, 1))} disabled={!canGoNextYear}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-[#3D6080] text-xs font-bold hover:bg-[rgba(255,210,0,0.08)] hover:text-[#FFD200] disabled:opacity-20 disabled:cursor-not-allowed transition-colors" title="Next year">
          »
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 px-3 pt-3 pb-1">
        {CAL_DAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-semibold text-[#2A4A6A] py-1 tracking-wider">{d}</div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 px-3 pb-4 gap-y-0.5">
        {Array.from({ length: startOffset }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const ds = toDateStr(day);
          const disabled = isDisabled(day);
          const selected = ds === value;
          const isToday = ds === todayStr;
          return (
            <button
              key={day}
              type="button"
              disabled={disabled}
              onClick={() => { onChange(ds); setOpen(false); }}
              className={clsx(
                "h-8 w-full rounded-lg text-sm font-medium transition-all",
                selected
                  ? "bg-[#FFD200] text-[#000918] font-bold shadow-[0_2px_8px_rgba(255,210,0,0.35)]"
                  : disabled
                  ? "text-[#1A3050] cursor-not-allowed"
                  : isToday
                  ? "text-[#FFD200] ring-1 ring-[rgba(255,210,0,0.4)] hover:bg-[rgba(255,210,0,0.1)]"
                  : "text-[#8BB8DC] hover:bg-[rgba(139,184,220,0.08)] hover:text-[#F0F4FF]"
              )}
            >{day}</button>
          );
        })}
      </div>
    </div>
  ) : null;

  return (
    <div ref={triggerRef} className="relative">
      <div
        className={clsx(
          "input-icon-wrap cursor-pointer rounded-[10px] transition-all select-none",
          hasError ? "ring-1 ring-[#C8102E]" : "",
          open && "ring-1 ring-[rgba(255,210,0,0.4)]"
        )}
        onClick={openPicker}
      >
        <Calendar size={15} className="input-icon pointer-events-none" />
        <div
          className={clsx("input-field cursor-pointer flex items-center", hasError && "!border-[#C8102E]")}
          style={{ paddingLeft: "2.5rem", paddingRight: clearable && value ? "2.25rem" : undefined, minHeight: "2.75rem" }}
        >
          {displayValue
            ? <span className="text-[#F0F4FF] text-sm">{displayValue}</span>
            : <span className="text-[#3D6080] text-sm">{placeholder ?? "Select date"}</span>}
        </div>
        {clearable && value && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(""); }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full text-[#3D6080] hover:text-[#C8102E] hover:bg-[rgba(200,16,46,0.1)] transition-colors"
            aria-label="Clear date"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {typeof document !== "undefined" && dropdown && createPortal(dropdown, document.body)}
    </div>
  );
}
