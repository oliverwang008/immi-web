"use client";

import { useState, useEffect, useRef } from "react";
import { Calendar } from "lucide-react";
import clsx from "clsx";

interface DatePickerProps {
  value: string;
  onChange: (v: string) => void;
  max?: string;
  min?: string;
  hasError?: boolean;
  placeholder?: string;
}

const CAL_MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const CAL_DAYS = ["Mo","Tu","We","Th","Fr","Sa","Su"];

export default function DatePicker({ value, onChange, max, min, hasError, placeholder }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewing, setViewing] = useState<Date>(() =>
    value ? new Date(value + "T12:00:00") : new Date()
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (value) setViewing(new Date(value + "T12:00:00"));
  }, [value]);

  const todayStr = new Date().toISOString().split("T")[0];
  const maxDate = max ? new Date(max + "T12:00:00") : new Date();
  const minDate = min ? new Date(min + "T12:00:00") : null;

  const year = viewing.getFullYear();
  const month = viewing.getMonth();

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const startOffset = (firstDayOfWeek + 6) % 7; // Mon=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const toDateStr = (day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const isDisabled = (day: number) => {
    const d = new Date(year, month, day);
    if (d > maxDate) return true;
    if (minDate && d < minDate) return true;
    return false;
  };

  const canGoPrev = !minDate || new Date(year, month, 0) >= minDate;
  const canGoNext = new Date(year, month + 1, 1) <= maxDate;

  const displayValue = value
    ? new Date(value + "T12:00:00").toLocaleDateString("en-AU", {
        day: "2-digit", month: "short", year: "numeric",
      })
    : "";

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <div
        className={clsx(
          "input-icon-wrap cursor-pointer rounded-[10px] transition-all select-none",
          hasError ? "ring-1 ring-[#C8102E]" : "",
          open && "ring-1 ring-[rgba(255,210,0,0.4)]"
        )}
        onClick={() => setOpen(v => !v)}
      >
        <Calendar size={15} className="input-icon pointer-events-none" />
        <div
          className={clsx("input-field cursor-pointer flex items-center", hasError && "!border-[#C8102E]")}
          style={{ paddingLeft: "2.5rem", minHeight: "2.75rem" }}
        >
          {displayValue
            ? <span className="text-[#F0F4FF] text-sm">{displayValue}</span>
            : <span className="text-[#3D6080] text-sm">{placeholder ?? "Select date"}</span>}
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute z-50 mt-1.5 rounded-2xl shadow-2xl overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #001428 0%, #000E24 100%)",
            border: "1px solid rgba(0,61,165,0.45)",
            minWidth: "272px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,210,0,0.06)",
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {/* Month/year header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "1px solid rgba(0,61,165,0.3)" }}
          >
            <button
              type="button"
              onClick={() => setViewing(new Date(year, month - 1, 1))}
              disabled={!canGoPrev}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#FFD200] text-lg font-bold hover:bg-[rgba(255,210,0,0.1)] disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
            >‹</button>
            <span className="text-[#F0F4FF] text-sm font-semibold tracking-wide">
              {CAL_MONTHS[month]} {year}
            </span>
            <button
              type="button"
              onClick={() => setViewing(new Date(year, month + 1, 1))}
              disabled={!canGoNext}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#FFD200] text-lg font-bold hover:bg-[rgba(255,210,0,0.1)] disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
            >›</button>
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
      )}
    </div>
  );
}
