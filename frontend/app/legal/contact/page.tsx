"use client"
import { useEffect, useRef, useState } from "react"

function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold })
    obs.observe(el); return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

function Reveal({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(32px)", transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`, ...style }}>
      {children}
    </div>
  )
}

const CONTACT_CARDS = [
  { icon: "A", title: "Visit Us", lines: ["Delightsome Kids School", "Itori, Ewekoro LGA", "Ogun State, Nigeria"], color: "#E1F5EE", accent: "#1D9E75" },
  { icon: "P", title: "Call Us", lines: ["08071690299", "08071690959", "Mon-Fri, 8am-4pm"], color: "#FAEEDA", accent: "#BA7517" },
  { icon: "W", title: "WhatsApp", lines: ["08134526190"], color: "#EAF3DE", accent: "#2A5C0A" },
  { icon: "E", title: "Email Us", lines: ["delightsomekidsschool@gmail.com"], color: "#FAECE7", accent: "#993C1D" },
  { icon: "H", title: "School Hours", lines: ["Mon-Fri: 8:00am - 3:00pm", "After-school Club: till 5pm", "Sat-Sun: Closed"], color: "#F3E5F5", accent: "#7B1FA2" },
]

const FAQS = [
  { q: "When does the new session begin?", a: "Our new academic session begins in September. Admission for the upcoming session opens from January each year." },
  { q: "How do I enroll my child?", a: "Visit our Admissions page, fill the form, and bring your child's documents to the school office. We'll guide you through the rest." },
  { q: "Do you offer school bus service?", a: "Yes! We have a safe, supervised school bus that covers major routes within Itori and nearby communities." },
  { q: "What is the school fees structure?", a: "Fees vary by class level. Please call or visit the school office for the current fee schedule for this session." },
  { q: "Is there an after-school programme?", a: "Yes. Our After-School Club runs Monday to Friday until 5:00pm. It includes supervised homework, sports, and enrichment activities." },
]

type FormState = { name: string; email: string; phone: string; subject: string; message: string }
type Errors = Partial<FormState>

function validate(f: FormState): Errors {
  const e: Errors = {}
  if (!f.name.trim()) e.name = "Please enter your full name"
  if (!f.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Please enter a valid email address"
  if (!f.subject) e.subject = "Please select a subject"
  if (!f.message.trim() || f.message.trim().length < 20) e.message = "Message must be at least 20 characters"
  return e
}

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", phone: "", subject: "", message: "" })
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  function set(field: keyof FormState, val: string) {
    setForm(prev => ({ ...prev, [field]: val }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setStatus("sending")
    await new Promise(r => setTimeout(r, 1400))
    setStatus("sent")
  }

  const inputBase: React.CSSProperties = {
    fontFamily: "'Nunito', sans-serif", width: "100%", padding: "12px 16px",
    borderRadius: 12, border: "2px solid #E8E6DE", background: "#FAFAF7",
    fontSize: 15, color: "#2C2C2A", outline: "none", transition: "border-color 0.2s",
    display: "block",
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Nunito', sans-serif; background: #FAFAF7; color: #2C2C2A; overflow-x: hidden; }

        .ct-hero {
          background: linear-gradient(145deg, #D85A30 0%, #993C1D 55%, #4A1B0C 100%);
          padding: 7rem 1.5rem 5rem; text-align: center; position: relative; overflow: hidden;
        }
        .ct-hero-dots {
          position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .ct-hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3);
          border-radius: 999px; padding: 6px 20px; font-size: 13px; font-weight: 700;
          color: #fff; letter-spacing: 0.08em; margin-bottom: 1.5rem;
          backdrop-filter: blur(6px); animation: fadeDown 0.8s ease both;
        }
        .ct-hero h1 {
          font-family: 'Fredoka One', cursive; font-size: clamp(2.4rem, 6vw, 4.2rem);
          color: #fff; line-height: 1.1; max-width: 700px; margin: 0 auto 1.2rem;
          animation: fadeDown 0.9s ease 0.1s both;
        }
        .ct-hero h1 em { font-style: normal; color: #FAC775; }
        .ct-hero p {
          font-size: clamp(1rem, 2vw, 1.2rem); color: rgba(255,255,255,0.75);
          max-width: 500px; margin: 0 auto; line-height: 1.75;
          animation: fadeDown 0.9s ease 0.2s both;
        }
        @keyframes fadeDown { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }

        .ct-section { padding: 5rem 1.5rem; }
        .ct-section-alt { background: #F1EFE8; }
        .ct-container { max-width: 1100px; margin: 0 auto; }
        .ct-label { font-size: 12px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; color: #D85A30; margin-bottom: 0.6rem; }
        .ct-title { font-family: 'Fredoka One', cursive; font-size: clamp(1.9rem, 4vw, 2.8rem); color: #2C2C2A; margin-bottom: 1rem; }
        .ct-title span { color: #1D9E75; }

        /* ── INFO CARDS ── */
        .ct-cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; }
        .ct-info-card {
          border-radius: 20px; padding: 2rem 1.75rem;
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .ct-info-card:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(0,0,0,0.08); }
        .ct-info-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 18px; margin-bottom: 0.9rem; }
        .ct-info-title { font-family: 'Fredoka One', cursive; font-size: 1.2rem; margin-bottom: 0.6rem; }
        .ct-info-line { font-size: 14px; color: #444441; line-height: 1.8; }

        /* ── FORM ── */
        .ct-split { display: grid; grid-template-columns: 1fr 420px; gap: 4rem; align-items: start; }
        @media(max-width: 900px) { .ct-split { grid-template-columns: 1fr; gap: 2.5rem; } }

        .ct-form-card {
          background: #fff; border-radius: 24px; padding: 2.5rem;
          border: 1.5px solid #E8E6DE;
          box-shadow: 0 4px 24px rgba(0,0,0,0.05);
        }
        .ct-form-title { font-family: 'Fredoka One', cursive; font-size: 1.6rem; color: #2C2C2A; margin-bottom: 0.4rem; }
        .ct-form-sub { font-size: 14px; color: #888780; margin-bottom: 2rem; }
        .ct-field { margin-bottom: 1.25rem; }
        .ct-label-text { font-size: 13px; font-weight: 800; color: #2C2C2A; letter-spacing: 0.04em; display: block; margin-bottom: 6px; }
        .ct-error { font-size: 12px; color: #D85A30; font-weight: 700; margin-top: 5px; display: block; }
        .ct-input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media(max-width: 500px) { .ct-input-row { grid-template-columns: 1fr; } }

        .ct-submit-btn {
          width: 100%; background: #D85A30; color: #fff;
          font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 16px;
          border: none; border-radius: 999px; padding: 14px;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 4px 0 #993C1D; transition: transform 0.15s, box-shadow 0.15s;
          margin-top: 0.5rem;
        }
        .ct-submit-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 0 #993C1D; }
        .ct-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        .ct-success {
          background: #E1F5EE; border: 2px solid #1D9E75; border-radius: 16px;
          padding: 2rem; text-align: center; margin-top: 1rem;
        }
        .ct-success-check { font-family: 'Fredoka One', cursive; font-size: 2rem; color: #1D9E75; display: block; margin-bottom: 0.75rem; }
        .ct-success-title { font-family: 'Fredoka One', cursive; font-size: 1.4rem; color: #085041; margin-bottom: 0.5rem; }
        .ct-success-body { font-size: 14px; color: #1D9E75; }

        /* ── SIDE INFO ── */
        .ct-side-info { display: flex; flex-direction: column; gap: 1.5rem; }
        .ct-side-block { background: #fff; border-radius: 20px; padding: 2rem; border: 1.5px solid #E8E6DE; }
        .ct-side-block-title { font-family: 'Fredoka One', cursive; font-size: 1.15rem; color: #2C2C2A; margin-bottom: 1rem; }
        .ct-social-row { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .ct-social-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: #F1EFE8; border-radius: 999px; padding: 8px 16px;
          font-size: 13px; font-weight: 700; color: #2C2C2A; text-decoration: none;
          transition: background 0.2s, transform 0.15s;
        }
        .ct-social-btn:hover { background: #E1F5EE; color: #1D9E75; transform: scale(1.05); }

        /* ── FAQ ── */
        .ct-faq-item {
          border-radius: 14px; border: 1.5px solid #E8E6DE; overflow: hidden;
          margin-bottom: 0.75rem; background: #fff;
        }
        .ct-faq-q {
          width: 100%; background: none; border: none; cursor: pointer;
          font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 15px;
          color: #2C2C2A; padding: 1.1rem 1.5rem;
          display: flex; align-items: center; justify-content: space-between; gap: 1rem;
          text-align: left; transition: color 0.2s;
        }
        .ct-faq-q:hover { color: #D85A30; }
        .ct-faq-arrow { font-size: 18px; transition: transform 0.3s; flex-shrink: 0; }
        .ct-faq-arrow.open { transform: rotate(180deg); }
        .ct-faq-a {
          font-size: 14px; color: #5F5E5A; line-height: 1.75;
          padding: 0 1.5rem; max-height: 0; overflow: hidden;
          transition: max-height 0.4s ease, padding 0.3s ease;
        }
        .ct-faq-a.open { max-height: 200px; padding: 0 1.5rem 1.25rem; }

        /* ── MAP PLACEHOLDER ── */
        .ct-map {
          background: linear-gradient(135deg, #E1F5EE 0%, #C1EAD8 100%);
          border-radius: 20px; height: 280px; display: flex;
          flex-direction: column; align-items: center; justify-content: center;
          gap: 0.75rem; border: 2px solid #5DCAA5;
        }
        .ct-map-icon { font-family: 'Fredoka One', cursive; font-size: 2rem; color: #085041; width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; background: #fff; border-radius: 50%; }
        .ct-map-label { font-family: 'Fredoka One', cursive; font-size: 1.1rem; color: #085041; }
        .ct-map-sub { font-size: 13px; color: #1D9E75; font-weight: 600; }

        @media(max-width: 600px) {
          .ct-hero { padding: 5rem 1rem 3.5rem; }
          .ct-section { padding: 3.5rem 1rem; }
          .ct-form-card { padding: 1.75rem 1.25rem; }
        }
      `}</style>

      <main>

        {/* ── HERO ── */}
        <section className="ct-hero">
          <div className="ct-hero-dots" />
          <div className="ct-hero-badge">We'd love to hear from you</div>
          <h1>Get in <em>Touch</em></h1>
          <p>Have a question, want to enroll, or just want to say hello? We're always happy to hear from families.</p>
        </section>

        {/* ── CONTACT INFO CARDS ── */}
        <section className="ct-section">
          <div className="ct-container">
            <Reveal>
              <p className="ct-label">How to Reach Us</p>
              <h2 className="ct-title">We're always <span>available</span></h2>
            </Reveal>
            <div className="ct-cards-grid">
              {CONTACT_CARDS.map((c, i) => (
                <Reveal key={c.title} delay={i * 80}>
                  <div className="ct-info-card" style={{ background: c.color }}>
                    <div className="ct-info-icon" style={{ background: c.accent + '22', color: c.accent }}>{c.icon}</div>
                    <p className="ct-info-title" style={{ color: c.accent }}>{c.title}</p>
                    {c.lines.map(l => <p key={l} className="ct-info-line">{l}</p>)}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── FORM + SIDE ── */}
        <section className="ct-section ct-section-alt">
          <div className="ct-container">
            <Reveal style={{ marginBottom: "3rem" }}>
              <p className="ct-label">Send a Message</p>
              <h2 className="ct-title">Write to <span>us directly</span></h2>
            </Reveal>
            <div className="ct-split">

              {/* FORM */}
              <Reveal>
                <div className="ct-form-card">
                  <p className="ct-form-title">Send us a message</p>
                  <p className="ct-form-sub">We usually respond within one school day.</p>

                  {status === "sent" ? (
                    <div className="ct-success">
                      <span className="ct-success-check">OK</span>
                      <p className="ct-success-title">Message Received!</p>
                      <p className="ct-success-body">Thank you, {form.name.split(" ")[0]}! We'll get back to you at <strong>{form.email}</strong> very soon.</p>
                    </div>
                  ) : (
                    <form onSubmit={submit} noValidate>
                      <div className="ct-input-row">
                        <div className="ct-field">
                          <label className="ct-label-text">Full Name *</label>
                          <input style={{ ...inputBase, borderColor: errors.name ? "#D85A30" : "#E8E6DE" }}
                            placeholder="e.g. Amina Okonkwo" value={form.name}
                            onChange={e => set("name", e.target.value)} />
                          {errors.name && <span className="ct-error">⚠ {errors.name}</span>}
                        </div>
                        <div className="ct-field">
                          <label className="ct-label-text">Phone (optional)</label>
                          <input style={{ ...inputBase }} type="tel"
                            placeholder="+234 800 000 0000" value={form.phone}
                            onChange={e => set("phone", e.target.value)} />
                        </div>
                      </div>

                      <div className="ct-field">
                        <label className="ct-label-text">Email Address *</label>
                        <input style={{ ...inputBase, borderColor: errors.email ? "#D85A30" : "#E8E6DE" }}
                          type="email" placeholder="you@example.com" value={form.email}
                          onChange={e => set("email", e.target.value)} />
                        {errors.email && <span className="ct-error">⚠ {errors.email}</span>}
                      </div>

                      <div className="ct-field">
                        <label className="ct-label-text">Subject *</label>
                        <select style={{ ...inputBase, borderColor: errors.subject ? "#D85A30" : "#E8E6DE", cursor: "pointer" }}
                          value={form.subject} onChange={e => set("subject", e.target.value)}>
                          <option value="">Select a subject</option>
                          <option>Admission Enquiry</option>
                          <option>School Fees</option>
                          <option>Bus Service</option>
                          <option>Academic Concern</option>
                          <option>General Enquiry</option>
                          <option>Other</option>
                        </select>
                        {errors.subject && <span className="ct-error">⚠ {errors.subject}</span>}
                      </div>

                      <div className="ct-field">
                        <label className="ct-label-text">Message *</label>
                        <textarea style={{ ...inputBase, resize: "vertical", minHeight: 130, borderColor: errors.message ? "#D85A30" : "#E8E6DE" }}
                          placeholder="Write your question or request here…" rows={5}
                          value={form.message} onChange={e => set("message", e.target.value)} />
                        <span style={{ fontSize: 12, color: form.message.length < 20 ? "#888780" : "#1D9E75", fontWeight: 700 }}>
                          {form.message.length} characters {form.message.length < 20 ? `(${20 - form.message.length} more needed)` : "OK"}
                        </span>
                        {errors.message && <span className="ct-error">⚠ {errors.message}</span>}
                      </div>

                      <button className="ct-submit-btn" type="submit" disabled={status === "sending"}>
                        {status === "sending" ? "Sending..." : "Send Message"}
                      </button>
                    </form>
                  )}
                </div>
              </Reveal>

              {/* SIDE */}
              <div className="ct-side-info">
                <Reveal delay={100}>
                  <div className="ct-side-block">
                    <p className="ct-side-block-title">Find us on the map</p>
                    <div className="ct-map">
                      <span className="ct-map-icon">M</span>
                      <p className="ct-map-label">Delightsome Kids School</p>
                      <p className="ct-map-sub">Itori, Ewekoro LGA, Ogun State</p>
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={180}>
                  <div className="ct-side-block">
                    <p className="ct-side-block-title">Follow Us</p>
                    <div className="ct-social-row">
                      {["Facebook", "Instagram", "Twitter", "YouTube"].map(n => (
                        <a key={n} href="#" className="ct-social-btn">{n}</a>
                      ))}
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={260}>
                  <div className="ct-side-block">
                    <p className="ct-side-block-title">Quick Actions</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                      {[["Apply for Admission", "/admissions"], ["Download Calendar", "#"], ["View Fee Schedule", "#"]].map(([l, h]) => (
                        <a key={l as string} href={h as string} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 12, background: "#F1EFE8", fontSize: 14, fontWeight: 700, color: "#2C2C2A", textDecoration: "none", transition: "background 0.2s" }}
                          onMouseOver={ev => (ev.currentTarget.style.background = "#E1F5EE")}
                          onMouseOut={ev => (ev.currentTarget.style.background = "#F1EFE8")}>
                          {l as string}
                        </a>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="ct-section">
          <div className="ct-container" style={{ maxWidth: 720 }}>
            <Reveal>
              <p className="ct-label">Common Questions</p>
              <h2 className="ct-title">FAQ</h2>
              <p style={{ fontSize: 16, color: "#5F5E5A", marginBottom: "2rem", lineHeight: 1.7 }}>
                Can't find your answer below? Send us a message above and we'll respond within one school day.
              </p>
            </Reveal>
            {FAQS.map((faq, i) => (
              <Reveal key={faq.q} delay={i * 60}>
                <div className="ct-faq-item">
                  <button className="ct-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                    <span>{faq.q}</span>
                    <span className={`ct-faq-arrow${openFaq === i ? " open" : ""}`}>▾</span>
                  </button>
                  <div className={`ct-faq-a${openFaq === i ? " open" : ""}`}>{faq.a}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

      </main>
    </>
  )
}