import { useState } from "react";
import emailjs from '@emailjs/browser';
import "./ContactPage.scss";

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export default function ContactPage() {
  const [form, setForm]     = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");

    try {
      await emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:  form.name,
          from_email: form.email,
          subject:    form.subject,
          message:    form.message,
        },
        EMAILJS_PUBLIC_KEY
      );

      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.log(err);
      setStatus("error");
    }
  }

  return (
    <div className="contact-page">

      {/* ── Page Hero ── */}
      <section className="contact-hero">
        <div className="contact-hero__inner">
          <span className="section-label">Get in Touch</span>
          <h1 className="contact-hero__title">
            We'd love to <em>hear from you</em>
          </h1>
          <p className="contact-hero__desc">
            Questions about ordering, wholesale inquiries, or just want to say hello — drop us a message and we'll get back to you.
          </p>
        </div>
        <div className="contact-hero__rule" aria-hidden="true" />
      </section>

      {/* ── Main Content ── */}
      <section className="contact-body">

        {/* Left — Form */}
        <div className="contact-form-wrap">
          <form className="contact-form" onSubmit={handleSubmit} noValidate>

            <div className="form-row form-row--half">
              <div className="form-field">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  disabled={status === "sending"}
                />
              </div>
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={status === "sending"}
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                name="subject"
                type="text"
                placeholder="What's this about?"
                value={form.subject}
                onChange={handleChange}
                required
                disabled={status === "sending"}
              />
            </div>

            <div className="form-field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={6}
                placeholder="Tell us what's on your mind…"
                value={form.message}
                onChange={handleChange}
                required
                disabled={status === "sending"}
              />
            </div>

            <div className="form-footer">
              <button
                type="submit"
                className="btn-primary"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending…" : <>Send Message <ArrowRight /></>}
              </button>

              {status === "success" && (
                <p className="form-feedback form-feedback--success">
                  ✦ Message sent. We'll be in touch soon.
                </p>
              )}
              {status === "error" && (
                <p className="form-feedback form-feedback--error">
                  Something went wrong. Please try again or email us directly.
                </p>
              )}
            </div>

          </form>
        </div>

      </section>

    </div>
  );
}
