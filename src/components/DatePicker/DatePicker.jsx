import { useState, useEffect, useRef } from "react";
import "./DatePicker.scss";

// ─────────────────────────────────────────────────────────────
// PICKUP AVAILABILITY CONFIG
// Update this to control which dates customers can pick up.
//
// PICKUP_DAYS  — days of the week that are always available (0=Sun, 1=Mon,
//                2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat). Leave empty [] to use
//                only specific dates below.
//
// PICKUP_EXTRA_DATES — specific "YYYY-MM-DD" dates that are available
//                      regardless of day.
//
// PICKUP_BLOCKED_DATES — specific "YYYY-MM-DD" dates that are NOT available
//                        even if they fall on an allowed day (e.g. closures).
//
// PICKUP_WEEKS_AHEAD — how many weeks ahead customers can book.
// ─────────────────────────────────────────────────────────────
export const PICKUP_DAYS          = [3, 5];   // Wednesday, Friday
export const PICKUP_EXTRA_DATES   = [];        // e.g. ["2025-12-24"]
export const PICKUP_BLOCKED_DATES = [];        // e.g. ["2025-07-04"]
export const PICKUP_WEEKS_AHEAD   = 5;

// ── Helpers ───────────────────────────────────────────────────
const toYMD = (d) => {
  const y   = d.getFullYear();
  const m   = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const buildAvailableSet = () => {
  const available = new Set(PICKUP_EXTRA_DATES);
  const blocked   = new Set(PICKUP_BLOCKED_DATES);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const limit = new Date(today);
  limit.setDate(limit.getDate() + PICKUP_WEEKS_AHEAD * 7);

  const cursor = new Date(today);
  cursor.setDate(cursor.getDate() + 1); // start from tomorrow

  while (cursor <= limit) {
    const ymd = toYMD(cursor);
    if (PICKUP_DAYS.includes(cursor.getDay()) && !blocked.has(ymd)) {
      available.add(ymd);
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return available;
};

const AVAILABLE = buildAvailableSet();

const MONTH_NAMES = [
  "January", "February", "March",     "April",   "May",      "June",
  "July",    "August",   "September", "October", "November", "December",
];
const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// ── Icons ─────────────────────────────────────────────────────
function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="3" width="13" height="11.5" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5 1.5V4M11 1.5V4M1.5 6.5h13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// DatePicker
// Props:
//   value    — selected date string "YYYY-MM-DD" or ""
//   onChange — called with "YYYY-MM-DD" when a date is picked
//   error    — boolean, highlights trigger border red
// ─────────────────────────────────────────────────────────────
export default function DatePicker({ value, onChange, error }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const initialMonth = value
    ? new Date(value + "T00:00:00")
    : (() => {
        const first = [...AVAILABLE].sort()[0];
        return first ? new Date(first + "T00:00:00") : new Date();
      })();

  const [open,      setOpen]      = useState(false);
  const [viewYear,  setViewYear]  = useState(initialMonth.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialMonth.getMonth());
  const ref = useRef(null);

  // Close popover on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  // Build grid: leading empty cells + day numbers
  const firstDay    = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const selectDate = (d) => {
    const ymd = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    if (!AVAILABLE.has(ymd)) return;
    onChange(ymd);
    setOpen(false);
  };

  const displayValue = value
    ? new Date(value + "T00:00:00").toLocaleDateString("en-CA", {
        weekday: "long", month: "long", day: "numeric", year: "numeric",
      })
    : "Select a pickup date";

  const limitDate = new Date(today);
  limitDate.setDate(limitDate.getDate() + PICKUP_WEEKS_AHEAD * 7);

  const canGoPrev = !(viewYear === today.getFullYear()     && viewMonth === today.getMonth());
  const canGoNext = !(viewYear === limitDate.getFullYear() && viewMonth === limitDate.getMonth());

  return (
    <div className="date-picker" ref={ref}>
      {/* Trigger button */}
      <button
        type="button"
        className={[
          "date-picker__trigger",
          error ? "date-picker__trigger--error"  : "",
          value ? "date-picker__trigger--filled" : "",
        ].join(" ")}
        onClick={() => setOpen(o => !o)}
      >
        <span className="date-picker__trigger-text">{displayValue}</span>
        <CalendarIcon />
      </button>

      {/* Popover calendar */}
      {open && (
        <div className="date-picker__popover">

          {/* Month / year navigation */}
          <div className="dp-header">
            <button type="button" className="dp-nav" onClick={prevMonth} disabled={!canGoPrev} aria-label="Previous month">
              <ChevronLeft />
            </button>
            <span className="dp-month-label">{MONTH_NAMES[viewMonth]} {viewYear}</span>
            <button type="button" className="dp-nav" onClick={nextMonth} disabled={!canGoNext} aria-label="Next month">
              <ChevronRight />
            </button>
          </div>

          {/* Day-of-week headers */}
          <div className="dp-grid dp-grid--header">
            {DAY_NAMES.map(n => (
              <span key={n} className="dp-cell dp-cell--label">{n}</span>
            ))}
          </div>

          {/* Date cells */}
          <div className="dp-grid">
            {cells.map((d, i) => {
              if (!d) return <span key={`empty-${i}`} className="dp-cell" />;

              const ymd       = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
              const available = AVAILABLE.has(ymd);
              const selected  = value === ymd;
              const isPast    = new Date(ymd + "T00:00:00") <= today;

              return (
                <button
                  key={ymd}
                  type="button"
                  className={[
                    "dp-cell dp-cell--day",
                    available && !isPast ? "dp-cell--available" : "dp-cell--disabled",
                    selected             ? "dp-cell--selected"  : "",
                  ].join(" ")}
                  onClick={() => selectDate(d)}
                  disabled={!available || isPast}
                  aria-label={ymd}
                  aria-pressed={selected}
                >
                  {d}
                </button>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
}
