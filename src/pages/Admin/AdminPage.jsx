import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import "./AdminPage.scss";

// ── Constants ─────────────────────────────────────────────────
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_NAMES   = ["Su","Mo","Tu","We","Th","Fr","Sa"];
const WEEKDAYS    = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const HST_RATE    = 0.13;

const toYMD = (d) => {
  const y   = d.getFullYear();
  const m   = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// Default config — used if Firestore has no data yet
const DEFAULT_CONFIG = {
  recurring_days:  [4],       // Thursdays
  extra_dates:     [],
  blocked_dates:   [],
  weeks_ahead:     5,
  price_small:     11,
  price_large:     40,
};

// ── Login Screen ──────────────────────────────────────────────
function LoginScreen({ onLogin, error, loading }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__logo">✦</div>
        <h1 className="admin-login__title">Zaytün Admin</h1>
        <p className="admin-login__subtitle">Sign in to manage your store</p>

        <form onSubmit={handleSubmit} className="admin-login__form">
          <div className="admin-field">
            <label className="admin-field__label">Email</label>
            <input
              type="email"
              className="admin-field__input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@zaytun.ca"
              required
              autoComplete="email"
            />
          </div>
          <div className="admin-field">
            <label className="admin-field__label">Password</label>
            <input
              type="password"
              className="admin-field__input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p className="admin-login__error">{error}</p>}

          <button type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Admin Calendar ────────────────────────────────────────────
function AdminCalendar({ config, onChange }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const extraSet   = new Set(config.extra_dates);
  const blockedSet = new Set(config.blocked_dates);

  // Build the available set for visual display
  const limit = new Date(today);
  limit.setDate(limit.getDate() + config.weeks_ahead * 7);

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

  const handleDayClick = (d) => {
    const date    = new Date(viewYear, viewMonth, d);
    const ymd     = toYMD(date);
    const isPast  = date <= today;
    if (isPast) return;

    const isRecurring = config.recurring_days.includes(date.getDay());

    if (isRecurring) {
      // Recurring day — clicking blocks it (or unblocks if already blocked)
      const newBlocked = blockedSet.has(ymd)
        ? config.blocked_dates.filter(x => x !== ymd)
        : [...config.blocked_dates, ymd];
      onChange({ ...config, blocked_dates: newBlocked });
    } else if (extraSet.has(ymd)) {
      // Extra date — clicking removes it
      onChange({ ...config, extra_dates: config.extra_dates.filter(x => x !== ymd) });
    } else {
      // Normal unavailable day — clicking adds as extra
      onChange({ ...config, extra_dates: [...config.extra_dates, ymd] });
    }
  };

  const getDayStatus = (d) => {
    const date        = new Date(viewYear, viewMonth, d);
    const ymd         = toYMD(date);
    const isPast      = date <= today;
    const isRecurring = config.recurring_days.includes(date.getDay());
    const isExtra     = extraSet.has(ymd);
    const isBlocked   = blockedSet.has(ymd);
    const inWindow    = date <= limit;

    if (isPast)                          return "past";
    if (!inWindow)                       return "out-of-range";
    if (isRecurring && !isBlocked)       return "recurring";
    if (isBlocked)                       return "blocked";
    if (isExtra)                         return "extra";
    return "unavailable";
  };

  return (
    <div className="admin-calendar">
      <div className="admin-calendar__header">
        <button className="admin-cal-nav" onClick={prevMonth}>‹</button>
        <span className="admin-cal-month">{MONTH_NAMES[viewMonth]} {viewYear}</span>
        <button className="admin-cal-nav" onClick={nextMonth}>›</button>
      </div>

      <div className="admin-cal-grid admin-cal-grid--labels">
        {DAY_NAMES.map(n => <span key={n} className="admin-cal-label">{n}</span>)}
      </div>

      <div className="admin-cal-grid">
        {cells.map((d, i) => {
          if (!d) return <span key={`e-${i}`} />;
          const status = getDayStatus(d);
          return (
            <button
              key={`${viewYear}-${viewMonth}-${d}`}
              className={`admin-cal-day admin-cal-day--${status}`}
              onClick={() => handleDayClick(d)}
              disabled={status === "past" || status === "out-of-range"}
              title={
                status === "recurring"   ? "Click to block this date"  :
                status === "blocked"     ? "Click to unblock"          :
                status === "extra"       ? "Click to remove"           :
                status === "unavailable" ? "Click to add as available" : ""
              }
            >
              {d}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="admin-cal-legend">
        <span className="legend-item legend-item--recurring">Recurring pickup</span>
        <span className="legend-item legend-item--extra">Added date</span>
        <span className="legend-item legend-item--blocked">Blocked</span>
        <span className="legend-item legend-item--unavailable">Unavailable</span>
      </div>
    </div>
  );
}

// ── Main Admin Page ───────────────────────────────────────────
export default function AdminPage() {
  const [user,       setUser]       = useState(null);
  const [authReady,  setAuthReady]  = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoad,  setLoginLoad]  = useState(false);

  const [config,   setConfig]   = useState(DEFAULT_CONFIG);
  const [saving,   setSaving]   = useState(false);
  const [saveMsg,  setSaveMsg]  = useState("");
  const [loading,  setLoading]  = useState(true);

  // Watch auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return unsub;
  }, []);

  // Load config from Firestore when logged in
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, "config", "availability"));
        if (snap.exists()) {
          setConfig({ ...DEFAULT_CONFIG, ...snap.data() });
        } else {
          // First time — write defaults
          await setDoc(doc(db, "config", "availability"), DEFAULT_CONFIG);
        }
      } catch (err) {
        console.error("Failed to load config:", err);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const handleLogin = async (email, password) => {
    setLoginError("");
    setLoginLoad(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setLoginError("Incorrect email or password. Please try again.");
    }
    setLoginLoad(false);
  };

  const handleLogout = () => signOut(auth);

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      await setDoc(doc(db, "config", "availability"), config);
      setSaveMsg("✦ Changes saved successfully.");
    } catch {
      setSaveMsg("Error saving. Please try again.");
    }
    setSaving(false);
    setTimeout(() => setSaveMsg(""), 4000);
  };

  const toggleRecurringDay = (day) => {
    const days = config.recurring_days.includes(day)
      ? config.recurring_days.filter(d => d !== day)
      : [...config.recurring_days, day].sort();
    setConfig(c => ({ ...c, recurring_days: days }));
  };

  if (!authReady) return null;

  if (!user) {
    return (
      <LoginScreen
        onLogin={handleLogin}
        error={loginError}
        loading={loginLoad}
      />
    );
  }

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">Loading configuration…</div>
      </div>
    );
  }

  return (
    <div className="admin-page">

      {/* ── Top bar ── */}
      <header className="admin-topbar">
        <div className="admin-topbar__brand">✦ Zaytün Admin</div>
        <div className="admin-topbar__right">
          <span className="admin-topbar__email">{user.email}</span>
          <button className="admin-btn admin-btn--ghost" onClick={handleLogout}>Sign Out</button>
        </div>
      </header>

      <div className="admin-body">

        {/* ── Availability Section ── */}
        <section className="admin-section">
          <h2 className="admin-section__title">Pickup Availability</h2>
          <p className="admin-section__desc">
            Set which weekdays are always available for pickup, then use the calendar to add one-off dates or block specific days.
          </p>

          {/* Recurring weekday toggles */}
          <div className="admin-weekdays">
            <div className="admin-label">Recurring pickup days</div>
            <div className="admin-weekday-grid">
              {WEEKDAYS.map((name, i) => (
                <button
                  key={i}
                  className={`weekday-btn ${config.recurring_days.includes(i) ? "weekday-btn--active" : ""}`}
                  onClick={() => toggleRecurringDay(i)}
                >
                  {name.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Weeks ahead */}
          <div className="admin-row">
            <div className="admin-label">Booking window (weeks ahead)</div>
            <div className="admin-stepper">
              <button
                className="admin-step-btn"
                onClick={() => setConfig(c => ({ ...c, weeks_ahead: Math.max(1, c.weeks_ahead - 1) }))}
              >−</button>
              <span className="admin-step-val">{config.weeks_ahead}</span>
              <button
                className="admin-step-btn"
                onClick={() => setConfig(c => ({ ...c, weeks_ahead: Math.min(12, c.weeks_ahead + 1) }))}
              >+</button>
            </div>
          </div>

          {/* Calendar */}
          <AdminCalendar config={config} onChange={setConfig} />

          {/* Summary of overrides */}
          {(config.extra_dates.length > 0 || config.blocked_dates.length > 0) && (
            <div className="admin-overrides">
              {config.extra_dates.length > 0 && (
                <div className="override-group">
                  <div className="admin-label">Added dates</div>
                  <div className="override-chips">
                    {[...config.extra_dates].sort().map(d => (
                      <span key={d} className="chip chip--extra">
                        {d}
                        <button
                          className="chip__remove"
                          onClick={() => setConfig(c => ({ ...c, extra_dates: c.extra_dates.filter(x => x !== d) }))}
                        >×</button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {config.blocked_dates.length > 0 && (
                <div className="override-group">
                  <div className="admin-label">Blocked dates</div>
                  <div className="override-chips">
                    {[...config.blocked_dates].sort().map(d => (
                      <span key={d} className="chip chip--blocked">
                        {d}
                        <button
                          className="chip__remove"
                          onClick={() => setConfig(c => ({ ...c, blocked_dates: c.blocked_dates.filter(x => x !== d) }))}
                        >×</button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ── Pricing Section ── */}
        <section className="admin-section">
          <h2 className="admin-section__title">Pricing</h2>
          <p className="admin-section__desc">
            Update product prices. HST ({(HST_RATE * 100).toFixed(0)}%) is calculated automatically on the order page.
          </p>

          <div className="admin-price-grid">
            <div className="admin-price-card">
              <div className="admin-price-card__label">200g jar</div>
              <div className="admin-price-card__input-wrap">
                <span className="admin-price-card__dollar">$</span>
                <input
                  type="number"
                  className="admin-price-card__input"
                  min="1"
                  step="0.50"
                  value={config.price_small}
                  onChange={e => setConfig(c => ({ ...c, price_small: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div className="admin-price-card__hst">
                + HST = ${((config.price_small || 0) * (1 + HST_RATE)).toFixed(2)}
              </div>
            </div>

            <div className="admin-price-card">
              <div className="admin-price-card__label">800g jar</div>
              <div className="admin-price-card__input-wrap">
                <span className="admin-price-card__dollar">$</span>
                <input
                  type="number"
                  className="admin-price-card__input"
                  min="1"
                  step="0.50"
                  value={config.price_large}
                  onChange={e => setConfig(c => ({ ...c, price_large: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div className="admin-price-card__hst">
                + HST = ${((config.price_large || 0) * (1 + HST_RATE)).toFixed(2)}
              </div>
            </div>
          </div>
        </section>

        {/* ── Save ── */}
        <div className="admin-save-bar">
          {saveMsg && <span className="admin-save-msg">{saveMsg}</span>}
          <button
            className="admin-btn admin-btn--primary admin-btn--large"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}
