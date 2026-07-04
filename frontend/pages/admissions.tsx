"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.1 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(28px)", transition: `opacity .7s ease ${delay}ms, transform .7s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

const STEPS = [
  { num: "01", title: "Download Form", desc: "Collect the admission form from the school office or download it from this page." },
  { num: "02", title: "Fill & Submit", desc: "Complete the form and submit it with the required documents to the admin office." },
  { num: "03", title: "Assessment Day", desc: "Your child attends a brief readiness assessment conducted by our academic team." },
  { num: "04", title: "Offer Letter", desc: "Successful applicants receive an offer letter within 3–5 working days." },
  { num: "05", title: "Pay Fees", desc: "Accept the offer and make payment of the acceptance fee to secure the spot." },
  { num: "06", title: "Resumption", desc: "Your child joins us on resumption day — welcome to the Delightsome family!" },
];

const REQUIREMENTS = [
  "Completed admission application form",
  "2 recent passport photographs",
  "Birth certificate or declaration of age",
  "Last school report card (if applicable)",
  "Immunisation card",
  "Utility bill or any proof of address",
];

const FAQS = [
  { q: "When is admission open?", a: "We accept applications from January to August every year for the upcoming academic session starting in September." },
  { q: "Is there an entrance exam?", a: "We conduct a friendly readiness assessment, not a formal exam. It helps us understand your child's level so we can support them best." },
  { q: "What is the age requirement for each class?", a: "Crèche: 1–3 years · Nursery: 3–5 years · Primary 1: 5+ years. Children must meet the age requirement by September 1 of the session year." },
  { q: "Are there bursaries or scholarships?", a: "Yes. We award partial scholarships to exceptional students from indigent families. Speak to the principal's office for details." },
  { q: "Can I visit the school before applying?", a: "Absolutely — we encourage it! Contact us to book a free guided tour for you and your child." },
];

type FormState = { parentName: string; email: string; phone: string; childName: string; dob: string; programme: string; message: string };
type Errors = Partial<FormState>;

export default function AdmissionsPage() {
  const [form, setForm] = useState<FormState>({ parentName: "", email: "", phone: "", childName: "", dob: "", programme: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function set(k: keyof FormState, v: string) { setForm(p => ({ ...p, [k]: v })); if (errors[k]) setErrors(p => ({ ...p, [k]: undefined })); }

  function validate(): Errors {
    const e: Errors = {};
    if (!form.parentName.trim()) e.parentName = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.childName.trim()) e.childName = "Required";
    if (!form.programme) e.programme = "Please select a programme";
    return e;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStatus("sending");
    await new Promise(r => setTimeout(r, 1400));
    setStatus("sent");
  }

  const inp: React.CSSProperties = { fontFamily: "inherit", width: "100%", border: "2px solid #E8E6DE", borderRadius: 12, padding: "12px 15px", fontSize: 14, background: "#FAFAF7", color: "#2C2C2A", outline: "none", transition: "border-color .2s" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box;margin:0;padding:0; }
        body { font-family:'Nunito',sans-serif;background:#FAFAF7;color:#2C2C2A;overflow-x:hidden; }

        .ad-hero { background:linear-gradient(145deg,#7F77DD 0%,#534AB7 55%,#26215C 100%);padding:7rem 1.5rem 5rem;text-align:center;position:relative;overflow:hidden; }
        .ad-hero-dots { position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(circle,rgba(255,255,255,.08) 1px,transparent 1px);background-size:28px 28px; }
        .ad-hero-badge { display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.3);border-radius:999px;padding:6px 20px;font-size:13px;font-weight:700;color:#fff;letter-spacing:.08em;margin-bottom:1.5rem;backdrop-filter:blur(6px);animation:fadeDown .8s ease both; }
        .ad-hero h1 { font-family:'Fredoka One',cursive;font-size:clamp(2.4rem,6vw,4.2rem);color:#fff;line-height:1.1;max-width:700px;margin:0 auto 1.2rem;animation:fadeDown .9s ease .1s both; }
        .ad-hero h1 em { font-style:normal;color:#FAC775; }
        .ad-hero p { font-size:clamp(1rem,2vw,1.2rem);color:rgba(255,255,255,.78);max-width:520px;margin:0 auto 2.5rem;line-height:1.75;animation:fadeDown .9s ease .2s both; }
        .ad-hero-btns { display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;animation:fadeDown .9s ease .3s both; }
        @keyframes fadeDown { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }

        .ad-btn-primary { background:#FAC775;color:#2C2C2A;font-family:'Nunito',sans-serif;font-weight:800;font-size:15px;border:none;border-radius:999px;padding:13px 32px;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:8px;box-shadow:0 4px 0 #BA7517;transition:transform .15s,box-shadow .15s; }
        .ad-btn-primary:hover { transform:translateY(-2px);box-shadow:0 6px 0 #BA7517; }
        .ad-btn-outline { background:transparent;color:#fff;font-family:'Nunito',sans-serif;font-weight:700;font-size:15px;border:2px solid rgba(255,255,255,.5);border-radius:999px;padding:12px 32px;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:8px;transition:background .2s,border-color .2s; }
        .ad-btn-outline:hover { background:rgba(255,255,255,.1);border-color:#fff; }

        .ad-section { padding:5rem 1.5rem; }
        .ad-section-alt { background:#F1EFE8; }
        .ad-container { max-width:1100px;margin:0 auto; }
        .ad-label { font-size:12px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#7F77DD;margin-bottom:.6rem; }
        .ad-title { font-family:'Fredoka One',cursive;font-size:clamp(1.9rem,4vw,2.8rem);color:#2C2C2A;margin-bottom:1rem; }
        .ad-title span { color:#D85A30; }
        .ad-body { font-size:16px;color:#5F5E5A;line-height:1.8;max-width:580px;margin-bottom:2.5rem; }

        /* PROGRAMMES */
        .ad-prog-grid { display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1.25rem; }
        .ad-prog-card { border-radius:20px;padding:2rem 1.75rem;position:relative;overflow:hidden;transition:transform .25s; }
        .ad-prog-card:hover { transform:translateY(-6px) rotate(-1deg); }
        .ad-prog-age { font-size:11px;font-weight:800;letter-spacing:.15em;text-transform:uppercase;padding:4px 12px;border-radius:999px;background:rgba(0,0,0,.07);color:rgba(0,0,0,.5);display:inline-block;margin-bottom:1rem; }
        .ad-prog-name { font-family:'Fredoka One',cursive;font-size:1.5rem;color:#2C2C2A;margin-bottom:.6rem; }
        .ad-prog-desc { font-size:14px;color:#444441;line-height:1.65; }

        /* STEPS */
        .ad-steps { display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem; }
        .ad-step { background:#fff;border-radius:20px;padding:2rem;border:1.5px solid #E8E6DE;display:flex;gap:1.25rem;align-items:flex-start;transition:transform .2s,box-shadow .2s; }
        .ad-step:hover { transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,.07); }
        .ad-step-num { font-family:'Fredoka One',cursive;font-size:2.2rem;color:#E8E6DE;line-height:1;flex-shrink:0;min-width:50px; }
        .ad-step-title { font-family:'Fredoka One',cursive;font-size:1.1rem;color:#2C2C2A;margin-bottom:.4rem; }
        .ad-step-desc { font-size:14px;color:#5F5E5A;line-height:1.65; }

        /* REQUIREMENTS */
        .ad-req-list { display:flex;flex-direction:column;gap:.75rem; }
        .ad-req-item { display:flex;align-items:center;gap:12px;background:#fff;border-radius:14px;padding:1rem 1.25rem;border:1.5px solid #E8E6DE;font-size:15px;font-weight:700;color:#2C2C2A; }
        .ad-req-check { width:24px;height:24px;border-radius:50%;background:#E1F5EE;display:flex;align-items:center;justify-content:center;font-size:12px;color:#1D9E75;flex-shrink:0; }

        /* SPLIT FORM */
        .ad-split { display:grid;grid-template-columns:1fr 420px;gap:4rem;align-items:start; }
        @media(max-width:900px){ .ad-split { grid-template-columns:1fr; } }
        .ad-form-card { background:#fff;border-radius:24px;padding:2.5rem;border:1.5px solid #E8E6DE;box-shadow:0 4px 24px rgba(0,0,0,.05); }
        .ad-form-title { font-family:'Fredoka One',cursive;font-size:1.5rem;color:#2C2C2A;margin-bottom:.3rem; }
        .ad-form-sub { font-size:14px;color:#888780;margin-bottom:1.75rem; }
        .ad-form-grid { display:grid;grid-template-columns:1fr 1fr;gap:1rem; }
        @media(max-width:580px){ .ad-form-grid { grid-template-columns:1fr; } }
        .ad-field { display:flex;flex-direction:column;gap:5px; }
        .ad-field-full { grid-column:1/-1; }
        .ad-field label { font-size:13px;font-weight:800;color:#2C2C2A; }
        .ad-field-err { font-size:12px;color:#D85A30;font-weight:700; }
        .ad-submit-btn { width:100%;background:#7F77DD;color:#fff;font-family:'Nunito',sans-serif;font-weight:800;font-size:15px;border:none;border-radius:999px;padding:14px;cursor:pointer;box-shadow:0 4px 0 #534AB7;transition:transform .15s,box-shadow .15s;margin-top:.5rem; }
        .ad-submit-btn:hover { transform:translateY(-2px);box-shadow:0 6px 0 #534AB7; }
        .ad-submit-btn:disabled { opacity:.7;cursor:not-allowed;transform:none; }
        .ad-success { background:#E1F5EE;border:2px solid #1D9E75;border-radius:16px;padding:2rem;text-align:center; }
        .ad-success-title { font-family:'Fredoka One',cursive;font-size:1.4rem;color:#085041;margin-bottom:.5rem; }
        .ad-success-body { font-size:14px;color:#1D9E75;line-height:1.6; }

        /* SIDE INFO */
        .ad-side-block { background:#fff;border-radius:20px;padding:1.75rem;border:1.5px solid #E8E6DE;margin-bottom:1.25rem; }
        .ad-side-title { font-family:'Fredoka One',cursive;font-size:1.1rem;color:#2C2C2A;margin-bottom:1rem; }
        .ad-info-row { display:flex;gap:10px;margin-bottom:.75rem; }
        .ad-info-label { font-weight:800;font-size:14px;color:#7F77DD;min-width:85px; }
        .ad-info-text { font-size:14px;color:#5F5E5A;line-height:1.6; }

        /* FAQ */
        .ad-faq-item { border-radius:14px;border:1.5px solid #E8E6DE;overflow:hidden;margin-bottom:.75rem;background:#fff; }
        .ad-faq-q { width:100%;background:none;border:none;cursor:pointer;font-family:'Nunito',sans-serif;font-weight:800;font-size:15px;color:#2C2C2A;padding:1.1rem 1.5rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;text-align:left;transition:color .2s; }
        .ad-faq-q:hover { color:#7F77DD; }
        .ad-faq-arrow { font-size:14px;font-weight:800;color:#888780;transition:transform .3s;flex-shrink:0; }
        .ad-faq-arrow.open { transform:rotate(180deg); }
        .ad-faq-a { font-size:14px;color:#5F5E5A;line-height:1.75;padding:0 1.5rem;max-height:0;overflow:hidden;transition:max-height .4s ease,padding .3s ease; }
        .ad-faq-a.open { max-height:200px;padding:0 1.5rem 1.25rem; }

        /* CTA */
        .ad-cta { background:linear-gradient(135deg,#534AB7 0%,#26215C 100%);padding:5rem 1.5rem;text-align:center;position:relative;overflow:hidden; }
        .ad-cta h2 { font-family:'Fredoka One',cursive;font-size:clamp(2rem,5vw,3.2rem);color:#fff;margin-bottom:1rem;position:relative; }
        .ad-cta p { font-size:17px;color:rgba(255,255,255,.78);max-width:480px;margin:0 auto 2.5rem;line-height:1.7;position:relative; }

        @media(max-width:600px){
          .ad-hero { padding:5rem 1rem 3.5rem; }
          .ad-section { padding:3.5rem 1rem; }
          .ad-form-card { padding:1.75rem 1.25rem; }
        }
      `}</style>

      <main>
        {/* HERO */}
        <section className="ad-hero">
          <div className="ad-hero-dots" />
          <div className="ad-hero-badge">Enrol Your Child Today</div>
          <h1>Admissions <em>2026/2027</em></h1>
          <p>We are now accepting applications for all classes. Spaces are limited — don't miss out on giving your child the best start.</p>
          <div className="ad-hero-btns">
            <a href="#apply" className="ad-btn-primary">Apply Now</a>
            <Link href="/legal/contact" className="ad-btn-outline">Talk to Us</Link>
          </div>
        </section>

        {/* PROGRAMMES */}
        <section className="ad-section">
          <div className="ad-container">
            <Reveal>
              <p className="ad-label">Our Programmes</p>
              <h2 className="ad-title">We have a place <span>for every child</span></h2>
              <p className="ad-body">From as young as 1 year old to Primary 6, we offer programmes designed to nurture every stage of childhood.</p>
            </Reveal>
            <div className="ad-prog-grid">
              {[{ name: "Crèche/Reception", age: "Ages 1–3", desc: "Warm, nurturing care and early stimulation for our youngest learners.", color: "#FAC77533", border: "#FAC775" },
              { name: "Learning to Read", age: "Ages 3–5", desc: "Playful structured learning focused on building early literacy, numbers, and social skills.", color: "#E1F5EE", border: "#5DCAA5" },
              { name: "Pre-School", age: "Ages 5–7", desc: "A joyful curriculum preparing children for primary school with core subjects and creative activities.", color: "#FAECE7", border: "#D85A30" },
              { name: "Grade School", age: "Ages 7–11", desc: "Rigorous primary education covering core subjects, arts, and tech for confident, curious learners.", color: "#EAF3DE", border: "#2A5C0A" }].map((p, i) => (
                <Reveal key={p.name} delay={i * 80}>
                  <div className="ad-prog-card" style={{ background: p.color, border: `2px solid ${p.border}` }}>
                    <span className="ad-prog-age">{p.age}</span>
                    <p className="ad-prog-name">{p.name}</p>
                    <p className="ad-prog-desc">{p.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* HOW TO APPLY */}
        <section className="ad-section ad-section-alt">
          <div className="ad-container">
            <Reveal>
              <p className="ad-label">How It Works</p>
              <h2 className="ad-title">Simple 6-step <span>process</span></h2>
              <p className="ad-body">We have made the admission process as easy and stress-free as possible for families.</p>
            </Reveal>
            <div className="ad-steps">
              {STEPS.map((s, i) => (
                <Reveal key={s.num} delay={i * 60}>
                  <div className="ad-step">
                    <span className="ad-step-num">{s.num}</span>
                    <div>
                      <p className="ad-step-title">{s.title}</p>
                      <p className="ad-step-desc">{s.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* REQUIREMENTS */}
        <section className="ad-section">
          <div className="ad-container" style={{ maxWidth: 700 }}>
            <Reveal>
              <p className="ad-label">What to Bring</p>
              <h2 className="ad-title">Required <span>documents</span></h2>
              <p className="ad-body">Please have the following documents ready when you submit your application.</p>
            </Reveal>
            <div className="ad-req-list">
              {REQUIREMENTS.map((r, i) => (
                <Reveal key={r} delay={i * 50}>
                  <div className="ad-req-item">
                    <div className="ad-req-check">✓</div>
                    {r}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* APPLICATION FORM */}
        <section className="ad-section ad-section-alt" id="apply">
          <div className="ad-container">
            <div style={{ marginBottom: "3rem" }}>
              <Reveal>
                <p className="ad-label">Apply Now</p>
                <h2 className="ad-title">Start your <span>application</span></h2>
              </Reveal>
            </div>
            <div className="ad-split">

              {/* FORM */}
              <Reveal>
                <div className="ad-form-card">
                  <p className="ad-form-title">Application Form</p>
                  <p className="ad-form-sub">Fill in the details below and we will be in touch within 2 working days.</p>
                  {status === "sent" ? (
                    <div className="ad-success">
                      <p className="ad-success-title">Application Received</p>
                      <p className="ad-success-body">Thank you, {form.parentName.split(" ")[0]}! We will contact you at <strong>{form.email}</strong> within 2 working days to guide you through the next steps.</p>
                    </div>
                  ) : (
                    <form onSubmit={submit} noValidate>
                      <div className="ad-form-grid">
                        <div className="ad-field">
                          <label>Parent/Guardian Name *</label>
                          <input style={{ ...inp, borderColor: errors.parentName ? "#D85A30" : "#E8E6DE" }} placeholder="Your full name" value={form.parentName} onChange={e => set("parentName", e.target.value)} />
                          {errors.parentName && <span className="ad-field-err">{errors.parentName}</span>}
                        </div>
                        <div className="ad-field">
                          <label>Phone Number *</label>
                          <input style={{ ...inp, borderColor: errors.phone ? "#D85A30" : "#E8E6DE" }} type="tel" placeholder="+234 800 000 0000" value={form.phone} onChange={e => set("phone", e.target.value)} />
                          {errors.phone && <span className="ad-field-err">{errors.phone}</span>}
                        </div>
                        <div className="ad-field ad-field-full">
                          <label>Email Address *</label>
                          <input style={{ ...inp, borderColor: errors.email ? "#D85A30" : "#E8E6DE" }} type="email" placeholder="you@example.com" value={form.email} onChange={e => set("email", e.target.value)} />
                          {errors.email && <span className="ad-field-err">{errors.email}</span>}
                        </div>
                        <div className="ad-field">
                          <label>Child's Full Name *</label>
                          <input style={{ ...inp, borderColor: errors.childName ? "#D85A30" : "#E8E6DE" }} placeholder="Child's name" value={form.childName} onChange={e => set("childName", e.target.value)} />
                          {errors.childName && <span className="ad-field-err">{errors.childName}</span>}
                        </div>
                        <div className="ad-field">
                          <label>Date of Birth</label>
                          <input style={inp} type="date" value={form.dob} onChange={e => set("dob", e.target.value)} />
                        </div>
                        <div className="ad-field ad-field-full">
                          <label>Programme Applying For *</label>
                          <select style={{ ...inp, cursor: "pointer", borderColor: errors.programme ? "#D85A30" : "#E8E6DE" }} value={form.programme} onChange={e => set("programme", e.target.value)}>
                            <option value="">— Select programme —</option>
                            <option>Crèche/Reception (Ages 1–3)</option>
                            <option>Learning to Read (Ages 3–5)</option>
                            <option>Pre-School (Ages 5–7)</option>
                            <option>Grade School (Ages 7–11)</option>
                            <option>Primary 1</option>
                            <option>Primary 2</option>
                            <option>Primary 3</option>
                            <option>Primary 4</option>
                            <option>Primary 5</option>
                            <option>Primary 6</option>
                          </select>
                          {errors.programme && <span className="ad-field-err">{errors.programme}</span>}
                        </div>
                        <div className="ad-field ad-field-full">
                          <label>Additional Message (optional)</label>
                          <textarea style={{ ...inp, resize: "vertical", minHeight: 100 }} placeholder="Any questions or special requirements..." rows={4} value={form.message} onChange={e => set("message", e.target.value)} />
                        </div>
                      </div>
                      <button className="ad-submit-btn" type="submit" disabled={status === "sending"}>
                        {status === "sending" ? "Submitting..." : "Submit Application"}
                      </button>
                    </form>
                  )}
                </div>
              </Reveal>

              {/* SIDE */}
              <div>
                <Reveal delay={100}>
                  <div className="ad-side-block">
                    <p className="ad-side-title">Prefer to call?</p>
                    {[
                      ["Phone:", "08071690299"],
                      ["Phone:", "08071690959"],
                      ["WhatsApp:", "08134526190"],
                      ["Email:", "delightsomekidsschool@gmail.com"],
                      ["Address:", "Itori, Ewekoro LGA, Ogun State"],
                      ["Hours:", "Mon–Fri: 8am – 3pm"],
                    ].map(([label, text]) => (
                      <div key={text} className="ad-info-row">
                        <span className="ad-info-label">{label}</span>
                        <span className="ad-info-text">{text}</span>
                      </div>
                    ))}
                  </div>
                </Reveal>
                <Reveal delay={160}>
                  <div className="ad-side-block">
                    <p className="ad-side-title">Session Dates</p>
                    {[
                      ["First Term", "Sep – Dec 2026"],
                      ["Second Term", "Jan – Apr 2027"],
                      ["Third Term", "May – Jul 2027"],
                    ].map(([t, d]) => (
                      <div key={t} style={{ display: "flex", justifyContent: "space-between", padding: ".5rem 0", borderBottom: "1px solid #F1EFE8", fontSize: 14 }}>
                        <span style={{ fontWeight: 800 }}>{t}</span>
                        <span style={{ color: "#888780" }}>{d}</span>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="ad-section">
          <div className="ad-container" style={{ maxWidth: 720 }}>
            <Reveal>
              <p className="ad-label">Got Questions?</p>
              <h2 className="ad-title">Admission <span>FAQs</span></h2>
            </Reveal>
            {FAQS.map((faq, i) => (
              <Reveal key={faq.q} delay={i * 50}>
                <div className="ad-faq-item">
                  <button className="ad-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span>{faq.q}</span>
                    <span className="ad-faq-arrow">{openFaq === i ? "▲" : "▼"}</span>
                  </button>
                  <div className={"ad-faq-a" + (openFaq === i ? " open" : "")}>{faq.a}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="ad-cta">
          <Reveal>
            <h2>Don't wait — spaces fill fast</h2>
            <p>Every year we run out of spaces by July. Apply early to secure your child's place in our next session.</p>
            <a href="#apply" className="ad-btn-primary" style={{ fontSize: 17, padding: "15px 40px" }}>Apply Today</a>
          </Reveal>
        </section>

      </main>
    </>
  );
}
