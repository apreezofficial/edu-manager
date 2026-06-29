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

type Student = {
    id: number;
    name: string;
    reg_number: string;
    class: string;
    email: string;
};

export default function DashboardPage() {
    const [pin, setPin] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [tab, setTab] = useState<"staff" | "students">("staff");
    
    // Staff form
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [staffForm, setStaffForm] = useState({ name: "", role: "", email: "", staff_number: "" });
    const [deleteStaffId, setDeleteStaffId] = useState<number | null>(null);

    // Student form
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [studentForm, setStudentForm] = useState({ name: "", reg_number: "", class: "", email: "" });
    const [deleteStudentId, setDeleteStudentId] = useState<number | null>(null);

    useEffect(() => {
        if (loggedIn) {
            loadStaff();
            loadStudents();
        }
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

    const loadStudents = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/get_students");
            const data = await res.json();
            const studentsArray = data.students || (Array.isArray(data) ? data : []);
            setStudents(Array.isArray(studentsArray) ? studentsArray : []);
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

    // STAFF OPERATIONS
    const handleAddStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/create_staff", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...staffForm, pin: "APWERB12" })
            });
            const data = await res.json();
            if (data.success) {
                setMsg(data.message);
                setStaffForm({ name: "", role: "", email: "", staff_number: "" });
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
                body: JSON.stringify({ ...staffForm, id: editingStaff.id, pin: "APWERB12" })
            });
            const data = await res.json();
            if (data.success) {
                setMsg(data.message);
                setEditingStaff(null);
                setStaffForm({ name: "", role: "", email: "", staff_number: "" });
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
        if (!deleteStaffId) return;
        try {
            const res = await fetch("/api/delete_staff", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: deleteStaffId, pin: "APWERB12" })
            });
            const data = await res.json();
            if (data.success) {
                setMsg(data.message);
                setDeleteStaffId(null);
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

    const startEditStaff = (s: Staff) => {
        setEditingStaff(s);
        setStaffForm({ name: s.name, role: s.role, email: s.email, staff_number: s.staff_number });
    };

    // STUDENT OPERATIONS
    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/add_student", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...studentForm, pin: "APWERB12" })
            });
            const data = await res.json();
            if (data.success) {
                setMsg(data.message);
                setStudentForm({ name: "", reg_number: "", class: "", email: "" });
                loadStudents();
            } else {
                setMsg(data.error || "Error adding student");
            }
            setTimeout(() => setMsg(""), 3000);
        } catch (e) {
            console.error(e);
            setMsg("Error adding student");
            setTimeout(() => setMsg(""), 3000);
        }
    };

    const handleDeleteStudent = async () => {
        if (!deleteStudentId) return;
        try {
            const res = await fetch("/api/delete_student", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: deleteStudentId, pin: "APWERB12" })
            });
            const data = await res.json();
            if (data.success) {
                setMsg(data.message);
                setDeleteStudentId(null);
                loadStudents();
            } else {
                setMsg(data.error || "Error deleting student");
            }
            setTimeout(() => setMsg(""), 3000);
        } catch (e) {
            console.error(e);
            setMsg("Error deleting student");
            setTimeout(() => setMsg(""), 3000);
        }
    };

    const startEditStudent = (s: Student) => {
        setEditingStudent(s);
        setStudentForm({ name: s.name, reg_number: s.reg_number, class: s.class, email: s.email });
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
                .btn-primary { background:#FAC775; color:#2C2C2A; font-family:'Nunito',sans-serif; font-weight:800; border:none; border-radius:999px; padding:12px 28px; cursor:pointer; box-shadow: 0 4px 0 #BA7517; transition: transform .15s, box-shadow .15s; }
                .btn-primary:hover { transform:translateY(-2px); box-shadow:0 6px 0 #BA7517; }
                .btn-secondary { background:#7F77DD; color:#fff; font-family:'Nunito',sans-serif; font-weight:800; border:none; border-radius:999px; padding:10px 20px; cursor:pointer; box-shadow: 0 3px 0 #534AB7; transition: transform .15s; }
                .btn-secondary:hover { transform:translateY(-2px); }
                .btn-danger { background:#D85A30; color:#fff; font-family:'Nunito',sans-serif; font-weight:800; border:none; border-radius:999px; padding:10px 20px; cursor:pointer; box-shadow: 0 3px 0 #A84424; transition: transform .15s; }
                .btn-danger:hover { transform:translateY(-2px); }
                .btn-outline { background:#fff; color:#888780; border:2px solid #E8E6DE; border-radius:999px; padding:10px 20px; cursor:pointer; font-weight:700; transition: all .2s; }
                .btn-outline:hover { border-color:#7F77DD; color:#7F77DD; }
                .btn-tab { background:#E8E6DE; color:#2C2C2A; font-family:'Nunito',sans-serif; font-weight:800; border:none; border-radius:12px; padding:12px 24px; cursor:pointer; transition: all .2s; margin-right: 0.5rem; }
                .btn-tab.active { background:#7F77DD; color:#fff; }
                .card { background:#fff; border-radius:20px; padding:2rem; border:1.5px solid #E8E6DE; margin-bottom:1.5rem; }
                .card-title { font-family:'Fredoka One', cursive; font-size:1.3rem; color:#2C2C2A; margin-bottom:1.25rem; }
                .staff-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:1.25rem; }
                .student-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:1.25rem; }
                .staff-card { background:#fff; border-radius:18px; padding:1.5rem; border:1.5px solid #E8E6DE; transition:transform .2s,box-shadow .2s; }
                .staff-card:hover { transform:translateY(-4px); box-shadow:0 12px 32px rgba(0,0,0,.07); }
                .student-card { background:#fff; border-radius:18px; padding:1.5rem; border:1.5px solid #E8E6DE; transition:transform .2s,box-shadow .2s; }
                .student-card:hover { transform:translateY(-4px); box-shadow:0 12px 32px rgba(0,0,0,.07); }
                .staff-name { font-family:'Fredoka One', cursive; font-size:1.25rem; color:#2C2C2A; margin-bottom:.35rem; }
                .staff-role { font-size:14px; color:#888780; font-weight:700; margin-bottom:.75rem; }
                .staff-number { font-size:13px; color:#7F77DD; font-weight:700; }
                .student-name { font-family:'Fredoka One', cursive; font-size:1.25rem; color:#2C2C2A; margin-bottom:.35rem; }
                .student-class { font-size:14px; color:#888780; font-weight:700; margin-bottom:.75rem; }
                .student-number { font-size:13px; color:#7F77DD; font-weight:700; }
                .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
                .form-input { width:100%; border:2px solid #E8E6DE; border-radius:12px; padding:12px 15px; font-size:14px; background:#FAFAF7; outline:none; transition:border-color .2s; }
                .form-input:focus { border-color:#7F77DD; }
                .msg { margin-top:1rem; padding:.75rem 1rem; border-radius:12px; font-weight:700; }
                .msg-success { background:#E1F5EE; color:#1D9E75; border:1px solid #1D9E75; }
                .msg-error { background:#FAECE7; color:#D85A30; border:1px solid #D85A30; }
                .overlay { position:fixed; inset:0; background:rgba(0,0,0,.5); display:flex; align-items:center; justify-content:center; z-index:1000; }
                .modal { background:#fff; border-radius:20px; padding:2rem; max-width:420px; width:95%; }
                .topbar { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; margin-bottom:1.5rem; }
                .tab-stats { display:flex; gap:2rem; margin-bottom:1.5rem; }
                .stat-box { background:#F9F7F1; border-radius:12px; padding:1rem; border:1px solid #E8E6DE; }
                .stat-label { font-size:13px; color:#888780; font-weight:700; }
                .stat-value { font-size:24px; font-family:'Fredoka One', cursive; color:#7F77DD; margin-top:.25rem; }
                @media(max-width:600px){ .form-grid { grid-template-columns:1fr; } }
            `}</style>

            <main>
                <section className="dashboard-hero">
                    <div style={{maxWidth:1100, margin:"0 auto"}}>
                        <h1>Admin Dashboard</h1>
                        <p>Manage staff & students, view records, and oversee school operations.</p>
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
                                    <h2 style={{fontFamily:'"Fredoka One", cursive', fontSize:'1.5rem'}}>Management Panel</h2>
                                    <p style={{color:'#888780', fontSize:'13px', fontWeight:'700', marginTop:'.25rem'}}>Staff: {staff.length} | Students: {students.length}</p>
                                </div>
                                <div style={{display:'flex', gap:'.6rem', flexWrap:'wrap'}}>
                                    <Link href="/portal" className="btn-outline" style={{textDecoration:'none', display:'inline-flex', alignItems:'center'}}>Portal</Link>
                                    <button onClick={() => { setLoggedIn(false); setStaff([]); setStudents([]); }} className="btn-outline">Logout</button>
                                </div>
                            </div>

                            {msg && <div className={`msg ${msg.includes('Error') ? 'msg-error' : 'msg-success'}`}>{msg}</div>}

                            {/* TAB NAVIGATION */}
                            <div style={{marginBottom:'2rem', display:'flex', gap:'0.5rem'}}>
                                <button 
                                    className={`btn-tab ${tab === 'staff' ? 'active' : ''}`}
                                    onClick={() => setTab('staff')}
                                >
                                    👥 Staff ({staff.length})
                                </button>
                                <button 
                                    className={`btn-tab ${tab === 'students' ? 'active' : ''}`}
                                    onClick={() => setTab('students')}
                                >
                                    🎓 Students ({students.length})
                                </button>
                            </div>

                            {/* ===== STAFF TAB ===== */}
                            {tab === 'staff' && (
                                <>
                                    <div className="card">
                                        <h3 className="card-title">{editingStaff ? 'Edit Staff' : 'Add New Staff'}</h3>
                                        <form onSubmit={editingStaff ? handleUpdateStaff : handleAddStaff}>
                                            <div className="form-grid">
                                                <div style={{gridColumn: editingStaff ? '1 / -1' : 'auto'}}>
                                                    <label style={{fontSize:'13px', fontWeight:'800', marginBottom:'6px', display:'block'}}>Full Name *</label>
                                                    <input
                                                        className="form-input"
                                                        placeholder="e.g., Mrs. Ajayi Tosin"
                                                        value={staffForm.name}
                                                        onChange={(e) => setStaffForm({...staffForm, name: e.target.value})}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label style={{fontSize:'13px', fontWeight:'800', marginBottom:'6px', display:'block'}}>Role *</label>
                                                    <input
                                                        className="form-input"
                                                        placeholder="e.g., Head of Administration"
                                                        value={staffForm.role}
                                                        onChange={(e) => setStaffForm({...staffForm, role: e.target.value})}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label style={{fontSize:'13px', fontWeight:'800', marginBottom:'6px', display:'block'}}>Email</label>
                                                    <input
                                                        className="form-input"
                                                        type="email"
                                                        placeholder="e.g., staff@delightsome.edu.ng"
                                                        value={staffForm.email}
                                                        onChange={(e) => setStaffForm({...staffForm, email: e.target.value})}
                                                    />
                                                </div>
                                                <div>
                                                    <label style={{fontSize:'13px', fontWeight:'800', marginBottom:'6px', display:'block'}}>Staff Number</label>
                                                    <input
                                                        className="form-input"
                                                        placeholder="e.g., STF0007"
                                                        value={staffForm.staff_number}
                                                        onChange={(e) => setStaffForm({...staffForm, staff_number: e.target.value})}
                                                    />
                                                </div>
                                            </div>
                                            <div style={{display:'flex', gap:'.75rem', marginTop:'1.5rem', flexWrap:'wrap'}}>
                                                <button type="submit" className="btn-primary">
                                                    {editingStaff ? 'Update Staff' : 'Add Staff'}
                                                </button>
                                                {editingStaff && (
                                                    <button type="button" className="btn-outline" onClick={() => { setEditingStaff(null); setStaffForm({name:'', role:'', email:'', staff_number:''}); }}>
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
                                    ) : staff.length === 0 ? (
                                        <div className="card" style={{textAlign:'center', padding:'3rem', color:'#888780'}}>
                                            <p>No staff members yet. Add one above!</p>
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
                                                        <button className="btn-secondary" onClick={() => startEditStaff(s)} style={{fontSize:'13px', padding:'8px 16px'}}>
                                                            Edit
                                                        </button>
                                                        <button className="btn-danger" onClick={() => setDeleteStaffId(s.id)} style={{fontSize:'13px', padding:'8px 16px'}}>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {deleteStaffId && (
                                        <div className="overlay" onClick={() => setDeleteStaffId(null)}>
                                            <div className="modal" onClick={(e) => e.stopPropagation()}>
                                                <h2 style={{fontFamily:'"Fredoka One", cursive', marginBottom:'1rem'}}>Delete Staff?</h2>
                                                <p style={{color:'#5F5E5A', marginBottom:'1.5rem'}}>This action cannot be undone. Are you sure you want to delete this staff member?</p>
                                                <div style={{display:'flex', gap:'.75rem', justifyContent:'flex-end'}}>
                                                    <button className="btn-outline" onClick={() => setDeleteStaffId(null)}>Cancel</button>
                                                    <button className="btn-danger" onClick={handleDeleteStaff}>Delete</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* ===== STUDENTS TAB ===== */}
                            {tab === 'students' && (
                                <>
                                    <div className="card">
                                        <h3 className="card-title">{editingStudent ? 'Edit Student' : 'Add New Student'}</h3>
                                        <form onSubmit={editingStudent ? async (e) => {
                                            e.preventDefault();
                                            // TODO: Implement student update when backend is ready
                                            setMsg("Student update feature coming soon");
                                            setTimeout(() => setMsg(""), 3000);
                                        } : handleAddStudent}>
                                            <div className="form-grid">
                                                <div style={{gridColumn: editingStudent ? '1 / -1' : 'auto'}}>
                                                    <label style={{fontSize:'13px', fontWeight:'800', marginBottom:'6px', display:'block'}}>Student Name *</label>
                                                    <input
                                                        className="form-input"
                                                        placeholder="e.g., Chioma Adeyemi"
                                                        value={studentForm.name}
                                                        onChange={(e) => setStudentForm({...studentForm, name: e.target.value})}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label style={{fontSize:'13px', fontWeight:'800', marginBottom:'6px', display:'block'}}>Reg Number *</label>
                                                    <input
                                                        className="form-input"
                                                        placeholder="e.g., STU0045"
                                                        value={studentForm.reg_number}
                                                        onChange={(e) => setStudentForm({...studentForm, reg_number: e.target.value})}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label style={{fontSize:'13px', fontWeight:'800', marginBottom:'6px', display:'block'}}>Class *</label>
                                                    <input
                                                        className="form-input"
                                                        placeholder="e.g., JSS1A"
                                                        value={studentForm.class}
                                                        onChange={(e) => setStudentForm({...studentForm, class: e.target.value})}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label style={{fontSize:'13px', fontWeight:'800', marginBottom:'6px', display:'block'}}>Email</label>
                                                    <input
                                                        className="form-input"
                                                        type="email"
                                                        placeholder="e.g., chioma@school.edu.ng"
                                                        value={studentForm.email}
                                                        onChange={(e) => setStudentForm({...studentForm, email: e.target.value})}
                                                    />
                                                </div>
                                            </div>
                                            <div style={{display:'flex', gap:'.75rem', marginTop:'1.5rem', flexWrap:'wrap'}}>
                                                <button type="submit" className="btn-primary">
                                                    {editingStudent ? 'Update Student' : 'Add Student'}
                                                </button>
                                                {editingStudent && (
                                                    <button type="button" className="btn-outline" onClick={() => { setEditingStudent(null); setStudentForm({name:'', reg_number:'', class:'', email:''}); }}>
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </form>
                                    </div>

                                    {loading ? (
                                        <div className="card" style={{textAlign:'center', padding:'3rem'}}>
                                            <p>Loading students...</p>
                                        </div>
                                    ) : students.length === 0 ? (
                                        <div className="card" style={{textAlign:'center', padding:'3rem', color:'#888780'}}>
                                            <p>No students yet. Add one above!</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="tab-stats">
                                                <div className="stat-box">
                                                    <div className="stat-label">Total Students</div>
                                                    <div className="stat-value">{students.length}</div>
                                                </div>
                                            </div>
                                            <div className="student-grid">
                                                {students.map((s) => (
                                                    <div key={s.id} className="student-card">
                                                        <div className="student-name">{s.name}</div>
                                                        <div className="student-class">{s.class}</div>
                                                        {s.email && <div style={{fontSize:'13px', color:'#5F5E5A', marginBottom:'.5rem'}}>{s.email}</div>}
                                                        <div className="student-number">Reg: {s.reg_number}</div>
                                                        <div style={{marginTop:'1.25rem', display:'flex', gap:'.5rem', flexWrap:'wrap'}}>
                                                            <button className="btn-secondary" onClick={() => startEditStudent(s)} style={{fontSize:'13px', padding:'8px 16px'}} disabled>
                                                                Edit
                                                            </button>
                                                            <button className="btn-danger" onClick={() => setDeleteStudentId(s.id)} style={{fontSize:'13px', padding:'8px 16px'}}>
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {deleteStudentId && (
                                        <div className="overlay" onClick={() => setDeleteStudentId(null)}>
                                            <div className="modal" onClick={(e) => e.stopPropagation()}>
                                                <h2 style={{fontFamily:'"Fredoka One", cursive', marginBottom:'1rem'}}>Delete Student?</h2>
                                                <p style={{color:'#5F5E5A', marginBottom:'1.5rem'}}>This action cannot be undone. Are you sure you want to delete this student?</p>
                                                <div style={{display:'flex', gap:'.75rem', justifyContent:'flex-end'}}>
                                                    <button className="btn-outline" onClick={() => setDeleteStudentId(null)}>Cancel</button>
                                                    <button className="btn-danger" onClick={handleDeleteStudent}>Delete</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </main>
        </>
    );
}
