import React, { useState } from "react";
import emailjs from '@emailjs/browser';
import DatePicker from '../../components/DatePicker/DatePicker';
import img200g from '../../assets/images/zaytun-200g.jpg';
import img800g from '../../assets/images/zaytun-800g.jpg';
import "./OrderPage.scss";

const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const HST_RATE = 0.13;

const SIZES = [
  { id: "small", label: "200g", price: 11, img: img200g },
  { id: "large", label: "800g", price: 40, img: img800g },
];

const LOCATIONS = [
  { id: "downtown",   name: "Downtown Toronto (Yonge & Dundas)" },
  { id: "etobicoke",  name: "Etobicoke (Park Lawn & Lakeshore W)" },
  { id: "north-york", name: "North York (Bayview & Finch E)" },
];

const RECIPIENT_EMAIL = "adam@zaytun.ca";

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M2 6.5L5.5 10L11 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 6h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function OrderPage() {
  const [quantities, setQuantities] = useState(
    Object.fromEntries(SIZES.map(s => [s.id, 0]))
  );

  const [form, setForm] = useState({
    nutsConfirmed: false,
    fullName:      "",
    email:         "",
    phone:         "",
    pickupDate:    "",
    location:      "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);

  const changeQty = (id, delta) =>
    setQuantities(prev => ({ ...prev, [id]: Math.max(0, prev[id] + delta) }));

  const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0);
  const subtotal   = SIZES.reduce((sum, s) => sum + s.price * quantities[s.id], 0);
  const tax        = subtotal * HST_RATE;
  const total      = subtotal + tax;
  const fmt        = (n) => `$${n.toFixed(2)}`;

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const validate = () => {
    const e = {};
    if (!form.nutsConfirmed)   e.nutsConfirmed = "Please acknowledge the allergen warning.";
    if (totalItems === 0)      e.quantities    = "Please add at least one item to your order.";
    if (!form.fullName.trim()) e.fullName      = "Full name is required.";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Enter a valid email address.";
    if (!form.phone.trim())    e.phone         = "Phone number is required.";
    if (!form.pickupDate)      e.pickupDate    = "Please choose a pickup date.";
    if (!form.location)        e.location      = "Please select a pickup location.";
    return e;
  };

  const handleSubmit = async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus("loading");

    const locLabel   = LOCATIONS.find(l => l.id === form.location);
    const orderLines = SIZES
      .filter(s => quantities[s.id] > 0)
      .map(s => `${s.label} × ${quantities[s.id]} = ${fmt(s.price * quantities[s.id])}`)
      .join("\n");

    const templateParams = {
      to_email:    RECIPIENT_EMAIL,
      from_name:   form.fullName,
      from_email:  form.email,
      phone:       form.phone,
      order:       orderLines,
      subtotal:    fmt(subtotal),
      hst:         fmt(tax),
      total:       fmt(total),
      pickup_date: form.pickupDate,
      location:    locLabel?.name,
      nuts_ack:    "Yes — customer acknowledged the nut allergen.",
    };

    try {
      await emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
      setStatus("success");
    } catch (err) {
      console.log(err);
      setStatus("error");
    }
  };

  return (
    <div className="order-page">

      <header className="order-header">
        <span className="order-header__eyebrow">Place Your Order</span>
        <h1 className="order-header__title">
          Handcrafted <em>with love</em>
        </h1>
        <p className="order-header__subtitle">
          Fresh, small-batch products made to order. Choose your sizes, pick a location, and we'll have it ready for you. Payment is made at pick up.
        </p>
        <div className="order-header__divider" />
      </header>

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
            <div className="nut-warning__box"><CheckIcon /></div>
            <div className="nut-warning__text">
              <strong>This product contains nuts</strong>
              <span>
                By checking this box I confirm I am aware this product contains nuts and is produced in a facility that handles nuts.
              </span>
            </div>
            <span className="nut-warning__icon">🥜</span>
          </label>
          {errors.nutsConfirmed && <p className="field-error">{errors.nutsConfirmed}</p>}
        </div>

        <div className="section-divider" />

        {/* Step 2 — Quantities */}
        <div className="form-section">
          <span className="form-section__label">Step 2 — Choose Your Order</span>

          <div className="size-options">
            {SIZES.map(size => (
              <div
                className={`size-option ${quantities[size.id] > 0 ? "size-option--active" : ""}`}
                key={size.id}
              >
                <div className="size-option__card">
                  <div className="size-option__img-wrap">
                    <img
                      src={size.img}
                      alt={`Zaytün ${size.label} jar`}
                      className="size-option__img"
                    />
                    <span className="size-option__badge">{size.label}</span>
                  </div>
                  <div className="size-option__info">
                    <div className="size-option__weight">{size.label}</div>
                    <div className="size-option__price">{fmt(size.price)} + HST</div>
                  </div>
                  <div className="size-option__stepper">
                    <button
                      type="button"
                      className="stepper-btn"
                      onClick={() => changeQty(size.id, -1)}
                      disabled={quantities[size.id] === 0}
                      aria-label={`Remove one ${size.label}`}
                    >
                      <MinusIcon />
                    </button>
                    <span className="stepper-qty">{quantities[size.id]}</span>
                    <button
                      type="button"
                      className="stepper-btn"
                      onClick={() => changeQty(size.id, 1)}
                      aria-label={`Add one ${size.label}`}
                    >
                      <PlusIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {errors.quantities && <p className="field-error">{errors.quantities}</p>}

          {totalItems > 0 && (
            <div className="order-summary">
              <div className="order-summary__title">Order Summary</div>
              {SIZES.filter(s => quantities[s.id] > 0).map(s => (
                <div className="order-summary__row" key={s.id}>
                  <span>{s.label} × {quantities[s.id]}</span>
                  <span>{fmt(s.price * quantities[s.id])}</span>
                </div>
              ))}
              <div className="order-summary__divider" />
              <div className="order-summary__row">
                <span>Subtotal</span><span>{fmt(subtotal)}</span>
              </div>
              <div className="order-summary__row">
                <span>HST (13%)</span><span>{fmt(tax)}</span>
              </div>
              <div className="order-summary__divider" />
              <div className="order-summary__row order-summary__row--total">
                <span>Total</span><span>{fmt(total)}</span>
              </div>
              <p className="order-summary__note">Prices in CAD. Payment collected at pickup.</p>
            </div>
          )}
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
          <label className="field__label" style={{ marginBottom: "8px", display: "block" }}>
            Select a Date
          </label>
          <DatePicker
            value={form.pickupDate}
            onChange={(ymd) => set("pickupDate", ymd)}
            error={!!errors.pickupDate}
          />
          {errors.pickupDate && (
            <p className="field-error" style={{ marginTop: "6px" }}>{errors.pickupDate}</p>
          )}
          <p className="pickup-delivery-note">
            Prefer delivery?{" "}
            <a href="/contact" className="pickup-delivery-note__link">Contact us</a>
            {" "}and we'll arrange it for you.
          </p>
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
                <span className="location-option__name">{loc.name}</span>
              </label>
            ))}
          </div>
          {errors.location && <p className="field-error">{errors.location}</p>}
        </div>

        <button
          className={`submit-btn ${status === "loading" ? "submit-btn--loading" : ""}`}
          onClick={handleSubmit}
          disabled={status === "loading" || status === "success"}
        >
          {status === "success" ? "Order Sent ✓" : "Place My Order"}
        </button>

        {status === "success" && (
          <div className="form-feedback form-feedback--success">
            Your order has been received! We'll be in touch shortly to confirm.
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
