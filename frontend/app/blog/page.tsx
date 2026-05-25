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
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(36px)", transition: `opacity 0.72s ease ${delay}ms, transform 0.72s ease ${delay}ms`, ...style }}>
      {children}
    </div>
  )
}

const POSTS = [
  {
    tag: "📢 Announcement", date: "Jan 15, 2026", color: "#E1F5EE", tagColor: "#085041",
    title: "Admission Now Open for 2026/2027 Session",
    excerpt: "We are now accepting applications for Crèche, Nursery, and Primary School. Apply early — spaces fill up extremely fast every year.",
    emoji: "🎒", readTime: "2 min read",
  },
  {
    tag: "🏆 Event", date: "Feb 5, 2026", color: "#FAEEDA", tagColor: "#633806",
    title: "Inter-House Sports Day 2026 — A Day to Remember!",
    excerpt: "Our annual sports competition brought excitement, heart-stopping races, and incredible teamwork. Congratulations to all winners and every participant.",
    emoji: "⚽", readTime: "3 min read",
  },
  {
    tag: "🎓 Academic", date: "Mar 10, 2026", color: "#FAECE7", tagColor: "#4A1B0C",
    title: "First Term Results — Outstanding Performance Across All Classes",
    excerpt: "We are incredibly proud of our students' first-term results. Average scores across all classes hit a new school record of 87%.",
    emoji: "📊", readTime: "4 min read",
  },
  {
    tag: "🎨 Creative", date: "Mar 22, 2026", color: "#EAF3DE", tagColor: "#173404",
    title: "Annual Art Exhibition — Young Artists Shine Bright",
    excerpt: "Over 200 pieces of art were displayed at our end-of-term exhibition. Parents, teachers, and guests were blown away by the talent on show.",
    emoji: "🖼️", readTime: "3 min read",
  },
  {
    tag: "📖 Learning", date: "Apr 3, 2026", color: "#E6F1FB", tagColor: "#042C53",
    title: "Reading Week Wraps Up — 1,000 Books Read by Our Students!",
    excerpt: "Our school-wide reading challenge was a massive success. Students from Nursery all the way to Primary 6 collectively read over 1,000 books.",
    emoji: "📚", readTime: "3 min read",
  },
  {
    tag: "🌍 Community", date: "Apr 18, 2026", color: "#FBE6F0", tagColor: "#4B1528",
    title: "Delightsome Kids Gives Back — Community Clean-Up Drive",
    excerpt: "Our students and staff joined hands with Itori residents for a community clean-up. Character development in action — we are incredibly proud.",
    emoji: "🤝", readTime: "2 min read",
  },
]

const PINNED = [
  { emoji: "📌", title: "2026 Academic Calendar", desc: "Full breakdown of term dates, holidays, and exam periods.", date: "Jan 2, 2026" },
  { emoji: "🎒", title: "New Student Checklist", desc: "Everything a new family needs to know before resumption.", date: "Jan 5, 2026" },
  { emoji: "📋", title: "Uniform Policy Update", desc: "Updated uniform guidelines effective from Second Term 2026.", date: "Jan 8, 2026" },
]

const CATEGORIES = [
  { emoji: "📢", label: "Announcements", count: 12 },
  { emoji: "🏆", label: "Events", count: 8 },
  { emoji: "🎓", label: "Academic", count: 15 },
  { emoji: "🎨", label: "Creative", count: 6 },
  { emoji: "📖", label: "Learning", count: 10 },
  { emoji: "🌍", label: "Community", count: 4 },
]

export default function BlogPage() {
  const [activeFilter, setActiveFilter] = useState("All")
  const [searchQ, setSearchQ] = useState("")

  const filters = ["All", "Announcement", "Event", "Academic", "Creative", "Learning", "Community"]
  const filtered = POSTS.filter(p => {
    const matchFilter = activeFilter === "All" || p.tag.toLowerCase().includes(activeFilter.toLowerCase())
    const matchSearch = p.title.toLowerCase().includes(searchQ.toLowerCase()) || p.excerpt.toLowerCase().includes(searchQ.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:ital,wght@0,400;0,600;0,700;0,800;1,700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Nunito', sans-serif; background: #FAFAF7; color: #2C2C2A; overflow-x: hidden; }

        /* ── HERO ── */
        .bl-hero {
          background: linear-gradient(150deg, #2C2C2A 0%, #444441 60%, #5F5E5A 100%);
          padding: 7rem 1.5rem 5rem; text-align: center;
          position: relative; overflow: hidden;
        }
        .bl-hero-dots {
          position: absolute; inset: 0; pointer-events: none; user-select: none;
          background-image: radial-gradient(circle, rgba(250,199,117,0.18) 1px, transparent 1px);
          background-size: 32px 32px;
        }
        .bl-hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(250,199,117,0.15); border: 1px solid rgba(250,199,117,0.35);
          border-radius: 999px; padding: 6px 20px; font-size: 13px; font-weight: 700;
          color: #FAC775; letter-spacing: 0.08em; margin-bottom: 1.5rem;
          backdrop-filter: blur(4px); animation: fadeDown 0.8s ease both;
        }
        .bl-hero h1 {
          font-family: 'Fredoka One', cursive; font-size: clamp(2.4rem, 6vw, 4.2rem);
          color: #fff; line-height: 1.1; max-width: 760px; margin: 0 auto 1.2rem;
          animation: fadeDown 0.9s ease 0.1s both;
        }
        .bl-hero h1 em { font-style: normal; color: #FAC775; }
        .bl-hero p {
          font-size: clamp(1rem, 2vw, 1.2rem); color: rgba(255,255,255,0.7);
          max-width: 520px; margin: 0 auto 2.5rem; line-height: 1.75;
          animation: fadeDown 0.9s ease 0.2s both;
        }
        .bl-search-wrap {
          max-width: 440px; margin: 0 auto; position: relative;
          animation: fadeDown 0.9s ease 0.3s both;
        }
        .bl-search-wrap input {
          font-family: 'Nunito', sans-serif; width: 100%; padding: 14px 20px 14px 48px;
          border-radius: 999px; border: 2px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.1); color: #fff; font-size: 15px; font-weight: 600;
          outline: none; transition: background 0.2s, border-color 0.2s; backdrop-filter: blur(4px);
        }
        .bl-search-wrap input::placeholder { color: rgba(255,255,255,0.45); }
        .bl-search-wrap input:focus { background: rgba(255,255,255,0.18); border-color: #FAC775; }
        .bl-search-icon {
          position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
          font-size: 18px; pointer-events: none;
        }
        @keyframes fadeDown { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }

        /* ── SHARED ── */
        .bl-section { padding: 5rem 1.5rem; }
        .bl-section-alt { background: #F1EFE8; }
        .bl-container { max-width: 1100px; margin: 0 auto; }
        .bl-label { font-size: 12px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; color: #1D9E75; margin-bottom: 0.6rem; }
        .bl-title { font-family: 'Fredoka One', cursive; font-size: clamp(1.8rem, 4vw, 2.8rem); color: #2C2C2A; line-height: 1.15; margin-bottom: 1rem; }
        .bl-title span { color: #D85A30; }

        /* ── PINNED ── */
        .bl-pinned-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px,1fr)); gap: 1rem; }
        .bl-pinned-card {
          background: #FAC775; border-radius: 16px; padding: 1.5rem;
          display: flex; gap: 1rem; align-items: flex-start;
          transition: transform 0.2s; border: 2px solid #EF9F27;
        }
        .bl-pinned-card:hover { transform: translateY(-4px) rotate(1deg); }
        .bl-pinned-emoji { font-size: 1.8rem; flex-shrink: 0; }
        .bl-pinned-title { font-weight: 800; font-size: 14px; color: #2C2C2A; margin-bottom: 4px; }
        .bl-pinned-desc { font-size: 13px; color: #5F5E5A; margin-bottom: 6px; line-height: 1.5; }
        .bl-pinned-date { font-size: 11px; font-weight: 700; color: #BA7517; text-transform: uppercase; letter-spacing: 0.1em; }

        /* ── FILTERS ── */
        .bl-filters { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-bottom: 2.5rem; }
        .bl-filter-btn {
          font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 13px;
          border: 2px solid #E8E6DE; border-radius: 999px; padding: 7px 18px;
          cursor: pointer; background: #fff; color: #888780;
          transition: background 0.18s, color 0.18s, border-color 0.18s, transform 0.15s;
        }
        .bl-filter-btn:hover { border-color: #1D9E75; color: #1D9E75; transform: scale(1.05); }
        .bl-filter-btn.active { background: #1D9E75; color: #fff; border-color: #1D9E75; }

        /* ── POST CARDS ── */
        .bl-posts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
        .bl-post-card {
          background: #fff; border-radius: 20px; overflow: hidden;
          border: 1.5px solid #E8E6DE;
          transition: transform 0.25s, box-shadow 0.25s;
          display: flex; flex-direction: column;
        }
        .bl-post-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(0,0,0,0.1); }
        .bl-post-thumb {
          height: 140px; display: flex; align-items: center; justify-content: center;
          font-size: 4.5rem; position: relative; overflow: hidden;
        }
        .bl-post-tag {
          position: absolute; top: 12px; left: 12px;
          font-size: 11px; font-weight: 800; letter-spacing: 0.1em;
          border-radius: 999px; padding: 4px 12px; background: rgba(255,255,255,0.85);
          backdrop-filter: blur(4px);
        }
        .bl-post-body { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; }
        .bl-post-date { font-size: 12px; font-weight: 700; color: #888780; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.6rem; }
        .bl-post-title { font-family: 'Fredoka One', cursive; font-size: 1.15rem; color: #2C2C2A; margin-bottom: 0.6rem; line-height: 1.3; }
        .bl-post-excerpt { font-size: 14px; color: #5F5E5A; line-height: 1.7; flex: 1; margin-bottom: 1.25rem; }
        .bl-post-footer { display: flex; align-items: center; justify-content: space-between; }
        .bl-post-read { font-size: 12px; color: #B4B2A9; font-weight: 600; }
        .bl-post-link {
          font-size: 13px; font-weight: 800; color: #1D9E75;
          text-decoration: none; display: flex; align-items: center; gap: 4px;
          transition: gap 0.2s;
        }
        .bl-post-link:hover { gap: 8px; }

        /* ── SIDEBAR-STYLE CATEGORIES ── */
        .bl-side-layout { display: grid; grid-template-columns: 1fr 280px; gap: 3rem; align-items: start; }
        @media(max-width: 900px) { .bl-side-layout { grid-template-columns: 1fr; } }
        .bl-categories { background: #fff; border-radius: 20px; border: 1.5px solid #E8E6DE; padding: 1.75rem; position: sticky; top: 80px; }
        .bl-cat-title { font-family: 'Fredoka One', cursive; font-size: 1.2rem; color: #2C2C2A; margin-bottom: 1.25rem; }
        .bl-cat-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 0; border-bottom: 1px solid #F1EFE8;
          cursor: pointer; transition: color 0.18s;
        }
        .bl-cat-item:last-child { border-bottom: none; }
        .bl-cat-item:hover .bl-cat-name { color: #1D9E75; }
        .bl-cat-left { display: flex; align-items: center; gap: 10px; }
        .bl-cat-emoji { font-size: 1.2rem; }
        .bl-cat-name { font-weight: 700; font-size: 14px; color: #2C2C2A; }
        .bl-cat-count { font-size: 11px; font-weight: 800; background: #E1F5EE; color: #085041; padding: 2px 9px; border-radius: 999px; }

        /* ── NEWSLETTER ── */
        .bl-newsletter {
          background: linear-gradient(135deg, #D85A30 0%, #993C1D 100%);
          border-radius: 24px; padding: 3rem 2rem; text-align: center; margin: 0 1.5rem 5rem;
          position: relative; overflow: hidden;
        }
        .bl-newsletter::before { content: '📬'; position: absolute; font-size: 14rem; opacity: 0.06; bottom: -3rem; right: -2rem; pointer-events: none; user-select: none; }
        .bl-newsletter h3 { font-family: 'Fredoka One', cursive; font-size: clamp(1.6rem, 4vw, 2.4rem); color: #fff; margin-bottom: 0.75rem; position: relative; }
        .bl-newsletter p { font-size: 15px; color: rgba(255,255,255,0.8); margin-bottom: 1.75rem; max-width: 420px; margin-left: auto; margin-right: auto; position: relative; }
        .bl-nl-form { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; position: relative; }
        .bl-nl-input {
          font-family: 'Nunito', sans-serif; padding: 12px 20px;
          border-radius: 999px; border: 2px solid rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.15); color: #fff; font-size: 14px; font-weight: 600;
          outline: none; width: 280px; transition: border-color 0.2s; backdrop-filter: blur(4px);
        }
        .bl-nl-input::placeholder { color: rgba(255,255,255,0.5); }
        .bl-nl-input:focus { border-color: #FAC775; }
        .bl-nl-btn {
          background: #FAC775; color: #2C2C2A; font-family: 'Nunito', sans-serif;
          font-weight: 800; font-size: 14px; border: none; border-radius: 999px;
          padding: 12px 28px; cursor: pointer;
          box-shadow: 0 3px 0 #BA7517; transition: transform 0.15s, box-shadow 0.15s;
        }
        .bl-nl-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 0 #BA7517; }
        .bl-nl-btn:active { transform: translateY(1px); box-shadow: 0 1px 0 #BA7517; }

        /* ── EMPTY STATE ── */
        .bl-empty { text-align: center; padding: 4rem 1rem; }
        .bl-empty-emoji { font-size: 4rem; display: block; margin-bottom: 1rem; }
        .bl-empty p { color: #888780; font-size: 16px; font-weight: 600; }

        @media(max-width:600px){
          .bl-hero { padding: 5rem 1rem 3.5rem; }
          .bl-section { padding: 3.5rem 1rem; }
          .bl-newsletter { margin: 0 1rem 3.5rem; padding: 2.5rem 1.5rem; }
        }
      `}</style>

      <main>

        {/* ── HERO ── */}
        <section className="bl-hero">
          <div className="bl-hero-dots" />
          <div className="bl-hero-badge">📰 School News & Updates</div>
          <h1>The Delightsome<br /><em>Kids Blog</em></h1>
          <p>Announcements, events, achievements, and stories from our vibrant school community — stay in the loop.</p>
          <div className="bl-search-wrap">
            <span className="bl-search-icon">🔍</span>
            <input
              type="search"
              placeholder="Search posts…"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              aria-label="Search blog posts"
            />
          </div>
        </section>

        {/* ── PINNED ── */}
        <section className="bl-section">
          <div className="bl-container">
            <Reveal>
              <p className="bl-label">📌 Pinned Resources</p>
              <h2 className="bl-title">Important <span>quick links</span></h2>
            </Reveal>
            <div className="bl-pinned-grid">
              {PINNED.map((p, i) => (
                <Reveal key={p.title} delay={i * 80}>
                  <div className="bl-pinned-card">
                    <span className="bl-pinned-emoji">{p.emoji}</span>
                    <div>
                      <p className="bl-pinned-title">{p.title}</p>
                      <p className="bl-pinned-desc">{p.desc}</p>
                      <p className="bl-pinned-date">{p.date}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── POSTS + SIDEBAR ── */}
        <section className="bl-section bl-section-alt">
          <div className="bl-container">
            <Reveal>
              <p className="bl-label">Latest Posts</p>
              <h2 className="bl-title">What's <span>happening</span></h2>
            </Reveal>

            {/* Filters */}
            <Reveal delay={80}>
              <div className="bl-filters" role="group" aria-label="Filter posts by category">
                {filters.map((f) => (
                  <button
                    key={f}
                    className={`bl-filter-btn${activeFilter === f ? " active" : ""}`}
                    onClick={() => setActiveFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </Reveal>

            <div className="bl-side-layout">
              {/* Posts grid */}
              <div>
                {filtered.length === 0 ? (
                  <div className="bl-empty">
                    <span className="bl-empty-emoji">🔍</span>
                    <p>No posts found. Try a different search or filter.</p>
                  </div>
                ) : (
                  <div className="bl-posts-grid">
                    {filtered.map((post, i) => (
                      <Reveal key={post.title} delay={i * 70}>
                        <article className="bl-post-card">
                          <div className="bl-post-thumb" style={{ background: post.color }}>
                            <span>{post.emoji}</span>
                            <span className="bl-post-tag" style={{ color: post.tagColor }}>{post.tag}</span>
                          </div>
                          <div className="bl-post-body">
                            <p className="bl-post-date">{post.date} · {post.readTime}</p>
                            <h3 className="bl-post-title">{post.title}</h3>
                            <p className="bl-post-excerpt">{post.excerpt}</p>
                            <div className="bl-post-footer">
                              <span className="bl-post-read">📖 {post.readTime}</span>
                              <Link href="/blog" className="bl-post-link">Read more →</Link>
                            </div>
                          </div>
                        </article>
                      </Reveal>
                    ))}
                  </div>
                )}
              </div>

              {/* Categories sidebar */}
              <Reveal delay={120}>
                <aside className="bl-categories">
                  <p className="bl-cat-title">Browse by Category</p>
                  {CATEGORIES.map((cat) => (
                    <div
                      key={cat.label}
                      className="bl-cat-item"
                      onClick={() => setActiveFilter(cat.label)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && setActiveFilter(cat.label)}
                    >
                      <div className="bl-cat-left">
                        <span className="bl-cat-emoji">{cat.emoji}</span>
                        <span className="bl-cat-name">{cat.label}</span>
                      </div>
                      <span className="bl-cat-count">{cat.count}</span>
                    </div>
                  ))}
                </aside>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── NEWSLETTER ── */}
        <Reveal>
          <div className="bl-newsletter">
            <h3>Stay in the loop 📬</h3>
            <p>Get school news, event updates, and announcements straight to your inbox. No spam, ever.</p>
            <div className="bl-nl-form">
              <input className="bl-nl-input" type="email" placeholder="Your email address" aria-label="Email address" />
              <button className="bl-nl-btn">Subscribe ✓</button>
            </div>
          </div>
        </Reveal>

      </main>
    </>
  )
}