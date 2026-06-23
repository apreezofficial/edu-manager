"use client"
import React from "react";
import { useState } from "react"
import Link from "next/link"

const NAV_LINKS = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/about", label: "About Us", icon: "ℹ️" },
  { href: "/blog", label: "Blog", icon: "📝" },
  { href: "/gallery", label: "Gallery", icon: "🖼️" },
  { href: "/admissions", label: "Admissions", icon: "📋" },
  { href: "/portal", label: "Results", icon: "📊" },
  { href: "/legal/contact", label: "Contact", icon: "✉️" },
]

const LEGAL_LINKS = [
  { href: "/legal/terms", label: "Terms" },
  { href: "/legal/privacy", label: "Privacy" },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700&display=swap');

        .dk-header * { box-sizing: border-box; margin: 0; padding: 0; }

        .dk-header {
          font-family: 'Nunito', sans-serif;
          background: #ffffff;
          border-bottom: 3px solid #FAC775;
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
        }

        /* ── Top bar ── */
        .dk-topbar {
          background: #1D9E75;
          padding: 6px 2rem;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .dk-topbar a {
          font-size: 12px;
          color: #E1F5EE;
          text-decoration: none;
          font-weight: 600;
          letter-spacing: 0.03em;
          transition: color 0.2s;
          white-space: nowrap;
        }
        .dk-topbar a:hover { color: #fff; }
        .dk-topbar-divider { color: #5DCAA5; font-size: 11px; }

        /* ── Main row ── */
        .dk-main-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 2rem 14px;
          gap: 1rem;
        }

        /* ── Logo ── */
        .dk-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .dk-logo-icon {
          width: 48px;
          height: 48px;
          background: #1D9E75;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(-3deg);
          box-shadow: 3px 3px 0 #0F6E56;
          flex-shrink: 0;
        }
        .dk-logo-icon svg {
          width: 26px;
          height: 26px;
          fill: #ffffff;
        }
        .dk-logo-main {
          font-family: 'Fredoka One', cursive;
          font-size: 26px;
          color: #2C2C2A;
          letter-spacing: 0.01em;
          display: block;
          line-height: 1.1;
        }
        .dk-logo-main span { color: #1D9E75; }
        .dk-logo-sub {
          font-size: 10px;
          font-weight: 700;
          color: #D85A30;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          display: block;
          margin-top: 2px;
        }

        /* ── Search ── */
        .dk-search { position: relative; flex-shrink: 0; }
        .dk-search input {
          font-family: 'Nunito', sans-serif;
          background: #F1EFE8;
          border: 2px solid transparent;
          border-radius: 999px;
          padding: 9px 16px 9px 40px;
          font-size: 14px;
          color: #2C2C2A;
          width: 200px;
          outline: none;
          transition: border-color 0.2s, width 0.3s, background 0.2s;
        }
        .dk-search input::placeholder { color: #888780; }
        .dk-search input:focus {
          border-color: #1D9E75;
          background: #fff;
          width: 240px;
        }
        .dk-search-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #888780;
          font-size: 16px;
          pointer-events: none;
        }

        /* ── CTA button ── */
        .dk-cta {
          background: #D85A30;
          color: #fff;
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          font-size: 14px;
          border: none;
          border-radius: 999px;
          padding: 10px 22px;
          cursor: pointer;
          white-space: nowrap;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 3px 0 #993C1D;
          transition: transform 0.15s, box-shadow 0.15s;
          flex-shrink: 0;
        }
        .dk-cta:hover { transform: translateY(-2px); box-shadow: 0 5px 0 #993C1D; }
        .dk-cta:active { transform: translateY(1px); box-shadow: 0 1px 0 #993C1D; }

        /* ── Hamburger ── */
        .dk-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: background 0.2s;
        }
        .dk-hamburger:hover { background: #F1EFE8; }
        .dk-hamburger span {
          display: block;
          width: 22px;
          height: 2.5px;
          background: #2C2C2A;
          border-radius: 2px;
          transition: transform 0.3s, opacity 0.3s;
        }
        .dk-hamburger.open span:nth-child(1) { transform: translateY(7.5px) rotate(45deg); }
        .dk-hamburger.open span:nth-child(2) { opacity: 0; }
        .dk-hamburger.open span:nth-child(3) { transform: translateY(-7.5px) rotate(-45deg); }

        /* ── Desktop nav ── */
        .dk-nav {
          border-top: 1px solid #F1EFE8;
          display: flex;
          align-items: center;
          padding: 0 2rem;
          overflow-x: auto;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .dk-nav::-webkit-scrollbar { display: none; }
        .dk-nav a {
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          font-size: 14px;
          color: #444441;
          text-decoration: none;
          padding: 13px 16px;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 6px;
          border-bottom: 3px solid transparent;
          margin-bottom: -3px;
          transition: color 0.2s, border-color 0.2s;
        }
        .dk-nav a:hover, .dk-nav a.active {
          color: #1D9E75;
          border-bottom-color: #1D9E75;
        }
        .dk-nav-dot {
          width: 6px;
          height: 6px;
          background: #FAC775;
          border-radius: 50%;
          display: inline-block;
          flex-shrink: 0;
          transition: background 0.2s;
        }
        .dk-nav a:hover .dk-nav-dot { background: #1D9E75; }

        /* ── Mobile nav ── */
        .dk-mobile-nav {
          display: none;
          flex-direction: column;
          border-top: 1px solid #F1EFE8;
          padding: 8px 0 16px;
          background: #fff;
        }
        .dk-mobile-nav.open { display: flex; }
        .dk-mobile-nav a {
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          font-size: 15px;
          color: #444441;
          text-decoration: none;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: background 0.15s, color 0.15s;
        }
        .dk-mobile-nav a:hover {
          background: #E1F5EE;
          color: #1D9E75;
        }
        .dk-mobile-enroll {
          margin: 12px 16px 0;
          background: #D85A30;
          color: #fff !important;
          border-radius: 999px;
          justify-content: center;
          box-shadow: 0 3px 0 #993C1D;
        }
        .dk-mobile-enroll:hover {
          background: #B84A22 !important;
          color: #fff !important;
        }

        /* ── Responsive ── */
        @media (max-width: 700px) {
          .dk-topbar { padding: 6px 1rem; }
          .dk-main-row { padding: 14px 1rem 10px; }
          .dk-nav { display: none; }
          .dk-search { display: none; }
          .dk-cta { display: none; }
          .dk-hamburger { display: flex; }
          .dk-logo-main { font-size: 20px; }
          .dk-logo-icon { width: 40px; height: 40px; border-radius: 11px; }
        }

        @media (min-width: 701px) and (max-width: 960px) {
          .dk-cta { display: none; }
          .dk-search input { width: 150px; }
          .dk-search input:focus { width: 180px; }
          .dk-nav a { padding: 13px 10px; font-size: 13px; }
        }

        @media (min-width: 701px) {
          .dk-mobile-nav { display: none !important; }
          .dk-hamburger { display: none !important; }
        }
      `}</style>

      <header className="dk-header">

        {/* Top bar */}
        <div className="dk-topbar">
          <a href="tel:08071690299">📞 08071690299</a>
          <span className="dk-topbar-divider">|</span>
          <a href="https://wa.me/2348134526190" target="_blank" rel="noopener noreferrer">💬 WhatsApp: 08134526190</a>
          <span className="dk-topbar-divider">|</span>
          <a href="mailto:delightsomekidsschool@gmail.com">📧 delightsomekidsschool@gmail.com</a>
          <span className="dk-topbar-divider">|</span>
          <Link href="/portal">Portal Login</Link>
          {LEGAL_LINKS.map((l) => (
            <React.Fragment key={l.href}>
              <span className="dk-topbar-divider">|</span>
              <Link href={l.href}>{l.label}</Link>
            </React.Fragment>
          ))}
        </div>

        {/* Main row */}
        <div className="dk-main-row">

          {/* Logo */}
          <Link href="/" className="dk-logo">
            <div className="dk-logo-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
              </svg>
            </div>
            <div>
              <span className="dk-logo-main">Delightsome<span>Kids</span></span>
              <span className="dk-logo-sub">Nurturing Young Minds</span>
            </div>
          </Link>

          {/* Search */}
          <div className="dk-search">
            <span className="dk-search-icon" aria-hidden="true">🔍</span>
            <input
              type="search"
              placeholder="Search the site…"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* CTA */}
          <Link href="/admissions" className="dk-cta">
            ➜ Enroll Now
          </Link>

          {/* Hamburger */}
          <button
            className={`dk-hamburger${menuOpen ? " open" : ""}`}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* Desktop nav */}
        <nav className="dk-nav" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              <span className="dk-nav-dot" aria-hidden="true" />
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile nav */}
        <nav
          className={`dk-mobile-nav${menuOpen ? " open" : ""}`}
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
          <Link
            href="/admissions"
            className="dk-mobile-enroll"
            onClick={() => setMenuOpen(false)}
          >
            ➜ Enroll Now
          </Link>
        </nav>

      </header>
    </>
  )
}