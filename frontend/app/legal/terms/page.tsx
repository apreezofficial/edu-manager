"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.1 })
    obs.observe(el); return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms` }}>
      {children}
    </div>
  )
}

const LEGAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Nunito', sans-serif; background: #FAFAF7; color: #2C2C2A; }

  .lg-hero {
    padding: 6rem 1.5rem 4rem; text-align: center; position: relative; overflow: hidden;
  }
  .lg-hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.35);
    border-radius: 999px; padding: 6px 20px; font-size: 13px; font-weight: 700;
    color: #fff; letter-spacing: 0.08em; margin-bottom: 1.5rem;
    backdrop-filter: blur(6px); animation: fadeDown 0.8s ease both;
  }
  .lg-hero h1 {
    font-family: 'Fredoka One', cursive; font-size: clamp(2.2rem, 5vw, 3.8rem);
    color: #fff; line-height: 1.1; max-width: 660px; margin: 0 auto 1rem;
    animation: fadeDown 0.9s ease 0.1s both;
  }
  .lg-hero p {
    font-size: 15px; color: rgba(255,255,255,0.75); max-width: 480px; margin: 0 auto;
    line-height: 1.75; animation: fadeDown 0.9s ease 0.2s both;
  }
  @keyframes fadeDown { from{opacity:0;transform:translateY(-18px)} to{opacity:1;transform:translateY(0)} }

  .lg-layout { display: grid; grid-template-columns: 240px 1fr; gap: 3rem; max-width: 1000px; margin: 0 auto; padding: 5rem 1.5rem; align-items: start; }
  @media(max-width:750px) { .lg-layout { grid-template-columns: 1fr; padding: 3rem 1rem; } }

  .lg-toc { position: sticky; top: 90px; background: #fff; border-radius: 20px; padding: 1.5rem; border: 1.5px solid #E8E6DE; }
  .lg-toc-title { font-family: 'Fredoka One', cursive; font-size: 1rem; color: #2C2C2A; margin-bottom: 1rem; }
  .lg-toc a {
    display: block; font-size: 13px; font-weight: 700; color: #888780;
    text-decoration: none; padding: 6px 0; border-bottom: 1px solid #F1EFE8;
    transition: color 0.2s;
  }
  .lg-toc a:hover { color: #1D9E75; }
  .lg-toc a:last-child { border-bottom: none; }

  .lg-content { }
  .lg-updated { font-size: 13px; color: #888780; font-weight: 700; margin-bottom: 3rem; display: flex; align-items: center; gap: 8px; }
  .lg-updated span { background: #E1F5EE; color: #085041; padding: 3px 12px; border-radius: 999px; font-size: 12px; }

  .lg-section { margin-bottom: 3rem; scroll-margin-top: 100px; }
  .lg-section-num { font-size: 12px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; color: #1D9E75; margin-bottom: 0.4rem; }
  .lg-section h2 { font-family: 'Fredoka One', cursive; font-size: 1.5rem; color: #2C2C2A; margin-bottom: 0.9rem; }
  .lg-section p { font-size: 15px; color: #5F5E5A; line-height: 1.85; margin-bottom: 0.75rem; }
  .lg-section ul { margin: 0.5rem 0 0.75rem 1.25rem; }
  .lg-section ul li { font-size: 15px; color: #5F5E5A; line-height: 1.8; margin-bottom: 4px; }
  .lg-section-divider { border: none; border-top: 1.5px solid #E8E6DE; margin: 3rem 0; }

  .lg-contact-box {
    background: #E1F5EE; border: 2px solid #5DCAA5; border-radius: 20px;
    padding: 2rem; margin-top: 3rem; text-align: center;
  }
  .lg-contact-box h3 { font-family: 'Fredoka One', cursive; font-size: 1.3rem; color: #085041; margin-bottom: 0.5rem; }
  .lg-contact-box p { font-size: 14px; color: #1D9E75; margin-bottom: 1rem; line-height: 1.6; }
  .lg-contact-btn {
    display: inline-flex; align-items: center; gap: 6px;
    background: #1D9E75; color: #fff; font-family: 'Nunito', sans-serif;
    font-weight: 800; font-size: 14px; border-radius: 999px; padding: 10px 24px;
    text-decoration: none; box-shadow: 0 3px 0 #0F6E56;
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .lg-contact-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 0 #0F6E56; }

  @media(max-width:600px){ .lg-toc { display: none; } }
`

/* ══════════════════════════════════════════
   PRIVACY PAGE
══════════════════════════════════════════ */
const PRIVACY_SECTIONS = [
  {
    id: "collection", title: "Information We Collect", num: "01",
    paragraphs: ["When you contact us, enroll a child, or use our website, we may collect personal information such as your name, email address, phone number, and your child's details (name, age, class level)."],
    bullets: ["Contact information (name, email, phone)", "Child's name, date of birth, and class level", "Messages and enquiries you send us", "Browser and usage data collected automatically via cookies"],
  },
  {
    id: "use", title: "How We Use Your Information", num: "02",
    paragraphs: ["We use the information we collect solely to operate the school effectively and communicate with families. We do not use your data for unrelated commercial purposes."],
    bullets: ["Processing admission applications", "Communicating about school events and updates", "Responding to enquiries and messages", "Improving our website and services"],
  },
  {
    id: "sharing", title: "Sharing of Information", num: "03",
    paragraphs: ["We do not sell, trade, or rent your personal information to third parties. We may share information with trusted service providers who assist us in operating the school, subject to confidentiality agreements."],
    bullets: [],
  },
  {
    id: "security", title: "Data Security", num: "04",
    paragraphs: ["We take reasonable measures to protect your personal information from unauthorised access, use, or disclosure. Our systems are secured and access to student data is restricted to authorised staff only."],
    bullets: [],
  },
  {
    id: "rights", title: "Your Rights", num: "05",
    paragraphs: ["You have the right to access, correct, or request deletion of your personal information at any time. To exercise these rights, please contact us using the details below."],
    bullets: ["Access the data we hold about you", "Request correction of inaccurate data", "Request deletion of your data", "Withdraw consent at any time"],
  },
];

/* ══════════════════════════════════════════
   TERMS PAGE
══════════════════════════════════════════ */
const TERMS_SECTIONS = [
  {
    id: "acceptance", title: "Acceptance of Terms", num: "01",
    paragraphs: ["By accessing or using the Delightsome Kids School website, you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, please do not use our website."],
    bullets: [],
  },
  {
    id: "use", title: "Permitted Use", num: "02",
    paragraphs: ["This website is provided for informational purposes relating to Delightsome Kids School. You may use this site to learn about our programmes, contact us, and access school updates."],
    bullets: ["Do not reproduce or redistribute our content without written permission", "Do not use the site for any unlawful or fraudulent purpose", "Do not attempt to gain unauthorised access to any part of the website", "Do not post or transmit harmful, offensive, or misleading content"],
  },
  {
    id: "ip", title: "Intellectual Property", num: "03",
    paragraphs: ["All content on this website — including text, images, logos, and design — is the property of Delightsome Kids School and is protected by applicable intellectual property laws. Unauthorised use is prohibited."],
    bullets: [],
  },
  {
    id: "accuracy", title: "Accuracy of Information", num: "04",
    paragraphs: ["We strive to keep the information on our website accurate and up to date. However, we make no warranties regarding the completeness, reliability, or accuracy of any information on this site. School policies, fees, and dates are subject to change — please contact us to confirm current details."],
    bullets: [],
  },
  {
    id: "links", title: "External Links", num: "05",
    paragraphs: ["Our website may contain links to third-party websites for your convenience. We do not endorse or take responsibility for the content, privacy practices, or accuracy of any external websites."],
    bullets: [],
  },
  {
    id: "liability", title: "Limitation of Liability", num: "06",
    paragraphs: ["To the fullest extent permitted by law, Delightsome Kids School shall not be liable for any indirect, incidental, or consequential damages arising from your use of this website or reliance on any information contained herein."],
    bullets: [],
  },
  {
    id: "changes", title: "Changes to These Terms", num: "07",
    paragraphs: ["We reserve the right to update these Terms of Use at any time without prior notice. Your continued use of the website after changes are made constitutes your acceptance of the revised terms."],
    bullets: [],
  },
  {
    id: "governing", title: "Governing Law", num: "08",
    paragraphs: ["These Terms of Use are governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes shall be subject to the exclusive jurisdiction of the courts of Ogun State."],
    bullets: [],
  },
]

export default function TermsPage() {
  return (
    <>
      <style>{LEGAL_STYLES}</style>
      <main>
        <section className="lg-hero" style={{ background: "linear-gradient(145deg, #2C2C2A 0%, #444441 100%)" }}>
          <div className="lg-hero-badge">📋 Legal</div>
          <h1>Terms of Use</h1>
          <p>Please read these terms carefully before using the Delightsome Kids School website.</p>
        </section>

        <div className="lg-layout">
          {/* TOC */}
          <aside className="lg-toc">
            <p className="lg-toc-title">📋 On this page</p>
            {TERMS_SECTIONS.map(s => <a key={s.id} href={`#${s.id}`}>{s.num}. {s.title}</a>)}
          </aside>

          {/* Content */}
          <article className="lg-content">
            <p className="lg-updated">Last updated: <span>January 1, 2026</span></p>

            {TERMS_SECTIONS.map((s, i) => (
              <Reveal key={s.id} delay={i * 45}>
                <div className="lg-section" id={s.id}>
                  <p className="lg-section-num">{s.num}</p>
                  <h2>{s.title}</h2>
                  {s.paragraphs.map((p, j) => <p key={j}>{p}</p>)}
                  {s.bullets.length > 0 && (
                    <ul>{s.bullets.map(b => <li key={b}>{b}</li>)}</ul>
                  )}
                </div>
                {i < TERMS_SECTIONS.length - 1 && <hr className="lg-section-divider" />}
              </Reveal>
            ))}

            <Reveal>
              <div className="lg-contact-box">
                <h3>📋 Questions about these terms?</h3>
                <p>If you have any questions about our Terms of Use, please contact us and we'll be happy to help.</p>
                <Link href="/legal/contact" className="lg-contact-btn">💬 Contact Us</Link>
              </div>
            </Reveal>
          </article>
        </div>
      </main>
    </>
  )
}
