"use client"
import Link from "next/link"

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/blog", label: "Blog & News" },
  { href: "/gallery", label: "Gallery" },
  { href: "/admissions", label: "Admissions" },
  { href: "/legal/contact", label: "Contact Us" },
]

const LEGAL_LINKS = [
  { href: "/legal/terms", label: "Terms of Use" },
  { href: "/legal/privacy", label: "Privacy Policy" },
]

const PROGRAMMES = [
  { label: "Crèche (Ages 1–3)" },
  { label: "Nursery (Ages 3–5)" },
  { label: "Primary School (Ages 5–11)" },
  { label: "After-School Club" },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .dk-footer {
          font-family: 'Nunito', sans-serif;
          background: #1A1A18;
          color: #B4B2A9;
          position: relative;
          overflow: hidden;
        }

        /* top wave accent */
        .dk-footer-wave {
          width: 100%; height: 6px;
          background: linear-gradient(90deg, #FAC775 0%, #1D9E75 33%, #D85A30 66%, #7F77DD 100%);
        }

        /* newsletter band */
        .dk-footer-nl {
          background: #242420;
          padding: 2.5rem 2rem;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .dk-footer-nl-text { }
        .dk-footer-nl-text h4 {
          font-family: 'Fredoka One', cursive;
          font-size: 1.3rem; color: #fff; margin-bottom: 4px;
        }
        .dk-footer-nl-text p { font-size: 14px; color: #888780; }
        .dk-footer-nl-form { display: flex; gap: 0.6rem; flex-wrap: wrap; }
        .dk-footer-nl-input {
          font-family: 'Nunito', sans-serif;
          background: rgba(255,255,255,0.08); border: 1.5px solid rgba(255,255,255,0.12);
          border-radius: 999px; padding: 10px 18px; color: #fff; font-size: 14px; font-weight: 600;
          outline: none; width: 220px; transition: border-color 0.2s;
        }
        .dk-footer-nl-input::placeholder { color: rgba(255,255,255,0.35); }
        .dk-footer-nl-input:focus { border-color: #1D9E75; }
        .dk-footer-nl-btn {
          background: #1D9E75; color: #fff; font-family: 'Nunito', sans-serif;
          font-weight: 800; font-size: 13px; border: none; border-radius: 999px;
          padding: 10px 22px; cursor: pointer;
          box-shadow: 0 3px 0 #0F6E56; transition: transform 0.15s, box-shadow 0.15s;
          white-space: nowrap;
        }
        .dk-footer-nl-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 0 #0F6E56; }

        /* main grid */
        .dk-footer-main {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 3rem;
          padding: 4rem 2rem 3rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        @media(max-width: 900px) { .dk-footer-main { grid-template-columns: 1fr 1fr; gap: 2rem; padding: 3rem 1.5rem 2.5rem; } }
        @media(max-width: 550px) { .dk-footer-main { grid-template-columns: 1fr; gap: 2rem; padding: 2.5rem 1.25rem; } }

        /* brand col */
        .dk-footer-logo {
          display: flex; align-items: center; gap: 12px; margin-bottom: 1.25rem; text-decoration: none;
        }
        .dk-footer-logo-icon {
          width: 46px; height: 46px; background: #1D9E75; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          transform: rotate(-3deg); box-shadow: 3px 3px 0 #0F6E56; flex-shrink: 0;
        }
        .dk-footer-logo-icon svg { width: 24px; height: 24px; fill: #fff; }
        .dk-footer-logo-main {
          font-family: 'Fredoka One', cursive; font-size: 22px;
          color: #fff; display: block; line-height: 1.1;
        }
        .dk-footer-logo-main span { color: #1D9E75; }
        .dk-footer-logo-sub {
          font-size: 10px; font-weight: 700; color: #FAC775;
          letter-spacing: 0.15em; text-transform: uppercase; display: block;
        }
        .dk-footer-brand-body { font-size: 14px; line-height: 1.75; color: #888780; margin-bottom: 1.5rem; max-width: 300px; }

        /* social */
        .dk-footer-socials { display: flex; gap: 0.6rem; flex-wrap: wrap; }
        .dk-footer-social {
          width: 38px; height: 38px; border-radius: 10px;
          background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center; font-size: 16px;
          text-decoration: none; transition: background 0.2s, transform 0.2s;
        }
        .dk-footer-social:hover { background: rgba(29,158,117,0.25); transform: translateY(-3px); }

        /* columns */
        .dk-footer-col h5 {
          font-family: 'Fredoka One', cursive; font-size: 1rem; color: #fff;
          margin-bottom: 1rem; display: flex; align-items: center; gap: 8px;
        }
        .dk-footer-col a, .dk-footer-col p {
          display: block; font-size: 14px; color: #888780; text-decoration: none;
          padding: 4px 0; line-height: 1.6; transition: color 0.2s;
        }
        .dk-footer-col a:hover { color: #1D9E75; }

        /* contact items */
        .dk-footer-contact-item { display: flex; gap: 10px; align-items: flex-start; margin-bottom: 0.75rem; }
        .dk-footer-contact-icon { font-size: 16px; flex-shrink: 0; margin-top: 2px; }
        .dk-footer-contact-text { font-size: 13px; color: #888780; line-height: 1.6; }

        /* divider */
        .dk-footer-divider { border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 0 2rem; }

        /* bottom bar */
        .dk-footer-bottom {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 1rem;
          padding: 1.5rem 2rem;
          max-width: 1200px; margin: 0 auto;
        }
        .dk-footer-copy { font-size: 13px; color: #5F5E5A; }
        .dk-footer-copy strong { color: #888780; }
        .dk-footer-legal { display: flex; gap: 1.5rem; flex-wrap: wrap; }
        .dk-footer-legal a { font-size: 13px; color: #5F5E5A; text-decoration: none; transition: color 0.2s; }
        .dk-footer-legal a:hover { color: #1D9E75; }

        /* animated dots deco */
        .dk-footer-deco {
          position: absolute; bottom: 0; right: 0; pointer-events: none; user-select: none;
          opacity: 0.04;
          background-image: radial-gradient(circle, #fff 1px, transparent 1px);
          background-size: 24px 24px;
          width: 320px; height: 200px;
        }

        /* back to top */
        .dk-btt {
          position: fixed; bottom: 2rem; right: 2rem; z-index: 999;
          width: 44px; height: 44px; border-radius: 12px;
          background: #1D9E75; color: #fff; border: none;
          font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(29,158,117,0.4);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .dk-btt:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(29,158,117,0.5); }

        @media(max-width: 600px) {
          .dk-footer-nl { padding: 2rem 1.25rem; }
          .dk-footer-bottom { padding: 1.25rem; }
          .dk-footer-divider { margin: 0 1.25rem; }
        }
      `}</style>

      <footer className="dk-footer" role="contentinfo">
        <div className="dk-footer-deco" />

        {/* Colour wave */}
        <div className="dk-footer-wave" />

        {/* Newsletter */}
        <div className="dk-footer-nl">
          <div className="dk-footer-nl-text">
            <h4>📬 Stay Updated</h4>
            <p>Get school news and announcements straight to your inbox.</p>
          </div>
          <div className="dk-footer-nl-form">
            <input className="dk-footer-nl-input" type="email" placeholder="Your email address" aria-label="Email for newsletter" />
            <button className="dk-footer-nl-btn">Subscribe ✓</button>
          </div>
        </div>

        {/* Main grid */}
        <div className="dk-footer-main">

          {/* Brand */}
          <div>
            <Link href="/" className="dk-footer-logo">
              <div className="dk-footer-logo-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
                </svg>
              </div>
              <div>
                <span className="dk-footer-logo-main">Delightsome<span>Kids</span></span>
                <span className="dk-footer-logo-sub">Nurturing Young Minds</span>
              </div>
            </Link>
            <p className="dk-footer-brand-body">
              A forward-thinking school in Itori, Ogun State, dedicated to raising confident, creative, and responsible children since 2010.
            </p>
            <div className="dk-footer-socials" aria-label="Social media links">
              {[["📘","https://","Facebook"],["📸","https://","Instagram"],["🐦","https://","Twitter"],["▶️","https://","YouTube"]].map(([e, h, n]) => (
                <a key={n as string} href={h as string} className="dk-footer-social" aria-label={n as string} title={n as string}>{e}</a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <nav className="dk-footer-col" aria-label="Quick links">
            <h5>🔗 Quick Links</h5>
            {QUICK_LINKS.map(l => <Link key={l.href} href={l.href}>{l.label}</Link>)}
          </nav>

          {/* Programmes */}
          <div className="dk-footer-col">
            <h5>🎓 Programmes</h5>
            {PROGRAMMES.map(p => <p key={p.label}>{p.label}</p>)}
          </div>

          {/* Contact */}
          <div className="dk-footer-col">
            <h5>📞 Contact</h5>
            <div className="dk-footer-contact-item">
              <span className="dk-footer-contact-icon">📍</span>
              <span className="dk-footer-contact-text">Itori, Ewekoro LGA, Ogun State, Nigeria</span>
            </div>
            <div className="dk-footer-contact-item">
              <span className="dk-footer-contact-icon">📞</span>
              <span className="dk-footer-contact-text">+234 800 000 0000</span>
            </div>
            <div className="dk-footer-contact-item">
              <span className="dk-footer-contact-icon">📧</span>
              <span className="dk-footer-contact-text">hello@delightsome.edu.ng</span>
            </div>
            <div className="dk-footer-contact-item">
              <span className="dk-footer-contact-icon">🕐</span>
              <span className="dk-footer-contact-text">Mon–Fri: 8:00am – 3:00pm</span>
            </div>
          </div>
        </div>

        <hr className="dk-footer-divider" />

        {/* Bottom bar */}
        <div className="dk-footer-bottom">
          <p className="dk-footer-copy">
            © {year} <strong>Delightsome Kids School</strong>. All rights reserved. Made with 💚 in Itori.
          </p>
          <nav className="dk-footer-legal" aria-label="Legal links">
            {LEGAL_LINKS.map(l => <Link key={l.href} href={l.href}>{l.label}</Link>)}
          </nav>
        </div>
      </footer>

      {/* Back to top */}
      <button
        className="dk-btt"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        title="Back to top"
      >
        ↑
      </button>
    </>
  )
}