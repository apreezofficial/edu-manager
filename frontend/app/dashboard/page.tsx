"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Staff = {
    id: number;
    name: string;
    role: string;
    email: string;
    staff_number: string;
};

export default function DashboardPage() {
    const [pin, setPin] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [form, setForm] = useState({ name: "", role: "", email: "", staff_number: "" });
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        if (loggedIn) loadStaff();
    }, [loggedIn]);

    const loadStaff = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/get_staff");
            const data = await res.json();
            setStaff(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (pin === "APWERB12") {
            setLoggedIn(true);
            setPin("");
        } else {
            setMsg("Invalid PIN");
            setTimeout(() => setMsg(""), 3000);
        }
    };

    const handleAddStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/create_staff", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, pin: "APWERB12" })
            });
            const data = await res.json();
            if (data.success) {
                setMsg(data.message);
                setForm({ name: "", role: "", email: "", staff_number: "" });
                loadStaff();
            } else {
                setMsg(data.error || "Error adding staff");
            }
            setTimeout(() => setMsg(""), 3000);
        } catch (e) {
            console.error(e);
            setMsg("Error adding staff");
            setTimeout(() => setMsg(""), 3000);
        }
    };

    const handleUpdateStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingStaff) return;
        try {
            const res = await fetch("/api/update_staff", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, id: editingStaff.id, pin: "APWERB12" })
            });
            const data = await res.json();
            if (data.success) {
                setMsg(data.message);
                setEditingStaff(null);
                setForm({ name: "", role: "", email: "", staff_number: "" });
                loadStaff();
            } else {
                setMsg(data.error || "Error updating staff");
            }
            setTimeout(() => setMsg(""), 3000);
        } catch (e) {
            console.error(e);
            setMsg("Error updating staff");
            setTimeout(() => setMsg(""), 3000);
        }
    };

    const handleDeleteStaff = async () => {
        if (!deleteId) return;
        try {
            const res = await fetch("/api/delete_staff", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: deleteId, pin: "APWERB12" })
            });
            const data = await res.json();
            if (data.success) {
                setMsg(data.message);
                setDeleteId(null);
                loadStaff();
            } else {
                setMsg(data.error || "Error deleting staff");
            }
            setTimeout(() => setMsg(""), 3000);
        } catch (e) {
            console.error(e);
            setMsg("Error deleting staff");
            setTimeout(() => setMsg(""), 3000);
        }
    };

    const startEdit = (s: Staff) => {
        setEditingStaff(s);
        setForm({ name: s.name, role: s.role, email: s.email, staff_number: s.staff_number });
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: 'Nunito', sans-serif; background: #F1EFE8; color: #2C2C2A; overflow-x: hidden; }
                .dashboard-hero { background: linear-gradient(145deg, #7F77DD 0%, #534AB7 55%, #26215C 100%); padding: 5rem 2rem 3.5rem; position: relative; overflow: hidden; }
                .dashboard-hero h1 { font-family: 'Fredoka One', cursive; font-size: clamp(2rem, 5vw, 3rem); color: #fff; }
                .dashboard-hero p { font-size: 16px; color: rgba(255,255,255,.9); margin-top: .5rem; }
                .dashboard-shell { max-width: 1100px; margin: 0 auto; padding: 2.5rem 1.5rem 4rem; }
                .login-card { background: #fff; border-radius: 24px; padding: 2.5rem; border: 2px solid #E8E6DE; box-shadow: 0 16px 60px rgba(0,0,0,.08); max-width: 450px; margin: 0 auto; }
                .login-input { width:100%; border:2px solid #E8E6DE; border-radius:12px; padding:13px 16px; font-size:15px; background:#FAFAF7; outline:none; transition:border-color .2s; }
                .login-input:focus { border-color:#7F77DD; }
                .btn-primary { background:#FAC775; color:#2C2C2A; font-family:'Nunito',sans-serif; font-weight:800; border:none; border-radius:999px; padding:12px 28px; cursor:pointer; box-shadow:0 4px 0 #BA7517; transition:transform .15s,box-shadow .15s; }
                .btn-primary:hover { transform:translateY(-2px); box-shadow:0 6px 0 #BA7517; }
                .btn-secondary { background:#7F77DD; color:#fff; font-family:'Nunito',sans-serif; font-weight:800; border:none; border-radius:999px; padding:10px 20px; cursor:pointer; box-shadow:0 3px 0 #534AB7; transition:transform .15s,box-shadow .15s; }
                .btn-danger { background:#D85A30; color:#fff; font-family:'Nunito',sans-serif; font-weight:800; border:none; border-radius:999px; padding:10px 20px; cursor:pointer; box-shadow:0 3px 0 #993C1D; transition:transform .15s,box-shadow .15s; }
                .btn-outline { background:#fff; color:#888780; border:2px solid #E8E6DE; border-radius:999px; padding:10px 20px; cursor:pointer; font-weight:700; }
                .card { background:#fff; border-radius:20px; padding:2rem; border:1.5px solid #E8E6DE; margin-bottom:1.5rem; }
                .card-title { font-family:'Fredoka One', cursive; font-size:1.3rem; color:#2C2C2A; margin-bottom:1.25rem; }
                .staff-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:1.25rem; }
                .staff-card { background:#fff; border-radius:18px; padding:1.5rem; border:1.5px solid #E8E6DE; transition:transform .2s,box-shadow .2s; }
                .staff-card:hover { transform:translateY(-4px); box-shadow:0 12px 32px rgba(0,0,0,.07); }
                .staff-name { font-family:'Fredoka One', cursive; font-size:1.25rem; color:#2C2C2A; margin-bottom:.35rem; }
                .staff-role { font-size:14px; color:#888780; font-weight:700; margin-bottom:.75rem; }
                .staff-number { font-size:13px; color:#7F77DD; font-weight:700; }
                .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
                .form-input { width:100%; border:2px solid #E8E6DE; border-radius:12px; padding:12px 15px; font-size:14px; background:#FAFAF7; outline:none; transition:border-color .2s; }
                .form-input:focus { border-color:#7F77DD; }
                .msg { margin-top:1rem; padding:.75rem 1rem; border-radius:12px; font-weight:700; }
                .msg-success { background:#E1F5EE; color:#1D9E75; border:1px solid #1D9E75; }
                .msg-error { background:#FAECE7; color:#D85A30; border:1px solid #D85A30; }
                .overlay { position:fixed; inset:0; background:rgba(0,0,0,.5); display:flex; align-items:center; justify-content:center; z-index:1000; }
                .modal { background:#fff; border-radius:20px; padding:2rem; max-width:420px; width:95%; }
                .topbar { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; margin-bottom:1.5rem; }
                @media(max-width:600px){ .form-grid { grid-template-columns:1fr; } }
            `}</style>

            <main>
                <section className="dashboard-hero">
                    <div style={{maxWidth:1100, margin:"0 auto"}}>
                        <h1>Admin Dashboard</h1>
                        <p>Manage staff, view records, and oversee school operations.</p>
                    </div>
                </section>

                <div className="dashboard-shell">
                    {!loggedIn ? (
                        <div className="login-card">
                            <h2 style={{fontFamily:'"Fredoka One", cursive', fontSize:'1.7rem', marginBottom:'1rem'}}>Admin Login</h2>
                            <p style={{color:'#888780', marginBottom:'1.5rem'}}>Enter your PIN to access the dashboard.</p>
                            <form onSubmit={handleLogin}>
                                <input
                                    className="login-input"
                                    type="password"
                                    placeholder="Enter PIN"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    autoFocus
                                />
                                {msg && <div className="msg msg-error" style={{marginTop:'1rem'}}>{msg}</div>}
                                <div style={{marginTop:'1.5rem', display:'flex', gap:'1rem'}}>
                                    <Link href="/" className="btn-outline" style={{textDecoration:'none', display:'inline-flex', alignItems:'center'}}>← Back to Home</Link>
                                    <button type="submit" className="btn-primary" style={{flex:1}}>Enter Dashboard</button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <>
                            <div className="topbar">
                                <div>
                                    <h2 style={{fontFamily:'"Fredoka One", cursive', fontSize:'1.5rem'}}>Staff Management</h2>
                                    <p style={{color:'#888780', fontSize:'13px', fontWeight:'700', marginTop:'.25rem'}}>{staff.length} staff members</p>
                                </div>
                                <div style={{display:'flex', gap:'.6rem', flexWrap:'wrap'}}>
                                    <Link href="/portal" className="btn-outline" style={{textDecoration:'none', display:'inline-flex', alignItems:'center'}}>Portal</Link>
                                    <button onClick={() => { setLoggedIn(false); setStaff([]); }} className="btn-outline">Logout</button>
                                </div>
                            </div>

                            {msg && <div className={`msg ${msg.includes('Error') ? 'msg-error' : 'msg-success'}`}>{msg}</div>}

                            <div className="card">
                                <h3 className="card-title">{editingStaff ? 'Edit Staff' : 'Add New Staff'}</h3>
                                <form onSubmit={editingStaff ? handleUpdateStaff : handleAddStaff}>
                                    <div className="form-grid">
                                        <div style={{gridColumn: editingStaff ? '1 / -1' : 'auto'}}>
                                            <label style={{fontSize:'13px', fontWeight:'800', marginBottom:'6px', display:'block'}}>Full Name *</label>
                                            <input
                                                className="form-input"
                                                placeholder="e.g., Mrs. Ajayi Tosin"
                                                value={form.name}
                                                onChange={(e) => setForm({...form, name: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label style={{fontSize:'13px', fontWeight:'800', marginBottom:'6px', display:'block'}}>Role *</label>
                                            <input
                                                className="form-input"
                                                placeholder="e.g., Head of Administration"
                                                value={form.role}
                                                onChange={(e) => setForm({...form, role: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label style={{fontSize:'13px', fontWeight:'800', marginBottom:'6px', display:'block'}}>Email</label>
                                            <input
                                                className="form-input"
                                                type="email"
                                                placeholder="e.g., staff@delightsome.edu.ng"
                                                value={form.email}
                                                onChange={(e) => setForm({...form, email: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label style={{fontSize:'13px', fontWeight:'800', marginBottom:'6px', display:'block'}}>Staff Number</label>
                                            <input
                                                className="form-input"
                                                placeholder="e.g., STF0007"
                                                value={form.staff_number}
                                                onChange={(e) => setForm({...form, staff_number: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div style={{display:'flex', gap:'.75rem', marginTop:'1.5rem', flexWrap:'wrap'}}>
                                        <button type="submit" className="btn-primary">
                                            {editingStaff ? 'Update Staff' : 'Add Staff'}
                                        </button>
                                        {editingStaff && (
                                            <button type="button" className="btn-outline" onClick={() => { setEditingStaff(null); setForm({name:'', role:'', email:'', staff_number:''}); }}>
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>

                            {loading ? (
                                <div className="card" style={{textAlign:'center', padding:'3rem'}}>
                                    <p>Loading staff...</p>
                                </div>
                            ) : (
                                <div className="staff-grid">
                                    {staff.map((s) => (
                                        <div key={s.id} className="staff-card">
                                            <div className="staff-name">{s.name}</div>
                                            <div className="staff-role">{s.role}</div>
                                            {s.email && <div style={{fontSize:'13px', color:'#5F5E5A', marginBottom:'.5rem'}}>{s.email}</div>}
                                            <div className="staff-number">Staff ID: {s.staff_number}</div>
                                            <div style={{marginTop:'1.25rem', display:'flex', gap:'.5rem', flexWrap:'wrap'}}>
                                                <button className="btn-secondary" onClick={() => startEdit(s)} style={{fontSize:'13px', padding:'8px 16px'}}>
                                                    Edit
                                                </button>
                                                <button className="btn-danger" onClick={() => setDeleteId(s.id)} style={{fontSize:'13px', padding:'8px 16px'}}>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {deleteId && (
                                <div className="overlay" onClick={() => setDeleteId(null)}>
                                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                                        <h2 style={{fontFamily:'"Fredoka One", cursive', marginBottom:'1rem'}}>Delete Staff?</h2>
                                        <p style={{color:'#5F5E5A', marginBottom:'1.5rem'}}>This action cannot be undone. Are you sure you want to delete this staff member?</p>
                                        <div style={{display:'flex', gap:'.75rem', justifyContent:'flex-end'}}>
                                            <button className="btn-outline" onClick={() => setDeleteId(null)}>Cancel</button>
                                            <button className="btn-danger" onClick={handleDeleteStaff}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </>
    );
}