"use client";
import { useState } from 'react';
import { requestBackend } from '../utils/backendProxy';
import Link from 'next/link';
import React from 'react';

function useReveal() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
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

export default function Admin() {
  const [pin, setPin] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await requestBackend('/admin.php', 'POST', { pin, name, role, email });
      setMsg(res.message || 'Staff added');
    } catch (err: any) {
      setMsg(err.response?.data?.error || 'Error adding staff');
    }
  };

  const inp: React.CSSProperties = {
    fontFamily: 'inherit',
    width: '100%',
    border: '2px solid #E8E6DE',
    borderRadius: 12,
    padding: '12px 15px',
    fontSize: 14,
    background: '#FAFAF7',
    color: '#2C2C2A',
    outline: 'none',
    transition: 'border-color .2s',
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box;margin:0;padding:0; }
        body { font-family:'Nunito',sans-serif;background:#FAFAF7;color:#2C2C2A;overflow-x:hidden; }
        .admin-hero { background:linear-gradient(145deg,#7F77DD 0%,#534AB7 55%,#26215C 100%);padding:6rem 1.5rem;text-align:center;color:#fff;position:relative;overflow:hidden; }
        .admin-hero h1 { font-family:'Fredoka One',cursive;font-size:clamp(2.4rem,6vw,4rem);margin-bottom:1rem; }
        .admin-hero p { font-size:clamp(1rem,2vw,1.2rem);opacity:0.9; }
        .admin-btn-primary { background:#FAC775;color:#2C2C2A;font-weight:800;border:none;border-radius:999px;padding:12px 28px;cursor:pointer;box-shadow:0 4px 0 #BA7517;transition:transform .15s,box-shadow .15s; }
        .admin-btn-primary:hover { transform:translateY(-2px);box-shadow:0 6px 0 #BA7517; }
        .admin-card { background:#fff;border-radius:24px;padding:2rem;border:1.5px solid #E8E6DE;box-shadow:0 4px 24px rgba(0,0,0,.05);max-width:500px;margin:auto; }
        .admin-input { width:100%;border:2px solid #E8E6DE;border-radius:12px;padding:12px 15px;margin-top:0.5rem;background:#FAFAF7; }
        .admin-msg { margin-top:1rem;padding:0.75rem 1rem;background:#E1F5EE;border:1px solid #1D9E75;border-radius:8px; }
      `}</style>
      <section className="admin-hero">
        <h1>Staff Management Dashboard</h1>
        <p>Securely add new staff members and manage admin settings.</p>
        <Link href="/" className="admin-btn-primary">← Back to Home</Link>
      </section>
      <Reveal>
        <div className="admin-card">
          <h2 style={{ fontFamily: '"Fredoka One"', fontSize: '1.5rem', marginBottom: '0.5rem', color: '#2C2C2A' }}>Add Staff (Admin)</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input className="admin-input" placeholder="PIN" value={pin} onChange={e=>setPin(e.target.value)} required />
            <input className="admin-input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />
            <input className="admin-input" placeholder="Role" value={role} onChange={e=>setRole(e.target.value)} required />
            <input className="admin-input" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
            <button type="submit" className="admin-btn-primary" style={{ width: '100%', marginTop: '0.75rem' }}>Add Staff</button>
          </form>
          {msg && <div className="admin-msg">{msg}</div>}
        </div>
      </Reveal>
    </>
  );
}
