"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"

/* ── Intersection Observer hook for scroll-reveal ── */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

/* ── Animated counter ── */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const { ref, visible } = useReveal(0.3)
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!visible) return
    let start = 0
    const step = Math.ceil(to / 60)
    const timer = setInterval(() => {
      start += step
      if (start >= to) { setCount(to); clearInterval(timer) }
      else setCount(start)
    }, 18)
    return () => clearInterval(timer)
  }, [visible, to])
  return <span ref={ref}>{count}{suffix}</span>
}

/* ── Reveal wrapper ── */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

const WHY_CARDS = [
  { emoji: "🎓", title: "Qualified Teachers", body: "Experienced, caring educators who give every child personal attention and guide them to academic excellence." },
  { emoji: "💻", title: "Modern Learning", body: "Interactive classes, updated curriculum, digital tools, and real-world skills that prepare kids for tomorrow." },
  { emoji: "🛡️", title: "Safe Environment", body: "Secure and friendly atmosphere where every student feels supported, seen, and confident every single day." },
  { emoji: "🎨", title: "Creative Arts", body: "Music, drama, drawing and crafts woven into the school day to grow the whole child — not just the mind." },
  { emoji: "⚽", title: "Sports & Fitness", body: "Regular sporting activities that build teamwork, discipline, and a healthy body alongside a healthy mind." },
  { emoji: "🙏", title: "Moral Values", body: "Character development, respect, and integrity form the backbone of everything we teach at Delightsome Kids." },
]

const TESTIMONIALS = [
  { name: "Mrs. Adeyemi", role: "Parent of a Grade 3 student", text: "My daughter loves going to school every morning. The teachers are kind, patient, and genuinely invested in her growth. Best decision we ever made." },
  { name: "Mr. Okonkwo", role: "Parent of two students", text: "Both my sons have blossomed here — academically and socially. The school's mix of discipline and fun is exactly what children need." },
  { name: "Mrs. Fashola", role: "Parent of a Nursery student", text: "I was nervous about sending my little one to school so young, but the environment at Delightsome Kids felt warm and safe from day one." },
]

const PROGRAMMES = [
  { tag: "Ages 1–3", name: "Crèche/Reception", desc: "Warm, nurturing care and early stimulation for our youngest learners in a safe and loving space.", color: "#FAC775" },
  { tag: "Ages 3–5", name: "Learning to Read", desc: "Playful, structured learning focused on building early literacy, numbers, creativity, and social skills.", color: "#5DCAA5" },
  { tag: "Ages 5–7", name: "Pre-School", desc: "A joyful curriculum preparing children for primary school with core subjects and creative activities.", color: "#D85A30" },
  { tag: "Ages 7–11", name: "Grade School", desc: "Rigorous primary education covering core subjects, arts, and tech for confident, curious learners.", color: "#7F77DD" },
]

const GALLERY_ITEMS = [
  { emoji: "🎉", label: "Prize Giving Day 2024" },
  { emoji: "⚽", label: "Inter-House Sports" },
  { emoji: "🎭", label: "Cultural Day" },
  { emoji: "📚", label: "Reading Week" },
  { emoji: "🎨", label: "Art Exhibition" },
  { emoji: "🏆", label: "Quiz Competition" },
]

export default function HomePage() {
  /* Hero parallax */
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  /* Ticker */
  const ticker = "🌟 Excellence · Discipline · Fun · Innovation · Character · Creativity · Leadership · Joy ·"

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:ital,wght@0,400;0,600;0,700;0,800;1,700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Nunito', sans-serif;
          background: #FAFAF7;
          color: #2C2C2A;
          overflow-x: hidden;
        }

        /* ── TICKER ── */
        .dk-ticker {
          background: #1D9E75;
          padding: 8px 0;
          overflow: hidden;
          white-space: nowrap;
        }
        .dk-ticker-inner {
          display: inline-block;
          animation: ticker 30s linear infinite;
          font-weight: 700;
          font-size: 13px;
          color: #E1F5EE;
          letter-spacing: 0.05em;
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        /* ── HERO ── */
        .dk-hero {
          min-height: 100vh;
          background: linear-gradient(160deg, #0F6E56 0%, #1D9E75 40%, #085041 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 6rem 1.5rem 4rem;
          position: relative;
          overflow: hidden;
        }
        .dk-hero-blob1 {
          position: absolute; width: 600px; height: 600px;
          background: rgba(250,199,117,0.12);
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          top: -100px; right: -150px;
          animation: morph 10s ease-in-out infinite alternate;
        }
        .dk-hero-blob2 {
          position: absolute; width: 400px; height: 400px;
          background: rgba(255,255,255,0.06);
          border-radius: 30% 70% 70% 30% / 30% 52% 48% 70%;
          bottom: -80px; left: -100px;
          animation: morph 8s ease-in-out infinite alternate-reverse;
        }
        @keyframes morph {
          0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          100% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        }
        .dk-hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 999px;
          padding: 6px 18px;
          font-size: 13px; font-weight: 700; color: #fff;
          letter-spacing: 0.08em;
          margin-bottom: 2rem;
          backdrop-filter: blur(4px);
          animation: fadeDown 0.8s ease both;
        }
        .dk-hero h1 {
          font-family: 'Fredoka One', cursive;
          font-size: clamp(2.8rem, 7vw, 5.5rem);
          color: #fff;
          line-height: 1.1;
          max-width: 900px;
          margin-bottom: 1.5rem;
          animation: fadeDown 0.9s ease 0.1s both;
        }
        .dk-hero h1 em {
          font-style: normal;
          color: #FAC775;
          display: inline-block;
          animation: wobble 3s ease-in-out infinite;
        }
        @keyframes wobble {
          0%, 100% { transform: rotate(-1deg); }
          50% { transform: rotate(1.5deg); }
        }
        .dk-hero p {
          font-size: clamp(1rem, 2.5vw, 1.3rem);
          color: rgba(255,255,255,0.85);
          max-width: 600px;
          line-height: 1.7;
          margin-bottom: 2.5rem;
          animation: fadeDown 0.9s ease 0.2s both;
        }
        .dk-hero-btns {
          display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center;
          animation: fadeDown 0.9s ease 0.3s both;
        }
        .dk-btn-primary {
          background: #FAC775;
          color: #2C2C2A;
          font-family: 'Nunito', sans-serif;
          font-weight: 800;
          font-size: 16px;
          border: none;
          border-radius: 999px;
          padding: 14px 32px;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px;
          box-shadow: 0 4px 0 #BA7517;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .dk-btn-primary:hover { transform: translateY(-3px); box-shadow: 0 7px 0 #BA7517; }
        .dk-btn-primary:active { transform: translateY(1px); box-shadow: 0 1px 0 #BA7517; }
        .dk-btn-outline {
          background: transparent;
          color: #fff;
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          font-size: 16px;
          border: 2px solid rgba(255,255,255,0.5);
          border-radius: 999px;
          padding: 13px 32px;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px;
          transition: background 0.2s, border-color 0.2s;
        }
        .dk-btn-outline:hover { background: rgba(255,255,255,0.1); border-color: #fff; }
        .dk-hero-scroll {
          position: absolute; bottom: 2rem;
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          color: rgba(255,255,255,0.5);
          font-size: 12px; font-weight: 600; letter-spacing: 0.1em;
          animation: bounce 2s ease-in-out infinite;
        }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)} }
        .dk-hero-scroll svg { width: 24px; height: 24px; stroke: rgba(255,255,255,0.4); fill: none; stroke-width: 2; }

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── STATS ── */
        .dk-stats {
          background: #fff;
          padding: 4rem 1.5rem;
        }
        .dk-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 2rem;
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
        }
        .dk-stat-num {
          font-family: 'Fredoka One', cursive;
          font-size: 3.5rem;
          color: #1D9E75;
          line-height: 1;
          display: block;
        }
        .dk-stat-label {
          font-size: 14px;
          font-weight: 700;
          color: #888780;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 6px;
          display: block;
        }

        /* ── MOTTO ── */
        .dk-motto {
          background: #FAC775;
          padding: 5rem 1.5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .dk-motto::before {
          content: '"';
          position: absolute;
          font-family: 'Fredoka One', cursive;
          font-size: 400px;
          color: rgba(0,0,0,0.04);
          top: -80px; left: 20px;
          line-height: 1;
          pointer-events: none;
          user-select: none;
        }
        .dk-motto-tag {
          font-size: 12px; font-weight: 800;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #BA7517;
          margin-bottom: 1rem;
        }
        .dk-motto blockquote {
          font-family: 'Fredoka One', cursive;
          font-size: clamp(1.6rem, 4vw, 3rem);
          color: #2C2C2A;
          max-width: 800px;
          margin: 0 auto 1.5rem;
          line-height: 1.3;
        }
        .dk-motto-sub {
          font-size: 16px;
          color: #5F5E5A;
          font-style: italic;
        }

        /* ── SECTION SHARED ── */
        .dk-section {
          padding: 5rem 1.5rem;
        }
        .dk-section-alt { background: #F1EFE8; }
        .dk-container { max-width: 1100px; margin: 0 auto; }
        .dk-section-label {
          font-size: 12px; font-weight: 800;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #1D9E75;
          margin-bottom: 0.75rem;
        }
        .dk-section-title {
          font-family: 'Fredoka One', cursive;
          font-size: clamp(2rem, 5vw, 3.2rem);
          color: #2C2C2A;
          line-height: 1.15;
          margin-bottom: 1rem;
        }
        .dk-section-title span { color: #D85A30; }
        .dk-section-body {
          font-size: 17px;
          color: #5F5E5A;
          max-width: 580px;
          line-height: 1.8;
          margin-bottom: 3rem;
        }

        /* ── WHY CARDS ── */
        .dk-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .dk-card {
          background: #fff;
          border-radius: 20px;
          padding: 2rem;
          border: 1.5px solid #E8E6DE;
          transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
          cursor: default;
        }
        .dk-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(29,158,117,0.12);
          border-color: #1D9E75;
        }
        .dk-card-emoji {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 1rem;
        }
        .dk-card h3 {
          font-family: 'Fredoka One', cursive;
          font-size: 1.3rem;
          color: #2C2C2A;
          margin-bottom: 0.5rem;
        }
        .dk-card p {
          font-size: 15px;
          color: #5F5E5A;
          line-height: 1.7;
        }

        /* ── PROGRAMMES ── */
        .dk-programmes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }
        .dk-prog-card {
          border-radius: 20px;
          padding: 2.5rem 2rem;
          position: relative;
          overflow: hidden;
          transition: transform 0.25s;
        }
        .dk-prog-card:hover { transform: translateY(-6px) rotate(-1deg); }
        .dk-prog-tag {
          font-size: 11px; font-weight: 800;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(0,0,0,0.4);
          display: inline-block;
          background: rgba(0,0,0,0.07);
          padding: 4px 12px;
          border-radius: 999px;
          margin-bottom: 1.2rem;
        }
        .dk-prog-name {
          font-family: 'Fredoka One', cursive;
          font-size: 1.6rem;
          color: #2C2C2A;
          margin-bottom: 0.75rem;
        }
        .dk-prog-desc {
          font-size: 14px;
          color: #444441;
          line-height: 1.7;
        }
        .dk-prog-deco {
          position: absolute;
          bottom: -20px; right: -20px;
          font-size: 5rem;
          opacity: 0.15;
          pointer-events: none;
          user-select: none;
        }

        /* ── TESTIMONIALS ── */
        .dk-testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .dk-testi {
          background: #fff;
          border-radius: 20px;
          padding: 2rem;
          border: 1.5px solid #E8E6DE;
          position: relative;
        }
        .dk-testi::before {
          content: '"';
          font-family: 'Fredoka One', cursive;
          font-size: 5rem;
          color: #E1F5EE;
          position: absolute;
          top: -10px; left: 16px;
          line-height: 1;
          pointer-events: none;
        }
        .dk-testi p {
          font-size: 15px;
          color: #444441;
          line-height: 1.75;
          margin-bottom: 1.5rem;
          font-style: italic;
        }
        .dk-testi-author {
          display: flex; align-items: center; gap: 12px;
        }
        .dk-testi-avatar {
          width: 44px; height: 44px;
          border-radius: 50%;
          background: #E1F5EE;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.3rem;
          flex-shrink: 0;
        }
        .dk-testi-name {
          font-weight: 800;
          font-size: 14px;
          color: #2C2C2A;
          display: block;
        }
        .dk-testi-role {
          font-size: 12px;
          color: #888780;
          display: block;
        }
        .dk-stars { color: #FAC775; font-size: 14px; margin-bottom: 0.75rem; }

        /* ── GALLERY ── */
        .dk-gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }
        .dk-gallery-item {
          background: #fff;
          border-radius: 16px;
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: 1.5px solid #E8E6DE;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          text-decoration: none;
        }
        .dk-gallery-item:hover {
          transform: scale(1.04) rotate(1.5deg);
          box-shadow: 0 12px 30px rgba(0,0,0,0.1);
        }
        .dk-gallery-emoji { font-size: 2.8rem; }
        .dk-gallery-label {
          font-size: 12px; font-weight: 700;
          color: #5F5E5A;
          text-align: center;
          padding: 0 8px;
        }

        /* ── CTA BAND ── */
        .dk-cta-band {
          background: linear-gradient(135deg, #D85A30 0%, #993C1D 100%);
          padding: 5rem 1.5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .dk-cta-band::before {
          content: '🎓';
          position: absolute;
          font-size: 20rem;
          opacity: 0.06;
          top: -3rem; right: -3rem;
          pointer-events: none;
          user-select: none;
        }
        .dk-cta-band h2 {
          font-family: 'Fredoka One', cursive;
          font-size: clamp(2rem, 5vw, 3.5rem);
          color: #fff;
          margin-bottom: 1rem;
          position: relative;
        }
        .dk-cta-band p {
          font-size: 18px;
          color: rgba(255,255,255,0.8);
          max-width: 500px;
          margin: 0 auto 2.5rem;
          position: relative;
          line-height: 1.7;
        }

        /* ── CONTACT STRIP ── */
        .dk-contact-strip {
          background: #2C2C2A;
          padding: 4rem 1.5rem;
        }
        .dk-contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
        }
        .dk-contact-item h4 {
          font-family: 'Fredoka One', cursive;
          font-size: 1.2rem;
          color: #FAC775;
          margin-bottom: 0.5rem;
        }
        .dk-contact-item p {
          font-size: 14px;
          color: #B4B2A9;
          line-height: 1.6;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 600px) {
          .dk-hero { padding: 5rem 1rem 3rem; }
          .dk-hero-blob1, .dk-hero-blob2 { display: none; }
          .dk-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .dk-section { padding: 3.5rem 1rem; }
        }
      `}</style>

      <main>

        {/* ── TICKER ── */}
        <div className="dk-ticker" aria-hidden="true">
          <div className="dk-ticker-inner">
            {`${ticker} `.repeat(6)}
          </div>
        </div>

        {/* ── HERO ── */}
        <section className="dk-hero" style={{ backgroundPositionY: scrollY * 0.4 }}>
          <div className="dk-hero-blob1" />
          <div className="dk-hero-blob2" />

          <div className="dk-hero-badge">
            🌟 Itori, Ogun State &nbsp;·&nbsp; Est. 2018
          </div>

          <h1>
            Welcome to <em>Delightsome</em><br />Kids School
          </h1>

          <p>
            Where Young Minds Grow With Excellence, Discipline & Pure, Unbridled Fun — every single day.
          </p>

          <div className="dk-hero-btns">
            <Link href="/admissions" className="dk-btn-primary">
              🎒 Enroll Now
            </Link>
            <Link href="/about" className="dk-btn-outline">
              Learn More →
            </Link>
          </div>

          <div className="dk-hero-scroll" aria-hidden="true">
            <span>SCROLL</span>
            <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="dk-stats">
          <div className="dk-stats-grid">
            {[
              { to: 300, suffix: "+", label: "Happy Students" },
              { to: 20, suffix: "+", label: "Qualified Teachers" },
              { to: 8, suffix: "", label: "Years of Excellence" },
              { to: 98, suffix: "%", label: "Parent Satisfaction" },
            ].map((s) => (
              <Reveal key={s.label}>
                <span className="dk-stat-num">
                  <Counter to={s.to} suffix={s.suffix} />
                </span>
                <span className="dk-stat-label">{s.label}</span>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── MOTTO ── */}
        <section className="dk-motto">
          <Reveal>
            <p className="dk-motto-tag">Our Guiding Motto</p>
            <blockquote>
              "Raising Future Leaders with Knowledge, Morals, and Creativity"
            </blockquote>
            <p className="dk-motto-sub">— The Delightsome Kids Promise</p>
          </Reveal>
        </section>

        {/* ── WHY CHOOSE US ── */}
        <section className="dk-section">
          <div className="dk-container">
            <Reveal>
              <p className="dk-section-label">Why Choose Us</p>
              <h2 className="dk-section-title">Everything a child <span>needs to thrive</span></h2>
              <p className="dk-section-body">
                We combine academic rigour with warmth, creativity, and a whole lot of laughter to raise children who are confident, curious, and kind.
              </p>
            </Reveal>
            <div className="dk-cards-grid">
              {WHY_CARDS.map((card, i) => (
                <Reveal key={card.title} delay={i * 80}>
                  <div className="dk-card">
                    <span className="dk-card-emoji">{card.emoji}</span>
                    <h3>{card.title}</h3>
                    <p>{card.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROGRAMMES ── */}
        <section className="dk-section dk-section-alt">
          <div className="dk-container">
            <Reveal>
              <p className="dk-section-label">Our Programmes</p>
              <h2 className="dk-section-title">A place for <span>every age</span></h2>
              <p className="dk-section-body">
                From crèche all the way through primary school, we've built each programme to meet your child exactly where they are.
              </p>
            </Reveal>
            <div className="dk-programmes-grid">
              {PROGRAMMES.map((p, i) => (
                <Reveal key={p.name} delay={i * 80}>
                  <div className="dk-prog-card" style={{ background: p.color + "33", border: `2px solid ${p.color}` }}>
                    <span className="dk-prog-tag">{p.tag}</span>
                    <div className="dk-prog-name">{p.name}</div>
                    <p className="dk-prog-desc">{p.desc}</p>
                    <span className="dk-prog-deco">
                      {p.name === "Crèche" ? "👶" : p.name === "Nursery" ? "🌱" : p.name === "Primary School" ? "📚" : "⭐"}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="dk-section">
          <div className="dk-container">
            <Reveal>
              <p className="dk-section-label">What Parents Say</p>
              <h2 className="dk-section-title">Families <span>love us</span></h2>
            </Reveal>
            <div className="dk-testimonials-grid">
              {TESTIMONIALS.map((t, i) => (
                <Reveal key={t.name} delay={i * 100}>
                  <div className="dk-testi">
                    <div className="dk-stars">★★★★★</div>
                    <p>"{t.text}"</p>
                    <div className="dk-testi-author">
                      <div className="dk-testi-avatar">👩</div>
                      <div>
                        <span className="dk-testi-name">{t.name}</span>
                        <span className="dk-testi-role">{t.role}</span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── GALLERY ── */}
        <section className="dk-section dk-section-alt">
          <div className="dk-container">
            <Reveal>
              <p className="dk-section-label">School Life</p>
              <h2 className="dk-section-title">Moments that <span>matter</span></h2>
              <p className="dk-section-body">
                From sports days to art exhibitions, life at Delightsome Kids is rich, colourful, and always full of smiles.
              </p>
            </Reveal>
            <div className="dk-gallery-grid">
              {GALLERY_ITEMS.map((item, i) => (
                <Reveal key={item.label} delay={i * 60}>
                  <Link href="/gallery" className="dk-gallery-item">
                    <span className="dk-gallery-emoji">{item.emoji}</span>
                    <span className="dk-gallery-label">{item.label}</span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BAND ── */}
        <section className="dk-cta-band">
          <Reveal>
            <h2>Ready to join the family?</h2>
            <p>Admission is open for the new school year. Spaces fill up fast — secure your child's spot today.</p>
            <Link href="/admissions" className="dk-btn-primary" style={{ fontSize: "18px", padding: "16px 40px" }}>
              🎒 Apply for Admission
            </Link>
          </Reveal>
        </section>

        {/* ── CONTACT STRIP ── */}
        <section className="dk-contact-strip">
          <div className="dk-contact-grid">
            <Reveal delay={0}>
              <div className="dk-contact-item">
                <h4>📍 Find Us</h4>
                <p>Delightsome Kids School<br />Itori, Ewekoro LGA<br />Ogun State, Nigeria</p>
              </div>
            </Reveal>
            <Reveal delay={80}>
                  <div className="dk-contact-item">
                    <h4>📞 Call Us</h4>
                    <p>08071690299<br />08071690959<br />Mon – Fri, 8am – 4pm</p>
                  </div>
                </Reveal>
                <Reveal delay={160}>
                  <div className="dk-contact-item">
                    <h4>📧 Email Us</h4>
                    <p>delightsomekidsschool@gmail.com</p>
                  </div>
                </Reveal>
            <Reveal delay={240}>
              <div className="dk-contact-item">
                <h4>🕐 School Hours</h4>
                <p>Mon – Fri: 8:00am – 3:00pm<br />After-school club till 5pm</p>
              </div>
            </Reveal>
          </div>
        </section>

      </main>
    </>
  )
}