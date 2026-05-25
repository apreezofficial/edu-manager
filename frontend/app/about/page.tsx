"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"

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

function Reveal({ children, delay = 0, className = "", style = {} }: { children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties }) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(36px)", transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`, ...style }}>
      {children}
    </div>
  )
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const { ref, visible } = useReveal(0.3)
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!visible) return
    let n = 0; const step = Math.ceil(to / 55)
    const t = setInterval(() => { n += step; if (n >= to) { setCount(to); clearInterval(t) } else setCount(n) }, 20)
    return () => clearInterval(t)
  }, [visible, to])
  return <span ref={ref}>{count}{suffix}</span>
}

const VALUES = [
  { emoji: "🏅", label: "Discipline" },
  { emoji: "🤝", label: "Integrity" },
  { emoji: "⭐", label: "Excellence" },
  { emoji: "🎨", label: "Creativity" },
  { emoji: "👑", label: "Leadership" },
  { emoji: "💪", label: "Responsibility" },
]

const TEAM = [
  { emoji: "👩‍🏫", name: "Mrs. B. Adeyemi", role: "Principal", bio: "Over 20 years in education. Passionate about holistic child development and academic excellence." },
  { emoji: "👨‍🏫", name: "Mr. K. Okonkwo", role: "Head of Academics", bio: "A curriculum specialist with a talent for making learning exciting and relevant for every child." },
  { emoji: "👩‍🎨", name: "Ms. T. Fashola", role: "Creative Arts Lead", bio: "Award-winning art educator who believes every child has a unique creative voice worth nurturing." },
  { emoji: "👨‍💻", name: "Mr. S. Bello", role: "ICT Coordinator", bio: "Brings technology and digital literacy into every classroom in age-appropriate, engaging ways." },
]

const TIMELINE = [
  { year: "2010", title: "Founded", desc: "Delightsome Kids School opens its doors in Itori with 40 pioneer students." },
  { year: "2013", title: "First Graduating Class", desc: "Our pioneer students complete primary school with outstanding FSLC results." },
  { year: "2016", title: "New Campus", desc: "We move into our modern, purpose-built campus with science lab and computer room." },
  { year: "2020", title: "Award of Excellence", desc: "Recognised by Ogun State government for outstanding academic performance." },
  { year: "2024", title: "500+ Students", desc: "A thriving community of over 500 students, 30 staff, and thousands of proud alumni." },
]

const FACILITIES = [
  { emoji: "🖥️", name: "ICT Lab", desc: "Modern computers and internet access for digital literacy." },
  { emoji: "🔬", name: "Science Lab", desc: "Hands-on experiments that bring science to life." },
  { emoji: "📚", name: "Library", desc: "Thousands of books and a cozy reading space." },
  { emoji: "⚽", name: "Sports Field", desc: "Full-size field for football, athletics, and games." },
  { emoji: "🎭", name: "Assembly Hall", desc: "A large hall for events, drama, and celebrations." },
  { emoji: "🍽️", name: "Canteen", desc: "Nutritious meals prepared fresh every school day." },
]

export default function AboutPage() {
  const [activeYear, setActiveYear] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const h = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", h, { passive: true })
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:ital,wght@0,400;0,600;0,700;0,800;1,700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Nunito', sans-serif; background: #FAFAF7; color: #2C2C2A; overflow-x: hidden; }

        /* ── HERO ── */
        .ab-hero {
          min-height: 60vh;
          background: linear-gradient(150deg, #085041 0%, #1D9E75 55%, #5DCAA5 100%);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; padding: 7rem 1.5rem 5rem; position: relative; overflow: hidden;
        }
        .ab-hero-ring {
          position: absolute; border-radius: 50%; border: 2px solid rgba(255,255,255,0.08);
          animation: spin 20s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .ab-hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3);
          border-radius: 999px; padding: 6px 20px; font-size: 13px; font-weight: 700;
          color: #fff; letter-spacing: 0.08em; margin-bottom: 1.5rem;
          backdrop-filter: blur(6px); animation: fadeDown 0.8s ease both;
        }
        .ab-hero h1 {
          font-family: 'Fredoka One', cursive;
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          color: #fff; line-height: 1.1; max-width: 800px; margin-bottom: 1.25rem;
          animation: fadeDown 0.9s ease 0.1s both;
        }
        .ab-hero h1 em { font-style: normal; color: #FAC775; }
        .ab-hero p {
          font-size: clamp(1rem, 2vw, 1.2rem); color: rgba(255,255,255,0.82);
          max-width: 560px; line-height: 1.75; animation: fadeDown 0.9s ease 0.2s both;
        }
        .ab-hero-scroll {
          position: absolute; bottom: 1.8rem;
          display: flex; flex-direction: column; align-items: center; gap: 5px;
          color: rgba(255,255,255,0.4); font-size: 11px; font-weight: 700; letter-spacing: 0.12em;
          animation: bounce 2s ease-in-out infinite;
        }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(7px)} }
        @keyframes fadeDown { from{opacity:0;transform:translateY(-22px)} to{opacity:1;transform:translateY(0)} }

        /* ── SHARED ── */
        .ab-section { padding: 5rem 1.5rem; }
        .ab-section-alt { background: #F1EFE8; }
        .ab-section-dark { background: #2C2C2A; }
        .ab-container { max-width: 1100px; margin: 0 auto; }
        .ab-label { font-size: 12px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; color: #1D9E75; margin-bottom: 0.6rem; }
        .ab-title { font-family: 'Fredoka One', cursive; font-size: clamp(1.9rem, 4.5vw, 3rem); color: #2C2C2A; line-height: 1.15; margin-bottom: 1rem; }
        .ab-title span { color: #D85A30; }
        .ab-title-light { color: #fff; }
        .ab-body { font-size: 17px; color: #5F5E5A; line-height: 1.8; max-width: 620px; margin-bottom: 2.5rem; }
        .ab-body-light { color: rgba(255,255,255,0.75); }

        /* ── MISSION CARDS ── */
        .ab-mission-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; }
        .ab-mission-card {
          border-radius: 20px; padding: 2.2rem 2rem; position: relative; overflow: hidden;
          transition: transform 0.25s, box-shadow 0.25s; cursor: default;
        }
        .ab-mission-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(0,0,0,0.1); }
        .ab-mission-card h3 { font-family: 'Fredoka One', cursive; font-size: 1.4rem; margin-bottom: 0.6rem; }
        .ab-mission-card p { font-size: 15px; line-height: 1.7; }
        .ab-mission-deco { position: absolute; bottom: -16px; right: -10px; font-size: 5rem; opacity: 0.13; pointer-events: none; user-select: none; }

        /* ── VALUES PILLS ── */
        .ab-values-wrap { display: flex; flex-wrap: wrap; gap: 1rem; }
        .ab-value-pill {
          display: inline-flex; align-items: center; gap: 10px;
          background: #fff; border: 2px solid #E8E6DE;
          border-radius: 999px; padding: 10px 22px;
          font-weight: 800; font-size: 15px; color: #2C2C2A;
          transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
          cursor: default;
        }
        .ab-value-pill:hover { transform: scale(1.07) rotate(-2deg); border-color: #1D9E75; box-shadow: 0 8px 24px rgba(29,158,117,0.15); }
        .ab-value-pill span:first-child { font-size: 1.4rem; }

        /* ── PRINCIPAL SPLIT ── */
        .ab-split { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
        @media(max-width:700px){ .ab-split { grid-template-columns: 1fr; gap: 2rem; } }
        .ab-principal-img {
          border-radius: 24px; overflow: hidden; position: relative;
          box-shadow: 12px 12px 0 #FAC775;
        }
        .ab-principal-img img { width: 100%; height: 420px; object-fit: cover; display: block; }
        .ab-principal-badge {
          position: absolute; bottom: 1.5rem; left: 1.5rem;
          background: #fff; border-radius: 14px; padding: 12px 18px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }
        .ab-principal-badge strong { display: block; font-size: 15px; font-weight: 800; color: #2C2C2A; }
        .ab-principal-badge span { font-size: 13px; color: #1D9E75; font-weight: 700; }
        .ab-quote-mark { font-family: 'Fredoka One', cursive; font-size: 5rem; color: #E1F5EE; line-height: 1; margin-bottom: -1.5rem; display: block; }
        .ab-quote-text { font-size: 18px; color: #444441; line-height: 1.8; font-style: italic; margin-bottom: 1.5rem; }
        .ab-sig { font-family: 'Fredoka One', cursive; font-size: 1.4rem; color: #1D9E75; }
        .ab-sig-role { font-size: 13px; color: #888780; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }

        /* ── TIMELINE ── */
        .ab-timeline { position: relative; max-width: 700px; margin: 0 auto; }
        .ab-timeline::before {
          content: ''; position: absolute; left: 20px; top: 0; bottom: 0;
          width: 3px; background: linear-gradient(to bottom, #1D9E75, #FAC775, #D85A30);
          border-radius: 2px;
        }
        .ab-tl-item {
          display: flex; gap: 2rem; padding: 0 0 2.5rem 0;
          cursor: pointer; transition: opacity 0.2s;
        }
        .ab-tl-dot {
          width: 42px; height: 42px; border-radius: 50%;
          background: #fff; border: 3px solid #1D9E75;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Fredoka One', cursive; font-size: 11px; color: #1D9E75;
          flex-shrink: 0; position: relative; z-index: 1;
          transition: background 0.2s, color 0.2s;
        }
        .ab-tl-dot.active { background: #1D9E75; color: #fff; border-color: #0F6E56; }
        .ab-tl-content { padding-top: 8px; }
        .ab-tl-year { font-size: 11px; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; color: #1D9E75; margin-bottom: 4px; }
        .ab-tl-title { font-family: 'Fredoka One', cursive; font-size: 1.2rem; color: #2C2C2A; margin-bottom: 4px; }
        .ab-tl-desc { font-size: 14px; color: #5F5E5A; line-height: 1.65; }

        /* ── STATS BAND ── */
        .ab-stats-band {
          background: linear-gradient(135deg, #1D9E75 0%, #085041 100%);
          padding: 4rem 1.5rem;
        }
        .ab-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 2rem; max-width: 900px; margin: 0 auto; text-align: center; }
        .ab-stat-num { font-family: 'Fredoka One', cursive; font-size: 3.2rem; color: #FAC775; display: block; line-height: 1; }
        .ab-stat-label { font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 6px; display: block; }

        /* ── TEAM ── */
        .ab-team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1.5rem; }
        .ab-team-card {
          background: #fff; border-radius: 20px; padding: 2rem;
          border: 1.5px solid #E8E6DE; text-align: center;
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .ab-team-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(29,158,117,0.12); }
        .ab-team-avatar {
          width: 72px; height: 72px; border-radius: 50%;
          background: #E1F5EE; font-size: 2.2rem;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1rem; border: 3px solid #5DCAA5;
        }
        .ab-team-name { font-family: 'Fredoka One', cursive; font-size: 1.1rem; color: #2C2C2A; margin-bottom: 4px; }
        .ab-team-role { font-size: 12px; font-weight: 800; color: #1D9E75; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.75rem; }
        .ab-team-bio { font-size: 14px; color: #5F5E5A; line-height: 1.65; }

        /* ── FACILITIES ── */
        .ab-fac-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; }
        .ab-fac-card {
          background: #fff; border-radius: 16px; padding: 1.75rem 1.5rem;
          border: 1.5px solid #E8E6DE; text-align: center;
          transition: transform 0.2s, border-color 0.2s;
        }
        .ab-fac-card:hover { transform: scale(1.05) rotate(-1deg); border-color: #FAC775; }
        .ab-fac-emoji { font-size: 2.4rem; display: block; margin-bottom: 0.75rem; }
        .ab-fac-name { font-family: 'Fredoka One', cursive; font-size: 1rem; color: #2C2C2A; margin-bottom: 4px; }
        .ab-fac-desc { font-size: 13px; color: #888780; line-height: 1.5; }

        /* ── CTA ── */
        .ab-cta-band {
          background: #FAC775; padding: 5rem 1.5rem; text-align: center; position: relative; overflow: hidden;
        }
        .ab-cta-band::before { content: '🌟'; position: absolute; font-size: 18rem; opacity: 0.08; top: -3rem; right: -3rem; pointer-events: none; user-select: none; }
        .ab-cta-band h2 { font-family: 'Fredoka One', cursive; font-size: clamp(2rem, 5vw, 3.2rem); color: #2C2C2A; margin-bottom: 1rem; position: relative; }
        .ab-cta-band p { font-size: 17px; color: #5F5E5A; max-width: 480px; margin: 0 auto 2.5rem; line-height: 1.7; position: relative; }
        .ab-btn {
          background: #1D9E75; color: #fff;
          font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 16px;
          border: none; border-radius: 999px; padding: 14px 36px;
          text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
          box-shadow: 0 4px 0 #0F6E56; transition: transform 0.15s, box-shadow 0.15s;
        }
        .ab-btn:hover { transform: translateY(-3px); box-shadow: 0 7px 0 #0F6E56; }
        .ab-btn:active { transform: translateY(1px); box-shadow: 0 1px 0 #0F6E56; }

        @media(max-width:600px){
          .ab-hero { padding: 5rem 1rem 3.5rem; }
          .ab-section { padding: 3.5rem 1rem; }
          .ab-timeline::before { left: 16px; }
        }
      `}</style>

      <main>

        {/* ── HERO ── */}
        <section className="ab-hero">
          {[200,350,500].map((s,i) => (
            <div key={i} className="ab-hero-ring" style={{ width: s, height: s, top: `calc(50% - ${s/2}px)`, left: `calc(50% - ${s/2}px)`, animationDuration: `${18+i*5}s`, animationDirection: i%2===0?"normal":"reverse" }} />
          ))}
          <div className="ab-hero-badge">🏫 Est. 2010 · Itori, Ogun State</div>
          <h1>About <em>Delightsome</em><br />Kids School</h1>
          <p>A forward-thinking school dedicated to academic excellence, discipline, and the whole-child development of every student.</p>
          <div className="ab-hero-scroll" aria-hidden="true">
            <span>SCROLL</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
          </div>
        </section>

        {/* ── MISSION / VISION / VALUES ── */}
        <section className="ab-section">
          <div className="ab-container">
            <Reveal>
              <p className="ab-label">Who We Are</p>
              <h2 className="ab-title">Built on a <span>strong foundation</span></h2>
              <p className="ab-body">Delightsome Kids School is an institution that puts children first — their minds, their characters, and their futures. Every decision we make starts with one question: what's best for the child?</p>
            </Reveal>
            <div className="ab-mission-grid">
              {[
                { emoji:"🎯", title:"Our Mission", body:"To deliver quality education that prepares students intellectually, morally, and socially for the challenges and opportunities of the future.", bg:"#E1F5EE", col:"#085041" },
                { emoji:"🔭", title:"Our Vision", body:"To become the leading centre of excellence in Ogun State — known for outstanding results, values-based leadership, and joyful learning.", bg:"#FAEEDA", col:"#633806" },
                { emoji:"💎", title:"Our Core Values", body:"Discipline · Integrity · Excellence · Creativity · Leadership · Responsibility. These aren't just words — they're how we live every school day.", bg:"#FAECE7", col:"#4A1B0C" },
              ].map((c, i) => (
                <Reveal key={c.title} delay={i * 90}>
                  <div className="ab-mission-card" style={{ background: c.bg }}>
                    <div style={{ fontSize:"2.4rem", marginBottom:"1rem" }}>{c.emoji}</div>
                    <h3 style={{ color: c.col }}>{c.title}</h3>
                    <p style={{ color: c.col, opacity: 0.8 }}>{c.body}</p>
                    <span className="ab-mission-deco">{c.emoji}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CORE VALUES PILLS ── */}
        <section className="ab-section ab-section-alt">
          <div className="ab-container">
            <Reveal>
              <p className="ab-label">Our Values in Action</p>
              <h2 className="ab-title">What we <span>stand for</span></h2>
              <p className="ab-body">Every policy, lesson, and interaction at Delightsome Kids is guided by six core values that shape who our students become.</p>
            </Reveal>
            <div className="ab-values-wrap">
              {VALUES.map((v, i) => (
                <Reveal key={v.label} delay={i * 60}>
                  <div className="ab-value-pill">
                    <span>{v.emoji}</span>
                    <span>{v.label}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRINCIPAL MESSAGE ── */}
        <section className="ab-section">
          <div className="ab-container">
            <div className="ab-split">
              <Reveal>
                <div className="ab-principal-img">
                  <img src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=600&q=80" alt="Principal of Delightsome Kids School" />
                  <div className="ab-principal-badge">
                    <strong>Mrs. B. Adeyemi</strong>
                    <span>School Principal</span>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={120}>
                <p className="ab-label">From the Principal's Desk</p>
                <h2 className="ab-title">A personal <span>welcome</span></h2>
                <span className="ab-quote-mark">"</span>
                <p className="ab-quote-text">
                  Welcome to Delightsome Kids. Every morning our gates open, I see the future walking in. We are committed to nurturing confident, responsible students who will positively impact society. Our experienced teachers, modern facilities, and warm culture ensure every child receives an education that is both rigorous and joyful.
                </p>
                <p className="ab-sig">Mrs. B. Adeyemi</p>
                <p className="ab-sig-role">B.Ed, M.Ed — Principal, Delightsome Kids School</p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── TIMELINE ── */}
        <section className="ab-section ab-section-alt">
          <div className="ab-container">
            <Reveal style={{ marginBottom: "3rem" }}>
              <p className="ab-label">Our Story</p>
              <h2 className="ab-title">14 years of <span>growing together</span></h2>
            </Reveal>
            <div className="ab-timeline">
              {TIMELINE.map((item, i) => (
                <Reveal key={item.year} delay={i * 80}>
                  <div className="ab-tl-item" onClick={() => setActiveYear(i)}>
                    <div className={`ab-tl-dot${activeYear === i ? " active" : ""}`}>{item.year.slice(2)}</div>
                    <div className="ab-tl-content">
                      <p className="ab-tl-year">{item.year}</p>
                      <p className="ab-tl-title">{item.title}</p>
                      <p className="ab-tl-desc">{item.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── STATS BAND ── */}
        <section className="ab-stats-band">
          <div className="ab-stats-grid">
            {[
              { to: 500, suffix: "+", label: "Happy Students" },
              { to: 30, suffix: "+", label: "Expert Teachers" },
              { to: 14, suffix: "", label: "Years of Excellence" },
              { to: 6, suffix: "", label: "Facilities on Campus" },
            ].map((s) => (
              <Reveal key={s.label}>
                <span className="ab-stat-num"><Counter to={s.to} suffix={s.suffix} /></span>
                <span className="ab-stat-label">{s.label}</span>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── TEAM ── */}
        <section className="ab-section">
          <div className="ab-container">
            <Reveal>
              <p className="ab-label">Meet Our Team</p>
              <h2 className="ab-title">The people behind <span>the magic</span></h2>
              <p className="ab-body">Our educators are qualified, caring, and deeply invested in every student's success.</p>
            </Reveal>
            <div className="ab-team-grid">
              {TEAM.map((m, i) => (
                <Reveal key={m.name} delay={i * 80}>
                  <div className="ab-team-card">
                    <div className="ab-team-avatar">{m.emoji}</div>
                    <p className="ab-team-name">{m.name}</p>
                    <p className="ab-team-role">{m.role}</p>
                    <p className="ab-team-bio">{m.bio}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── FACILITIES ── */}
        <section className="ab-section ab-section-alt">
          <div className="ab-container">
            <Reveal>
              <p className="ab-label">Our Campus</p>
              <h2 className="ab-title">World-class facilities, <span>Itori-style</span></h2>
              <p className="ab-body">Our purpose-built campus gives every student the tools and space they need to learn, explore, and grow.</p>
            </Reveal>
            <div className="ab-fac-grid">
              {FACILITIES.map((f, i) => (
                <Reveal key={f.name} delay={i * 60}>
                  <div className="ab-fac-card">
                    <span className="ab-fac-emoji">{f.emoji}</span>
                    <p className="ab-fac-name">{f.name}</p>
                    <p className="ab-fac-desc">{f.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="ab-cta-band">
          <Reveal>
            <h2>Come see it for yourself 👀</h2>
            <p>Schedule a visit and let your child experience a day at Delightsome Kids. We'd love to welcome your family.</p>
            <div style={{ display:"flex", gap:"1rem", justifyContent:"center", flexWrap:"wrap" }}>
              <Link href="/admissions" className="ab-btn">🎒 Apply Now</Link>
              <Link href="/legal/contact" className="ab-btn" style={{ background:"#2C2C2A", boxShadow:"0 4px 0 #000" }}>📞 Book a Visit</Link>
            </div>
          </Reveal>
        </section>

      </main>
    </>
  )
}