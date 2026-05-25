"use client"
import { useEffect, useRef, useState } from "react"

function useReveal(threshold = 0.1) {
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
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0) scale(1)" : "translateY(28px) scale(0.97)", transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`, ...style }}>
      {children}
    </div>
  )
}

/* ============================================================
   🖼️  ADD YOUR IMAGES HERE — just fill in src, alt, category
   ============================================================ */
const GALLERY_ITEMS = [
  { src: "https://picsum.photos/seed/dk1/800/600", alt: "Prize Giving Day 2024", category: "Events", featured: true },
  { src: "https://picsum.photos/seed/dk2/800/600", alt: "Inter-House Sports Day", category: "Sports", featured: true },
  { src: "https://picsum.photos/seed/dk3/800/600", alt: "Annual Art Exhibition", category: "Creative" },
  { src: "https://picsum.photos/seed/dk4/800/600", alt: "Reading Week Activities", category: "Academic" },
  { src: "https://picsum.photos/seed/dk5/800/600", alt: "Cultural Day Celebrations", category: "Events" },
  { src: "https://picsum.photos/seed/dk6/800/600", alt: "Science Fair Projects", category: "Academic", featured: true },
  { src: "https://picsum.photos/seed/dk7/800/600", alt: "Football Match Day", category: "Sports" },
  { src: "https://picsum.photos/seed/dk8/800/600", alt: "Drama & Theatre Club", category: "Creative" },
  { src: "https://picsum.photos/seed/dk9/800/600", alt: "Graduation Ceremony", category: "Events", featured: true },
  { src: "https://picsum.photos/seed/dk10/800/600", alt: "Computer Lab Session", category: "Academic" },
  { src: "https://picsum.photos/seed/dk11/800/600", alt: "Community Clean-Up Drive", category: "Community" },
  { src: "https://picsum.photos/seed/dk12/800/600", alt: "Music & Dance Recital", category: "Creative" },
  { src: "https://picsum.photos/seed/dk13/800/600", alt: "Quiz Competition Finals", category: "Academic" },
  { src: "https://picsum.photos/seed/dk14/800/600", alt: "Athletics Track Day", category: "Sports" },
  { src: "https://picsum.photos/seed/dk15/800/600", alt: "End of Year Party", category: "Events" },
  { src: "https://picsum.photos/seed/dk16/800/600", alt: "Prefect Investiture Ceremony", category: "Events" },
]
/* ============================================================ */

const ALL_CATS = ["All", ...Array.from(new Set(GALLERY_ITEMS.map(i => i.category)))]

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState("All")
  const [lightbox, setLightbox] = useState<null | { src: string; alt: string; idx: number }>(null)
  const [loaded, setLoaded] = useState<Set<number>>(new Set())

  const filtered = GALLERY_ITEMS.filter(i => activeFilter === "All" || i.category === activeFilter)

  function openLightbox(item: typeof GALLERY_ITEMS[0], idx: number) {
    setLightbox({ src: item.src, alt: item.alt, idx })
  }

  function closeLightbox() { setLightbox(null) }

  function navLightbox(dir: 1 | -1) {
    if (!lightbox) return
    const newIdx = (lightbox.idx + dir + filtered.length) % filtered.length
    setLightbox({ src: filtered[newIdx].src, alt: filtered[newIdx].alt, idx: newIdx })
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!lightbox) return
      if (e.key === "Escape") closeLightbox()
      if (e.key === "ArrowRight") navLightbox(1)
      if (e.key === "ArrowLeft") navLightbox(-1)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [lightbox, filtered])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Nunito', sans-serif; background: #FAFAF7; color: #2C2C2A; overflow-x: hidden; }

        /* ── HERO ── */
        .gl-hero {
          min-height: 52vh;
          background: linear-gradient(145deg, #7F77DD 0%, #534AB7 50%, #26215C 100%);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; padding: 7rem 1.5rem 5rem;
          position: relative; overflow: hidden;
        }
        .gl-hero-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .gl-hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3);
          border-radius: 999px; padding: 6px 20px; font-size: 13px; font-weight: 700;
          color: #fff; letter-spacing: 0.08em; margin-bottom: 1.5rem;
          backdrop-filter: blur(6px); animation: fadeDown 0.8s ease both;
        }
        .gl-hero h1 {
          font-family: 'Fredoka One', cursive; font-size: clamp(2.4rem, 6vw, 4.2rem);
          color: #fff; line-height: 1.1; max-width: 700px; margin-bottom: 1.2rem;
          animation: fadeDown 0.9s ease 0.1s both;
        }
        .gl-hero h1 em { font-style: normal; color: #FAC775; }
        .gl-hero p {
          font-size: clamp(1rem, 2vw, 1.2rem); color: rgba(255,255,255,0.75);
          max-width: 500px; line-height: 1.75; animation: fadeDown 0.9s ease 0.2s both;
        }
        .gl-count-badge {
          display: inline-flex; align-items: center; gap: 6px;
          margin-top: 1.5rem; background: rgba(250,199,117,0.2);
          border: 1px solid rgba(250,199,117,0.4); border-radius: 999px;
          padding: 6px 18px; font-size: 13px; font-weight: 700; color: #FAC775;
          animation: fadeDown 0.9s ease 0.3s both;
        }
        @keyframes fadeDown { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }

        /* ── SHARED ── */
        .gl-section { padding: 5rem 1.5rem; }
        .gl-container { max-width: 1200px; margin: 0 auto; }
        .gl-label { font-size: 12px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; color: #7F77DD; margin-bottom: 0.6rem; }
        .gl-title { font-family: 'Fredoka One', cursive; font-size: clamp(1.9rem, 4vw, 2.8rem); color: #2C2C2A; margin-bottom: 1rem; }
        .gl-title span { color: #D85A30; }

        /* ── FILTERS ── */
        .gl-filters { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-bottom: 3rem; }
        .gl-filter-btn {
          font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 13px;
          border: 2px solid #E8E6DE; border-radius: 999px; padding: 8px 20px;
          cursor: pointer; background: #fff; color: #888780;
          transition: all 0.18s;
        }
        .gl-filter-btn:hover { border-color: #7F77DD; color: #7F77DD; transform: scale(1.05); }
        .gl-filter-btn.active { background: #7F77DD; color: #fff; border-color: #7F77DD; }

        /* ── MASONRY-STYLE GRID ── */
        .gl-grid {
          columns: 4 220px;
          column-gap: 1rem;
        }
        .gl-item {
          break-inside: avoid;
          margin-bottom: 1rem;
          border-radius: 16px; overflow: hidden;
          position: relative; cursor: pointer;
          border: 2px solid transparent;
          transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
        }
        .gl-item:hover { transform: scale(1.03); box-shadow: 0 16px 48px rgba(127,119,221,0.2); border-color: #7F77DD; }
        .gl-item:hover .gl-overlay { opacity: 1; }
        .gl-item img { width: 100%; display: block; object-fit: cover; }
        .gl-item.featured { border-color: #FAC775; }

        /* skeleton loader */
        .gl-skeleton { background: linear-gradient(90deg, #E8E6DE 25%, #F1EFE8 50%, #E8E6DE 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; aspect-ratio: 4/3; width: 100%; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        .gl-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(38,33,92,0.85) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.3s;
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 1.25rem;
        }
        .gl-overlay-alt { font-size: 13px; font-weight: 700; color: #fff; display: block; margin-bottom: 4px; }
        .gl-overlay-cat {
          font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase;
          background: rgba(250,199,117,0.9); color: #2C2C2A; padding: 3px 10px;
          border-radius: 999px; display: inline-block; width: fit-content;
        }
        .gl-featured-badge {
          position: absolute; top: 10px; right: 10px;
          background: #FAC775; color: #2C2C2A; font-size: 10px; font-weight: 800;
          letter-spacing: 0.12em; text-transform: uppercase; padding: 3px 10px;
          border-radius: 999px;
        }

        /* ── LIGHTBOX ── */
        .gl-lightbox {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(10,8,30,0.95); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          padding: 1.5rem;
          animation: lbIn 0.2s ease both;
        }
        @keyframes lbIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
        .gl-lb-inner { position: relative; max-width: 900px; width: 100%; }
        .gl-lb-img { width: 100%; border-radius: 16px; display: block; max-height: 80vh; object-fit: contain; }
        .gl-lb-caption { text-align: center; margin-top: 1rem; color: rgba(255,255,255,0.7); font-weight: 600; font-size: 15px; }
        .gl-lb-close {
          position: fixed; top: 1.5rem; right: 1.5rem;
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
          border-radius: 999px; width: 44px; height: 44px;
          color: #fff; font-size: 20px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s; backdrop-filter: blur(4px);
        }
        .gl-lb-close:hover { background: rgba(255,255,255,0.2); }
        .gl-lb-nav {
          position: absolute; top: 50%; transform: translateY(-50%);
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
          border-radius: 999px; width: 48px; height: 48px;
          color: #fff; font-size: 20px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s; backdrop-filter: blur(4px);
        }
        .gl-lb-nav:hover { background: rgba(255,255,255,0.25); }
        .gl-lb-prev { left: -64px; }
        .gl-lb-next { right: -64px; }
        .gl-lb-counter { position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%); color: rgba(255,255,255,0.5); font-size: 13px; font-weight: 600; }

        /* ── STATS ── */
        .gl-stats-band { background: linear-gradient(135deg, #534AB7 0%, #26215C 100%); padding: 3.5rem 1.5rem; }
        .gl-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 2rem; max-width: 800px; margin: 0 auto; text-align: center; }
        .gl-stat-num { font-family: 'Fredoka One', cursive; font-size: 3rem; color: #FAC775; display: block; line-height: 1; }
        .gl-stat-label { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 5px; display: block; }

        /* ── SUBMIT CTA ── */
        .gl-submit {
          background: #FAC775; border-radius: 24px; padding: 3rem 2rem; text-align: center;
          margin: 0 1.5rem 5rem; position: relative; overflow: hidden;
        }
        .gl-submit::before { content: '📸'; position: absolute; font-size: 14rem; opacity: 0.08; top: -3rem; right: -2rem; pointer-events: none; }
        .gl-submit h3 { font-family: 'Fredoka One', cursive; font-size: clamp(1.6rem, 4vw, 2.4rem); color: #2C2C2A; margin-bottom: 0.75rem; position: relative; }
        .gl-submit p { font-size: 16px; color: #5F5E5A; max-width: 440px; margin: 0 auto 1.75rem; line-height: 1.7; position: relative; }
        .gl-submit-btn {
          background: #1D9E75; color: #fff; font-family: 'Nunito', sans-serif;
          font-weight: 800; font-size: 15px; border: none; border-radius: 999px;
          padding: 13px 32px; cursor: pointer; text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px;
          box-shadow: 0 4px 0 #0F6E56; transition: transform 0.15s, box-shadow 0.15s;
        }
        .gl-submit-btn:hover { transform: translateY(-3px); box-shadow: 0 7px 0 #0F6E56; }

        @media(max-width: 600px) {
          .gl-hero { padding: 5rem 1rem 3.5rem; }
          .gl-section { padding: 3.5rem 1rem; }
          .gl-lb-prev { left: -2px; top: auto; bottom: -3.5rem; transform: none; }
          .gl-lb-next { right: -2px; top: auto; bottom: -3.5rem; transform: none; }
          .gl-submit { margin: 0 1rem 3.5rem; }
        }
      `}</style>

      <main>
        {/* ── HERO ── */}
        <section className="gl-hero">
          <div className="gl-hero-grid" />
          <div className="gl-hero-badge">🖼️ School Memories</div>
          <h1>Our <em>Gallery</em></h1>
          <p>Explore photos from our school events, classrooms, sports days, and everything in between.</p>
          <div className="gl-count-badge">📸 {GALLERY_ITEMS.length} photos & counting</div>
        </section>

        {/* ── GALLERY ── */}
        <section className="gl-section">
          <div className="gl-container">
            <Reveal>
              <p className="gl-label">Browse Our Memories</p>
              <h2 className="gl-title">Life at <span>Delightsome Kids</span></h2>
            </Reveal>

            {/* Filters */}
            <Reveal delay={80}>
              <div className="gl-filters" role="group" aria-label="Filter gallery by category">
                {ALL_CATS.map((cat) => (
                  <button
                    key={cat}
                    className={`gl-filter-btn${activeFilter === cat ? " active" : ""}`}
                    onClick={() => setActiveFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </Reveal>

            {/* Masonry grid */}
            <div className="gl-grid">
              {filtered.map((item, i) => (
                <Reveal key={item.src + activeFilter} delay={i * 40}>
                  <div
                    className={`gl-item${item.featured ? " featured" : ""}`}
                    onClick={() => openLightbox(item, i)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && openLightbox(item, i)}
                    aria-label={`View ${item.alt}`}
                  >
                    {!loaded.has(i) && <div className="gl-skeleton" />}
                    <img
                      src={item.src}
                      alt={item.alt}
                      loading="lazy"
                      onLoad={() => setLoaded(prev => new Set([...prev, i]))}
                      style={{ display: loaded.has(i) ? "block" : "none" }}
                    />
                    {item.featured && <span className="gl-featured-badge">⭐ Featured</span>}
                    <div className="gl-overlay">
                      <span className="gl-overlay-alt">{item.alt}</span>
                      <span className="gl-overlay-cat">{item.category}</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="gl-stats-band">
          <div className="gl-stats-grid">
            {[
              { num: GALLERY_ITEMS.length + "+", label: "Photos" },
              { num: ALL_CATS.length - 1 + "", label: "Categories" },
              { num: "14+", label: "Years of Memories" },
              { num: "500+", label: "Happy Faces" },
            ].map((s) => (
              <Reveal key={s.label}>
                <span className="gl-stat-num">{s.num}</span>
                <span className="gl-stat-label">{s.label}</span>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── SUBMIT YOUR PHOTO ── */}
        <Reveal style={{ marginTop: "5rem" }}>
          <div className="gl-submit">
            <h3>Got a photo to share? 📸</h3>
            <p>Are you a parent or staff member with great school memories? Send us your photos and we'll feature them here.</p>
            <a href="mailto:gallery@delightsome.edu.ng" className="gl-submit-btn">
              📧 Send Us Your Photos
            </a>
          </div>
        </Reveal>
      </main>

      {/* ── LIGHTBOX ── */}
      {lightbox && (
        <div className="gl-lightbox" onClick={closeLightbox} role="dialog" aria-modal="true" aria-label="Image viewer">
          <div className="gl-lb-inner" onClick={(e) => e.stopPropagation()}>
            <button className="gl-lb-nav gl-lb-prev" onClick={() => navLightbox(-1)} aria-label="Previous image">←</button>
            <img className="gl-lb-img" src={lightbox.src} alt={lightbox.alt} />
            <button className="gl-lb-nav gl-lb-next" onClick={() => navLightbox(1)} aria-label="Next image">→</button>
            <p className="gl-lb-caption">{lightbox.alt}</p>
          </div>
          <button className="gl-lb-close" onClick={closeLightbox} aria-label="Close lightbox">✕</button>
          <p className="gl-lb-counter">{lightbox.idx + 1} / {filtered.length}</p>
        </div>
      )}
    </>
  )
}