import React, { useState, useRef } from "react";
import emailjs from '@emailjs/browser';
import "./OrderPage.scss";

// ─────────────────────────────────────────────────────────────
// EmailJS config — https://www.emailjs.com
// ─────────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = "service_7lk0bfj";
const EMAILJS_TEMPLATE_ID = "template_u589z4u";
const EMAILJS_PUBLIC_KEY  = "nb0xJTyc1xYZiy3zI";

const SIZES = [
  { id: "small", label: "200g", price: "$11", emoji: "🫙" },
  { id: "large", label: "800g", price: "$40", emoji: "🏺" },
];

const LOCATIONS = [
  { id: "downtown", name: "Downtown Toronto", icon: "🏙️" },
  { id: "etobicoke", name: "Etobicoke",        icon: "🌳" },
  { id: "north-york", name: "North York",       icon: "🏘️" },
];

const RECIPIENT_EMAIL = "vikzivojin@gmail.com";

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M2 6.5L5.5 10L11 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function OrderPage() {
  const [form, setForm] = useState({
    nutsConfirmed: false,
    size: "",
    fullName: "",
    email: "",
    phone: "",
    pickupDate: "",
    location: "",
  });

  const [errors, setErrors]   = useState({});
  const [status, setStatus]   = useState(null); // null | "loading" | "success" | "error"

  // ── Helpers ──────────────────────────────────────────────
  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const validate = () => {
    const e = {};
    if (!form.nutsConfirmed)  e.nutsConfirmed = "Please acknowledge the allergen warning.";
    if (!form.size)           e.size          = "Please select a size.";
    if (!form.fullName.trim())e.fullName       = "Full name is required.";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Enter a valid email address.";
    if (!form.phone.trim())   e.phone         = "Phone number is required.";
    if (!form.pickupDate)     e.pickupDate    = "Please choose a pickup date.";
    if (!form.location)       e.location      = "Please select a pickup location.";
    return e;
  };

  // ── Submit via EmailJS ────────────────────────────────────
  const handleSubmit = async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus("loading");

    const sizeLabel = SIZES.find(s => s.id === form.size);
    const locLabel  = LOCATIONS.find(l => l.id === form.location);

    const templateParams = {
      to_email:    RECIPIENT_EMAIL,
      from_name:   form.fullName,
      from_email:  form.email,
      phone:       form.phone,
      size:        `${sizeLabel?.label} (${sizeLabel?.price})`,
      pickup_date: form.pickupDate,
      location:    locLabel?.name,
      nuts_ack:    "Yes — customer acknowledged the nut allergen.",
    };

    try {
      // const emailjs = await import("https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js");
      await emailjs.init({
        publicKey: EMAILJS_PUBLIC_KEY,
      })
      
      console.log(emailjs);
      console.log(EMAILJS_SERVICE_ID);
      console.log(EMAILJS_TEMPLATE_ID);
      console.log(templateParams);
      console.log(EMAILJS_PUBLIC_KEY);
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );
      
      setStatus("success");
    } catch (err) {
      //console.error(err);
      console.log(err);
      setStatus("error");
    }
  };

  // Today's date string for min date attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="order-page">

      {/* ── Header ── */}
      <header className="order-header">
        <span className="order-header__eyebrow">Place Your Order</span>
        <h1 className="order-header__title">
          Handcrafted <em>with love</em>
        </h1>
        <p className="order-header__subtitle">
          Fresh, small-batch products made to order. Choose your size, pick a location, and we'll have it ready for you.
        </p>
        <div className="order-header__divider" />
      </header>

      {/* ── Form ── */}
      <div className="order-form">

        {/* Step 1 — Allergen */}
        <div className="form-section">
          <span className="form-section__label">Step 1 — Allergen Notice</span>
          <label className="nut-warning">
            <input
              type="checkbox"
              className="nut-warning__checkbox"
              checked={form.nutsConfirmed}
              onChange={e => set("nutsConfirmed", e.target.checked)}
            />
            <div className="nut-warning__box">
              <CheckIcon />
            </div>
            <div className="nut-warning__text">
              <strong>This product contains nuts</strong>
              <span>
                By checking this box I confirm I am aware this product contains nuts and is produced in a facility that handles tree nuts and peanuts.
              </span>
            </div>
            <span className="nut-warning__icon">🥜</span>
          </label>
          {errors.nutsConfirmed && <p className="field-error">{errors.nutsConfirmed}</p>}
        </div>

        <div className="section-divider" />

        {/* Step 2 — Size */}
        <div className="form-section">
          <span className="form-section__label">Step 2 — Choose Your Size</span>
          <div className="size-options">
            {SIZES.map(size => (
              <label className="size-option" key={size.id}>
                <input
                  type="radio"
                  name="size"
                  className="size-option__input"
                  value={size.id}
                  checked={form.size === size.id}
                  onChange={() => set("size", size.id)}
                />
                <div className="size-option__card">
                  <div className="size-option__img-wrap">
                    <span className="size-option__img-placeholder">{size.emoji}</span>
                    <span className="size-option__badge">{size.label}</span>
                  </div>
                  <div className="size-option__info">
                    <div className="size-option__weight">{size.label}</div>
                    <div className="size-option__price">{size.price}</div>
                  </div>
                </div>
                <div className="size-option__check">
                  <CheckIcon />
                </div>
              </label>
            ))}
          </div>
          {errors.size && <p className="field-error">{errors.size}</p>}
        </div>

        <div className="section-divider" />

        {/* Step 3 — Contact */}
        <div className="form-section">
          <span className="form-section__label">Step 3 — Your Details</span>
          <div className="input-group">
            <div className="field">
              <label className="field__label">Full Name</label>
              <input
                type="text"
                className="field__input"
                placeholder="Jane Smith"
                value={form.fullName}
                onChange={e => set("fullName", e.target.value)}
              />
              {errors.fullName && <p className="field-error">{errors.fullName}</p>}
            </div>
            <div className="input-row">
              <div className="field">
                <label className="field__label">Email Address</label>
                <input
                  type="email"
                  className="field__input"
                  placeholder="jane@example.com"
                  value={form.email}
                  onChange={e => set("email", e.target.value)}
                />
                {errors.email && <p className="field-error">{errors.email}</p>}
              </div>
              <div className="field">
                <label className="field__label">Phone Number</label>
                <input
                  type="tel"
                  className="field__input"
                  placeholder="+1 416 000 0000"
                  value={form.phone}
                  onChange={e => set("phone", e.target.value)}
                />
                {errors.phone && <p className="field-error">{errors.phone}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="section-divider" />

        {/* Step 4 — Pickup Date */}
        <div className="form-section">
          <span className="form-section__label">Step 4 — Pickup Date</span>
          <div className="field">
            <label className="field__label">Select a Date</label>
            <input
              type="date"
              className="field__input"
              min={today}
              value={form.pickupDate}
              onChange={e => set("pickupDate", e.target.value)}
            />
            {errors.pickupDate && <p className="field-error">{errors.pickupDate}</p>}
          </div>
        </div>

        <div className="section-divider" />

        {/* Step 5 — Location */}
        <div className="form-section">
          <span className="form-section__label">Step 5 — Pickup Location</span>
          <div className="location-options">
            {LOCATIONS.map(loc => (
              <label
                className={`location-option ${form.location === loc.id ? "selected" : ""}`}
                key={loc.id}
              >
                <input
                  type="radio"
                  name="location"
                  className="location-option__input"
                  value={loc.id}
                  checked={form.location === loc.id}
                  onChange={() => set("location", loc.id)}
                />
                <div className="location-option__radio" />
                <span className="location-option__icon">{loc.icon}</span>
                <span className="location-option__name">{loc.name}</span>
              </label>
            ))}
          </div>
          {errors.location && <p className="field-error">{errors.location}</p>}
        </div>

        {/* Submit */}
        <button
          className={`submit-btn ${status === "loading" ? "submit-btn--loading" : ""}`}
          onClick={handleSubmit}
          disabled={status === "loading" || status === "success"}
        >
          {status === "success" ? "Order Sent ✓" : "Place My Order"}
        </button>

        {status === "success" && (
          <div className="form-feedback form-feedback--success">
            🎉 Your order has been received! We'll be in touch shortly to confirm.
          </div>
        )}
        {status === "error" && (
          <div className="form-feedback form-feedback--error">
            Something went wrong sending your order. Please email us directly at {RECIPIENT_EMAIL}.
          </div>
        )}

      </div>
    </div>
  );
}
