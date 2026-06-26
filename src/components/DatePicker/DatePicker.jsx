import { useState, useEffect, useRef } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import "./DatePicker.scss";

// ── Helpers ───────────────────────────────────────────────────
const toYMD = (d) => {
  const y   = d.getFullYear();
  const m   = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const buildAvailableSet = (config) => {
  const { recurring_days = [], extra_dates = [], blocked_dates = [], weeks_ahead = 5 } = config;
  const available = new Set(extra_dates);
  const blocked   = new Set(blocked_dates);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const limit = new Date(today);
  limit.setDate(limit.getDate() + weeks_ahead * 7);

  const cursor = new Date(today);
  cursor.setDate(cursor.getDate() + 1);

  while (cursor <= limit) {
    const ymd = toYMD(cursor);
    if (recurring_days.includes(cursor.getDay()) && !blocked.has(ymd)) {
      available.add(ymd);
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return available;
};

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_NAMES = ["Su","Mo","Tu","We","Th","Fr","Sa"];

// Fallback config in case Firestore is slow / unavailable
const DEFAULT_CONFIG = {
  recurring_days: [4],
  extra_dates:    [],
  blocked_dates:  [],
  weeks_ahead:    5,
};

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
  const [config,    setConfig]    = useState(DEFAULT_CONFIG);
  const [available, setAvailable] = useState(() => buildAvailableSet(DEFAULT_CONFIG));
  const [open,      setOpen]      = useState(false);
  const ref = useRef(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Subscribe to Firestore config in real time
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "config", "availability"), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setConfig(data);
        setAvailable(buildAvailableSet(data));
      }
    });
    return unsub;
  }, []);

  const initialMonth = (() => {
    if (value) return new Date(value + "T00:00:00");
    const first = [...available].sort()[0];
    return first ? new Date(first + "T00:00:00") : new Date();
  })();

  const [viewYear,  setViewYear]  = useState(initialMonth.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialMonth.getMonth());

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

  const firstDay    = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const selectDate = (d) => {
    const ymd = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    if (!available.has(ymd)) return;
    onChange(ymd);
    setOpen(false);
  };

  const displayValue = value
    ? new Date(value + "T00:00:00").toLocaleDateString("en-CA", {
        weekday: "long", month: "long", day: "numeric", year: "numeric",
      })
    : "Select a pickup date";

  const limitDate = new Date(today);
  limitDate.setDate(limitDate.getDate() + (config.weeks_ahead || 5) * 7);

  const canGoPrev = !(viewYear === today.getFullYear()     && viewMonth === today.getMonth());
  const canGoNext = !(viewYear === limitDate.getFullYear() && viewMonth === limitDate.getMonth());

  return (
    <div className="date-picker" ref={ref}>
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

      {open && (
        <div className="date-picker__popover">
          <div className="dp-header">
            <button type="button" className="dp-nav" onClick={prevMonth} disabled={!canGoPrev} aria-label="Previous month">
              <ChevronLeft />
            </button>
            <span className="dp-month-label">{MONTH_NAMES[viewMonth]} {viewYear}</span>
            <button type="button" className="dp-nav" onClick={nextMonth} disabled={!canGoNext} aria-label="Next month">
              <ChevronRight />
            </button>
          </div>

          <div className="dp-grid dp-grid--header">
            {DAY_NAMES.map(n => (
              <span key={n} className="dp-cell dp-cell--label">{n}</span>
            ))}
          </div>

          <div className="dp-grid">
            {cells.map((d, i) => {
              if (!d) return <span key={`empty-${i}`} className="dp-cell" />;
              const ymd       = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
              const isAvail   = available.has(ymd);
              const selected  = value === ymd;
              const isPast    = new Date(ymd + "T00:00:00") <= today;

              return (
                <button
                  key={ymd}
                  type="button"
                  className={[
                    "dp-cell dp-cell--day",
                    isAvail && !isPast ? "dp-cell--available" : "dp-cell--disabled",
                    selected           ? "dp-cell--selected"  : "",
                  ].join(" ")}
                  onClick={() => selectDate(d)}
                  disabled={!isAvail || isPast}
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
