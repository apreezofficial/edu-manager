"use client";
import Link from 'next/link';
import React from 'react';

function useReveal() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(28px)',
        transition: `opacity .7s ease ${delay}ms, transform .7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box;margin:0;padding:0; }
        body { font-family:'Nunito',sans-serif;background:#FAFAF7;color:#2C2C2A;overflow-x:hidden; }
        .home-hero { background:linear-gradient(145deg,#7F77DD 0%,#534AB7 55%,#26215C 100%);padding:6rem 1.5rem;text-align:center;color:#fff; }
        .home-hero h1 { font-family:'Fredoka One',cursive;font-size:clamp(2.4rem,6vw,4rem);margin-bottom:1rem; }
        .home-hero p { font-size:clamp(1rem,2vw,1.2rem);opacity:0.9; }
        .home-btn { background:#FAC775;color:#2C2C2A;font-weight:800;border:none;border-radius:999px;padding:12px 28px;margin:0.5rem;cursor:pointer;box-shadow:0 4px 0 #BA7517;transition:transform .15s,box-shadow .15s; }
        .home-btn:hover { transform:translateY(-2px);box-shadow:0 6px 0 #BA7517; }
        .nav-links { display:flex;gap:1rem;justify-content:center;margin-top:1.5rem; }
      `}</style>
      <section className="home-hero">
        <h1>Delightsome School</h1>
        <p>Welcome to our vibrant community – where learning meets joy.</p>
        <div className="nav-links">
          <Link href="/admissions" className="home-btn">Admissions</Link>
          <Link href="/admin" className="home-btn">Admin Dashboard</Link>
        </div>
      </section>
    </>
  );
}
