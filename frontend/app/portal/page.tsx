"use client"

import { useEffect, useMemo, useState } from "react"

type ResultRecord = {
  id: string
  student: string
  admissionNumber: string
  classLevel: string
  term: string
  subject: string
  score: string
  grade: string
  remarks: string
  date: string
}

interface LoggedInStaff {
  name: string
  role: string
  subjects: string[]
}

const CLASS_LEVELS = ["Nursery 1", "Nursery 2", "Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6"]
const TERMS = ["First Term", "Second Term", "Third Term"]

function getGrade(score: string): string {
  const n = parseFloat(score)
  if (isNaN(n)) return "-"
  if (n >= 75) return "A"
  if (n >= 60) return "B"
  if (n >= 50) return "C"
  if (n >= 40) return "D"
  return "F"
}

function gradeColor(g: string) {
  return ({ A: "#1D9E75", B: "#5DCAA5", C: "#BA7517", D: "#D85A30", F: "#C0392B" }[g] ?? "#888780")
}

function gradeLabel(g: string) {
  return ({ A: "Excellent", B: "Good", C: "Average", D: "Below Average", F: "Fail" }[g] ?? "—")
}

function scorePct(score: string) { return Math.min(100, Math.max(0, parseFloat(score) || 0)) }

function exportCSV(results: ResultRecord[]) {
  const header = ["Student", "Admission No.", "Class", "Term", "Subject", "Score", "Grade", "Remarks", "Date"]
  const csv = [header, ...results.map(r => [r.student, r.admissionNumber, r.classLevel, r.term, r.subject, r.score, r.grade, r.remarks, r.date])]
    .map(row => row.map(v => `"${v}"`).join(",")).join("\n")
  const a = document.createElement("a")
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
  a.download = `DK-Results-${Date.now()}.csv`
  a.click()
}

function printResults(results: ResultRecord[], title: string) {
  const w = window.open("", "_blank")
  if (!w) return
  w.document.write(`<!DOCTYPE html><html><head><title>${title}</title>
  <style>
    body{font-family:Arial,sans-serif;padding:2rem;color:#222}
    h1{color:#1D9E75;margin-bottom:4px} .sub{color:#888;font-size:14px;margin-bottom:1.5rem}
    table{width:100%;border-collapse:collapse;margin-top:1rem}
    th{background:#1D9E75;color:#fff;padding:10px 12px;text-align:left;font-size:13px}
    td{padding:9px 12px;border-bottom:1px solid #eee;font-size:13px}
    tr:nth-child(even){background:#F9F9F6}
    .A{color:#1D9E75;font-weight:800}.B{color:#5DCAA5;font-weight:800}
    .C{color:#BA7517;font-weight:800}.D{color:#D85A30;font-weight:800}.F{color:#C0392B;font-weight:800}
    .footer{margin-top:2rem;font-size:12px;color:#aaa;border-top:1px solid #eee;padding-top:1rem}
  </style></head><body>
  <h1>Delightsome Kids School</h1>
  <p class="sub">${title} - Generated ${new Date().toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
  <table><thead><tr><th>#</th><th>Student</th><th>Adm. No.</th><th>Class</th><th>Term</th><th>Subject</th><th>Score</th><th>Grade</th><th>Remarks</th></tr></thead>
  <tbody>${results.map((r, i) => `<tr><td>${i + 1}</td><td><b>${r.student}</b></td><td>${r.admissionNumber}</td><td>${r.classLevel}</td><td>${r.term}</td><td>${r.subject}</td><td>${r.score}</td><td class="${r.grade}">${r.grade}</td><td>${r.remarks}</td></tr>`).join("")}</tbody></table>
  <div class="footer">Delightsome Kids School - Itori, Ogun State</div>
  </body></html>`)
  w.document.close(); w.print()
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [el, setEl] = useState<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.08 })
    obs.observe(el); return () => obs.disconnect()
  }, [el])
  return <div ref={setEl} style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)", transition: `opacity .65s ease ${delay}ms, transform .65s ease ${delay}ms` }}>{children}</div>
}

type Screen = "home" | "staff" | "student"

export default function PortalPage() {
  const [screen, setScreen] = useState<Screen>("home")
  const [allResults, setAllResults] = useState<ResultRecord[]>([])
  const [subjects, setSubjects] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  function fetchResults() {
    setLoading(true)
    fetch("/api/get_results")
      .then(r => r.json())
      .then(r => setAllResults(r))
      .catch(() => setAllResults([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetch("/api/get_subjects")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setSubjects(data)
      })
      .catch(err => console.error("Error fetching subjects:", err))
  }, [])

  return (
    <>
      <style>{CSS}</style>
      <section className="pk-hero">
        <div className="pk-hero-dots" />
        <div className="pk-hero-inner">
          <div className="pk-badge">Delightsome Kids School</div>
          <h1>School <em>Portal</em></h1>
          <p>Students check results. Staff log and manage records.</p>
        </div>
      </section>
      <div className="pk-shell">
        {screen === "home" && <HomeScreen onSelect={s => { setScreen(s); fetchResults() }} />}
        {screen === "staff" && <StaffPortal results={allResults} loading={loading} subjects={subjects} onRefresh={fetchResults} onBack={() => setScreen("home")} />}
        {screen === "student" && <StudentPortal results={allResults} loading={loading} onBack={() => setScreen("home")} />}
      </div>
    </>
  )
}

// HOME
function HomeScreen({ onSelect }: { onSelect: (s: Screen) => void }) {
  return (
    <div className="pk-home">
      <Reveal>
        <p className="pk-section-label">Welcome</p>
        <h2 className="pk-section-title">Who are <span>you?</span></h2>
        <p className="pk-section-body">Select your portal to continue.</p>
      </Reveal>
      <div className="pk-role-grid">
        <Reveal delay={80}>
          <button className="pk-role-card pk-role-student" onClick={() => onSelect("student")}>
            <div className="pk-role-icon">Student Portal</div>
            <h3>Student</h3>
            <p>Check your results using your admission number.</p>
            <div className="pk-role-arrow pk-arrow-teal">Enter portal -{">"}</div>
          </button>
        </Reveal>
        <Reveal delay={140}>
          <button className="pk-role-card pk-role-staff" onClick={() => onSelect("staff")}>
            <div className="pk-role-icon">Staff Portal</div>
            <h3>Staff</h3>
            <p>Log student results, manage records, and export reports.</p>
            <div className="pk-role-arrow pk-arrow-coral">Enter portal -{">"}</div>
          </button>
        </Reveal>
      </div>
    </div>
  )
}

// STUDENT PORTAL
function StudentPortal({ results, loading, onBack }: { results: ResultRecord[]; loading: boolean; onBack: () => void }) {
  const [studentResults, setStudentResults] = useState<ResultRecord[]>([]);
  const [admNo, setAdmNo] = useState("")
  const [error, setError] = useState("")
  const [loggedIn, setLoggedIn] = useState(false)
  const [filterTerm, setFilterTerm] = useState("")
  const [studentLoading, setStudentLoading] = useState(false)

  function login(e: React.FormEvent) {
    e.preventDefault()
    if (!admNo.trim()) { setError("Please enter your admission number"); return }

    setStudentLoading(true)
    setError("")

    fetch(`/api/get_results?adm=${encodeURIComponent(admNo.trim())}`)
      .then(r => r.json())
      .then(data => {
        const fetched = Array.isArray(data) ? data : []
        if (fetched.length === 0) {
          setError("No results found for this admission number. Please check and try again, or contact your class teacher.")
          setStudentLoading(false)
          return
        }
        setStudentResults(fetched);
        setLoggedIn(true);
        setStudentLoading(false);
      })
      .catch(err => {
        console.error(err)
        setError("Error fetching results. Please try again.")
        setStudentLoading(false)
      })
  }

  const myResults = useMemo(() =>
    (Array.isArray(studentResults) ? studentResults : []).filter(r =>
      (!filterTerm || r.term === filterTerm)
    ), [studentResults, filterTerm])

  const myInfo = (Array.isArray(studentResults) ? studentResults : []).find(r => r.admissionNumber.toLowerCase() === admNo.trim().toLowerCase())
  const avgScore = myResults.length ? (myResults.reduce((s, r) => s + (parseFloat(r.score) || 0), 0) / myResults.length).toFixed(1) : "—"
  const bestSubject = myResults.length ? [...myResults].sort((a, b) => parseFloat(b.score) - parseFloat(a.score))[0] : null

  return (
    <div className="pk-portal-wrap">
      {!loggedIn ? (
        <Reveal>
          <button className="pk-back-btn" onClick={onBack}>Back to Home</button>
          <div className="pk-login-card">
            <h2>Student Result Check</h2>
            <p className="pk-login-sub">Enter your admission number to view your results</p>
            <form onSubmit={login}>
              <input className="pk-login-input" type="text" placeholder="e.g. DKS/2024/001"
                value={admNo} onChange={e => { setAdmNo(e.target.value); setError("") }} autoFocus disabled={studentLoading} />
              {error && <p className="pk-login-error">{error}</p>}
              <button className="pk-login-btn pk-btn-teal" type="submit" disabled={studentLoading || !admNo.trim()}>
                {studentLoading ? "Checking..." : "Check My Results"}
              </button>
            </form>
            <p className="pk-login-hint">Your admission number is on your school ID card or report card.</p>
          </div>
        </Reveal>
      ) : (
        <>
          <Reveal>
            <div className="pk-topbar">
              <div>
                <p className="pk-welcome-name">{myInfo?.student}</p>
                <p className="pk-welcome-meta">{myInfo?.classLevel} · {admNo.toUpperCase()}</p>
              </div>
              <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap" }}>
                <button className="pk-btn pk-btn-outline" onClick={() => printResults(myResults, `${myInfo?.student} Results`)}>Print</button>
                <button className="pk-btn pk-btn-outline" onClick={() => { setLoggedIn(false); setAdmNo(""); setError("") }}>Switch</button>
                <button className="pk-btn pk-btn-outline" onClick={onBack}>Home</button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={50}>
            <div className="pk-term-tabs">
              {["", ...TERMS].map(t => (
                <button key={t} className={`pk-term-tab${filterTerm === t ? " active" : ""}`} onClick={() => setFilterTerm(t)}>
                  {t || "All Terms"}
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="pk-student-stats">
              <div className="pk-sstat">
                <span className="pk-sstat-num" style={{ color: "#1D9E75" }}>{myResults.length}</span>
                <span className="pk-sstat-label">Subjects</span>
              </div>
              <div className="pk-sstat">
                <span className="pk-sstat-num" style={{ color: "#7F77DD" }}>{avgScore}</span>
                <span className="pk-sstat-label">Average Score</span>
              </div>
              <div className="pk-sstat">
                <span className="pk-sstat-num" style={{ color: "#D85A30", fontSize: "1.4rem" }}>{bestSubject?.subject?.split(" ")[0] ?? "—"}</span>
                <span className="pk-sstat-label">Best Subject</span>
              </div>
              <div className="pk-sstat">
                <span className="pk-sstat-num" style={{ color: gradeColor(getGrade(avgScore)) }}>
                  {avgScore === "—" ? "—" : getGrade(avgScore)}
                </span>
                <span className="pk-sstat-label">Overall Grade</span>
              </div>
            </div>
          </Reveal>

          {loading ? <div className="pk-loading">Loading results...</div> :
            myResults.length === 0 ? (
              <div className="pk-empty"><p>No results for {filterTerm || "this period"} yet.</p></div>
            ) : (
              <div className="pk-student-results">
                {myResults.map((r, i) => (
                  <Reveal key={r.id} delay={i * 50}>
                    <div className="pk-student-card">
                      <div className="pk-sc-left">
                        <p className="pk-sc-subject">{r.subject}</p>
                        <p className="pk-sc-meta">{r.term} · {r.classLevel} · {r.date}</p>
                        <p className="pk-sc-remarks">"{r.remarks}"</p>
                      </div>
                      <div className="pk-sc-right">
                        <span className="pk-sc-score" style={{ color: gradeColor(r.grade) }}>{r.score}<small>/100</small></span>
                        <div className="pk-sc-bar"><div style={{ width: `${scorePct(r.score)}%`, background: gradeColor(r.grade) }} /></div>
                        <span className="pk-sc-grade" style={{ background: gradeColor(r.grade) + "22", color: gradeColor(r.grade) }}>
                          {r.grade} — {gradeLabel(r.grade)}
                        </span>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            )
          }
        </>
      )}
    </div>
  )
}

// STAFF PORTAL
function StaffPortal({ results, loading, subjects, onRefresh, onBack }: { results: ResultRecord[]; loading: boolean; subjects: string[]; onRefresh: () => void; onBack: () => void }) {
  const [staffNo, setStaffNo] = useState("")
  const [error, setError] = useState("")
  const [loggedIn, setLoggedIn] = useState(false)
  const [validating, setValidating] = useState(false)
  const [currentStaff, setCurrentStaff] = useState<LoggedInStaff | null>(null)
  const [tab, setTab] = useState<"view" | "log">("view")
  const [filter, setFilter] = useState({ search: "", classLevel: "", term: "", subject: "", grade: "" })
  const [form, setForm] = useState({ student: "", admissionNumber: "", classLevel: "Primary 1", term: "First Term", subject: "", score: "", remarks: "" })
  const [formErrors, setFormErrors] = useState<Partial<typeof form>>({})
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"date" | "name" | "score">("date")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")

  async function login(e: React.FormEvent) {
    e.preventDefault()
    if (!staffNo.trim()) { setError("Enter your staff number"); return }
    setValidating(true)
    try {
      const res = await fetch("/api/validate_staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffNumber: staffNo.trim().toUpperCase() })
      })
      const data = await res.json()
      if (data.valid) {
        setCurrentStaff({
          name: data.name,
          role: data.role,
          subjects: data.subjects || []
        });
        // Auto-select the first subject they teach as default when logging result
        if (data.subjects && data.subjects.length > 0) {
          setForm(prev => ({ ...prev, subject: data.subjects[0] }));
        }
        setLoggedIn(true)
      } else {
        setError("Invalid staff number. Contact admin if you need access.")
      }
    } catch (err) {
      console.error(err)
      setError("Error validating staff number. Please try again.")
    } finally {
      setValidating(false)
    }
  }

  // Filter records to ONLY show subjects taught by the staff member
  const staffResults = useMemo(() => {
    return (Array.isArray(results) ? results : []).filter(r =>
      currentStaff ? currentStaff.subjects.some(sub => sub.toLowerCase() === r.subject.toLowerCase()) : true
    );
  }, [results, currentStaff]);

  const filtered = useMemo(() => {
    const list = staffResults.filter(r =>
      (!filter.search || r.student.toLowerCase().includes(filter.search.toLowerCase()) || r.admissionNumber.toLowerCase().includes(filter.search.toLowerCase())) &&
      (!filter.classLevel || r.classLevel === filter.classLevel) &&
      (!filter.term || r.term === filter.term) &&
      (!filter.subject || r.subject === filter.subject) &&
      (!filter.grade || r.grade === filter.grade)
    );
    return [...list].sort((a, b) => {
      const cmp = sortBy === "name" ? a.student.localeCompare(b.student) :
        sortBy === "score" ? parseFloat(a.score) - parseFloat(b.score) :
          new Date(a.date).getTime() - new Date(b.date).getTime();
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [staffResults, filter, sortBy, sortDir]);

  const summary = useMemo(() => {
    const total = staffResults.length
    const avg = total ? (staffResults.reduce((s, r) => s + (parseFloat(r.score) || 0), 0) / total).toFixed(1) : "—"
    const grades = staffResults.reduce<Record<string, number>>((a, r) => { a[r.grade] = (a[r.grade] || 0) + 1; return a }, {})
    const topStudents = Object.entries(
      staffResults.reduce<Record<string, { scores: number[]; adm: string }>>((a, r) => {
        if (!a[r.student]) a[r.student] = { scores: [], adm: r.admissionNumber }
        a[r.student].scores.push(parseFloat(r.score) || 0); return a
      }, {})
    ).map(([name, d]) => ({ name, adm: d.adm, avg: d.scores.reduce((s, n) => s + n, 0) / d.scores.length }))
      .sort((a, b) => b.avg - a.avg).slice(0, 5)
    return { total, avg, grades, topStudents }
  }, [staffResults])

  function validateForm() {
    const e: Partial<typeof form> = {}
    if (!form.student.trim()) e.student = "Required"
    if (!form.admissionNumber.trim()) e.admissionNumber = "Required"
    if (!form.subject.trim()) {
      e.subject = "Required"
    } else if (currentStaff && !currentStaff.subjects.some(sub => sub.toLowerCase() === form.subject.trim().toLowerCase())) {
      e.subject = "You are not linked to this subject"
    }
    const s = parseFloat(form.score)
    if (!form.score.trim() || isNaN(s) || s < 0 || s > 100) e.score = "0–100 only"
    return e
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const errs = validateForm()
    if (Object.keys(errs).length) { setFormErrors(errs); return }
    setFormErrors({}); setSaving(true)
    const rec: ResultRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      student: form.student.trim(),
      admissionNumber: form.admissionNumber.trim().toUpperCase(),
      classLevel: form.classLevel, term: form.term,
      subject: form.subject.trim(), score: form.score.trim(),
      grade: getGrade(form.score),
      remarks: form.remarks.trim() || "—",
      date: new Date().toLocaleDateString("en-NG"),
    }
    try {
      const res = await fetch("/api/save_result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rec)
      })
      if (!res.ok) throw new Error(res.statusText)
      onRefresh()
      setSaveMsg("Result saved successfully!")
      setForm({
        student: "",
        admissionNumber: "",
        classLevel: "Primary 1",
        term: "First Term",
        subject: currentStaff && currentStaff.subjects.length > 0 ? currentStaff.subjects[0] : "",
        score: "",
        remarks: ""
      })
      setTab("view")
    } catch { setSaveMsg("Save failed — check database connection") }
    setSaving(false)
    setTimeout(() => setSaveMsg(""), 3500)
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch("/api/delete_result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      })
      if (!res.ok) throw new Error(res.statusText)
      onRefresh()
    } catch { }
    setDeleteId(null)
  }

  const inp: React.CSSProperties = { fontFamily: "inherit", width: "100%", border: "2px solid #E8E6DE", borderRadius: 12, padding: "11px 14px", fontSize: 14, background: "#FAFAF7", color: "#2C2C2A", outline: "none" }

  return (
    <div className="pk-portal-wrap">
      {saveMsg && <div className="pk-toast">{saveMsg}</div>}
      {deleteId && (
        <div className="pk-overlay">
          <div className="pk-confirm">
            <h3>Delete this result?</h3>
            <p>This cannot be undone.</p>
            <div style={{ display: "flex", gap: ".75rem", justifyContent: "center", marginTop: "1.5rem" }}>
              <button className="pk-btn pk-btn-outline" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="pk-btn pk-btn-coral" onClick={() => handleDelete(deleteId)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {!loggedIn ? (
        <Reveal>
          <button className="pk-back-btn" onClick={onBack}>Back to Home</button>
          <div className="pk-login-card">
            <h2>Staff Login</h2>
            <p className="pk-login-sub">Enter your staff number to access the management portal</p>
            <form onSubmit={login}>
              <input className="pk-login-input" type="text" placeholder="e.g. STF0001"
                value={staffNo} onChange={e => { setStaffNo(e.target.value); setError("") }} autoFocus disabled={validating} />
              {error && <p className="pk-login-error">{error}</p>}
              <button className="pk-login-btn pk-btn-coral" type="submit" disabled={validating}>{validating ? "Validating…" : "Enter Staff Portal"}</button>
            </form>
            <p className="pk-login-hint">Staff numbers are assigned by the school admin.</p>
          </div>
        </Reveal>
      ) : (
        <>
          <Reveal>
            <div className="pk-topbar">
              <div>
                <p className="pk-welcome-name">Staff: {currentStaff?.name || staffNo.toUpperCase()}</p>
                <p className="pk-welcome-meta">Taught Subjects: {currentStaff?.subjects.join(", ") || "None"}</p>
              </div>
              <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap" }}>
                <button className="pk-btn pk-btn-yellow" onClick={() => exportCSV(filtered)}>Export CSV</button>
                <button className="pk-btn pk-btn-teal" onClick={() => printResults(filtered, "My Student Results")}>Print Report</button>
                <button className="pk-btn pk-btn-outline" onClick={() => { setLoggedIn(false); setStaffNo(""); setCurrentStaff(null); }}>Logout</button>
                <button className="pk-btn pk-btn-outline" onClick={onBack}>Home</button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={60}>
            <div className="pk-staff-stats">
              {[
                { n: summary.total, l: "Total Records", c: "#1D9E75" },
                { n: summary.avg, l: "Avg Score", c: "#7F77DD" },
                { n: summary.grades["A"] || 0, l: "Grade A's", c: "#1D9E75" },
                { n: summary.grades["F"] || 0, l: "Failing", c: "#D85A30" },
                { n: new Set(staffResults.map(r => r.admissionNumber)).size, l: "Students", c: "#FAC775" },
              ].map(s => (
                <div key={s.l} className="pk-sstat">
                  <span className="pk-sstat-num" style={{ color: s.c }}>{s.n}</span>
                  <span className="pk-sstat-label">{s.l}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="pk-tabs">
              <button className={`pk-tab${tab === "view" ? " active" : ""}`} onClick={() => setTab("view")}>View Records</button>
              <button className={`pk-tab${tab === "log" ? " active" : ""}`} onClick={() => setTab("log")}>Log New Result</button>
            </div>
          </Reveal>

          {tab === "log" && (
            <Reveal>
              <div className="pk-card">
                <p className="pk-card-title">Log New Result</p>
                <form onSubmit={handleAdd}>
                  <div className="pk-form-grid">
                    <div className="pk-field">
                      <label>Student Full Name *</label>
                      <input style={{ ...inp, borderColor: formErrors.student ? "#D85A30" : "#E8E6DE" }}
                        placeholder="e.g. Mary Johnson" value={form.student}
                        onChange={e => setForm(p => ({ ...p, student: e.target.value }))} />
                      {formErrors.student && <span className="pk-field-err">{formErrors.student}</span>}
                    </div>
                    <div className="pk-field">
                      <label>Admission Number *</label>
                      <input style={{ ...inp, borderColor: formErrors.admissionNumber ? "#D85A30" : "#E8E6DE" }}
                        placeholder="e.g. DKS/2024/001" value={form.admissionNumber}
                        onChange={e => setForm(p => ({ ...p, admissionNumber: e.target.value }))} />
                      {formErrors.admissionNumber && <span className="pk-field-err">{formErrors.admissionNumber}</span>}
                    </div>
                    <div className="pk-field">
                      <label>Class Level</label>
                      <select style={inp} value={form.classLevel} onChange={e => setForm(p => ({ ...p, classLevel: e.target.value }))}>
                        {CLASS_LEVELS.map(l => <option key={l}>{l}</option>)}
                      </select>
                    </div>
                    <div className="pk-field">
                      <label>Term</label>
                      <select style={inp} value={form.term} onChange={e => setForm(p => ({ ...p, term: e.target.value }))}>
                        {TERMS.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="pk-field">
                      <label>Subject *</label>
                      {currentStaff && currentStaff.subjects.length > 0 ? (
                        <select style={{ ...inp, borderColor: formErrors.subject ? "#D85A30" : "#E8E6DE" }}
                          value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}>
                          {currentStaff.subjects.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      ) : (
                        <input style={{ ...inp, borderColor: formErrors.subject ? "#D85A30" : "#E8E6DE" }}
                          list="dk-subj" placeholder="e.g. Mathematics" value={form.subject}
                          onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} />
                      )}
                      <datalist id="dk-subj">{subjects.map(s => <option key={s} value={s} />)}</datalist>
                      {formErrors.subject && <span className="pk-field-err">{formErrors.subject}</span>}
                    </div>
                    <div className="pk-field">
                      <label>Score (0–100) *</label>
                      <input style={{ ...inp, borderColor: formErrors.score ? "#D85A30" : "#E8E6DE" }}
                        type="number" min="0" max="100" placeholder="e.g. 85" value={form.score}
                        onChange={e => setForm(p => ({ ...p, score: e.target.value }))} />
                      {form.score && !formErrors.score && (
                        <span style={{ fontSize: 12, fontWeight: 800, color: gradeColor(getGrade(form.score)) }}>Grade: {getGrade(form.score)}</span>
                      )}
                      {formErrors.score && <span className="pk-field-err">{formErrors.score}</span>}
                    </div>
                    <div className="pk-field" style={{ gridColumn: "1/-1" }}>
                      <label>Remarks</label>
                      <input style={inp} placeholder="e.g. Excellent effort" value={form.remarks}
                        onChange={e => setForm(p => ({ ...p, remarks: e.target.value }))} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: ".75rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
                    <button className="pk-btn pk-btn-teal" type="submit" disabled={saving}>{saving ? "Saving..." : "Save Result"}</button>
                    <button className="pk-btn pk-btn-outline" type="button" onClick={() => setTab("view")}>Cancel</button>
                  </div>
                </form>
              </div>
            </Reveal>
          )}

          {tab === "view" && (
            <>
              <Reveal>
                <div className="pk-card">
                  <p className="pk-card-title">Filter Records</p>
                  <div className="pk-filters">
                    <div style={{ position: "relative" }}>
                      <input style={{ border: "2px solid #E8E6DE", borderRadius: 999, padding: "8px 16px 8px 16px", fontFamily: "inherit", fontSize: 13, fontWeight: 700, outline: "none", width: 200 }}
                        placeholder="Search name or adm. no."
                        value={filter.search} onChange={e => setFilter(p => ({ ...p, search: e.target.value }))} />
                    </div>
                    {[
                      { key: "classLevel", opts: ["All Classes", ...CLASS_LEVELS] },
                      { key: "term", opts: ["All Terms", ...TERMS] },
                      { key: "subject", opts: ["All Subjects", ...(currentStaff ? currentStaff.subjects : subjects)] },
                      { key: "grade", opts: ["All Grades", "A", "B", "C", "D", "F"] },
                    ].map(f => (
                      <select key={f.key} style={{ border: "2px solid #E8E6DE", borderRadius: 999, padding: "8px 14px", fontFamily: "inherit", fontSize: 13, fontWeight: 700, background: "#fff", color: "#2C2C2A", outline: "none", cursor: "pointer" }}
                        value={filter[f.key as keyof typeof filter]}
                        onChange={e => setFilter(p => ({ ...p, [f.key]: e.target.value.startsWith("All") ? "" : e.target.value }))}>
                        {f.opts.map(o => <option key={o}>{o}</option>)}
                      </select>
                    ))}
                    {Object.values(filter).some(Boolean) && (
                      <button style={{ fontFamily: "inherit", fontSize: 12, fontWeight: 800, color: "#D85A30", background: "none", border: "none", cursor: "pointer" }}
                        onClick={() => setFilter({ search: "", classLevel: "", term: "", subject: "", grade: "" })}>Clear all</button>
                    )}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={60}>
                <div className="pk-card">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#888780" }}>{filtered.length} record{filtered.length !== 1 ? "s" : ""}</span>
                    <div style={{ display: "flex", gap: ".4rem" }}>
                      {(["date", "name", "score"] as const).map(s => (
                        <button key={s} onClick={() => { if (sortBy === s) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortBy(s); setSortDir("desc") } }}
                          style={{ fontFamily: "inherit", fontSize: 12, fontWeight: 800, border: "1.5px solid", borderRadius: 999, padding: "5px 14px", cursor: "pointer", background: sortBy === s ? "#2C2C2A" : "#fff", color: sortBy === s ? "#fff" : "#888780", borderColor: sortBy === s ? "#2C2C2A" : "#E8E6DE" }}>
                          {s} {sortBy === s ? (sortDir === "asc" ? "↑" : "↓") : ""}
                        </button>
                      ))}
                    </div>
                  </div>
                  {loading ? <div className="pk-loading">Loading...</div> :
                    filtered.length === 0 ? <div className="pk-empty"><p>No records found.</p></div> :
                      <div style={{ display: "flex", flexDirection: "column", gap: ".65rem" }}>
                        {filtered.map((r, i) => (
                          <Reveal key={r.id} delay={i * 20}>
                            <div className="pk-record-row">
                              <div>
                                <span className="pk-rr-name">{r.student}</span>
                                <span className="pk-rr-meta">{r.admissionNumber} · {r.classLevel} · {r.term}</span>
                              </div>
                              <div className="pk-rr-subject">{r.subject}</div>
                              <div>
                                <span className="pk-rr-score" style={{ color: gradeColor(r.grade) }}>{r.score}</span>
                                <div className="pk-rr-bar"><div style={{ width: `${scorePct(r.score)}%`, background: gradeColor(r.grade) }} /></div>
                              </div>
                              <span className="pk-rr-grade" style={{ background: gradeColor(r.grade) + "22", color: gradeColor(r.grade) }}>{r.grade}</span>
                              <button className="pk-del" onClick={() => setDeleteId(r.id)}>Delete</button>
                            </div>
                          </Reveal>
                        ))}
                      </div>
                  }
                </div>
              </Reveal>

              {staffResults.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <Reveal delay={80}>
                    <div className="pk-card">
                      <p className="pk-card-title">Top 5 Students</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
                        {summary.topStudents.map((s, i) => (
                          <div key={s.name} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: ".75rem 1rem", borderRadius: 12, background: "#F1EFE8" }}>
                            <span style={{ fontFamily: "'Fredoka One',cursive", fontSize: "1.1rem", width: 28, textAlign: "center", flexShrink: 0 }}>{["1st", "2nd", "3rd", "4th", "5th"][i]}</span>
                            <div style={{ flex: 1 }}>
                              <span style={{ fontWeight: 800, fontSize: 14, display: "block" }}>{s.name}</span>
                              <span style={{ fontSize: 11, color: "#888780" }}>{s.adm}</span>
                            </div>
                            <span style={{ fontFamily: "'Fredoka One',cursive", fontSize: "1.1rem", color: "#1D9E75" }}>{s.avg.toFixed(1)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                  <Reveal delay={120}>
                    <div className="pk-card">
                      <p className="pk-card-title">Grade Breakdown</p>
                      <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
                        {["A", "B", "C", "D", "F"].map(g => (
                          <div key={g} style={{ flex: 1, minWidth: 55, background: "#F1EFE8", borderRadius: 12, padding: ".9rem .5rem", textAlign: "center" }}>
                            <span style={{ fontFamily: "'Fredoka One',cursive", fontSize: "1.6rem", color: gradeColor(g), display: "block" }}>{g}</span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#888780" }}>{summary.grades[g] || 0}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Nunito', sans-serif; background: #F1EFE8; color: #2C2C2A; overflow-x: hidden; }

  .pk-hero { background: linear-gradient(145deg, #085041 0%, #1D9E75 55%, #5DCAA5 100%); padding: 5.5rem 2rem 4rem; position: relative; overflow: hidden; }
  .pk-hero-dots { position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(circle,rgba(255,255,255,0.09) 1px,transparent 1px);background-size:28px 28px; }
  .pk-badge { display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);border-radius:999px;padding:5px 18px;font-size:12px;font-weight:700;color:#fff;letter-spacing:.08em;margin-bottom:1.25rem;backdrop-filter:blur(6px); }
  .pk-hero h1 { font-family:'Fredoka One',cursive;font-size:clamp(2rem,5vw,3.6rem);color:#fff;line-height:1.1;margin-bottom:.75rem; }
  .pk-hero h1 em { font-style:normal;color:#FAC775; }
  .pk-hero p { font-size:15px;color:rgba(255,255,255,.8);max-width:520px;line-height:1.75; }
  .pk-hero-inner { max-width:1100px;margin:0 auto; }
  .pk-shell { max-width:1100px;margin:0 auto;padding:2.5rem 1.5rem 5rem; }

  .pk-home { }
  .pk-section-label { font-size:12px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#1D9E75;margin-bottom:.5rem; }
  .pk-section-title { font-family:'Fredoka One',cursive;font-size:clamp(1.8rem,4vw,2.8rem);color:#2C2C2A;margin-bottom:.75rem; }
  .pk-section-title span { color:#D85A30; }
  .pk-section-body { font-size:15px;color:#888780;margin-bottom:2.5rem; }
  .pk-role-grid { display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;max-width:680px; }
  @media(max-width:560px){ .pk-role-grid { grid-template-columns:1fr; } }
  .pk-role-card { background:#fff;border-radius:24px;padding:2.5rem 2rem;border:2px solid #E8E6DE;cursor:pointer;text-align:left;transition:transform .25s,box-shadow .25s,border-color .25s;width:100%; }
  .pk-role-card:hover { transform:translateY(-6px);box-shadow:0 20px 50px rgba(0,0,0,.1); }
  .pk-role-student:hover { border-color:#1D9E75; }
  .pk-role-staff:hover { border-color:#D85A30; }
  .pk-role-icon { font-size:1.5rem;font-weight:800;color:#1D9E75;margin-bottom:1rem; }
  .pk-role-card h3 { font-family:'Fredoka One',cursive;font-size:1.4rem;color:#2C2C2A;margin-bottom:.5rem; }
  .pk-role-card p { font-size:14px;color:#888780;line-height:1.65;margin-bottom:1.25rem; }
  .pk-role-arrow { font-size:13px;font-weight:800; }
  .pk-arrow-teal { color:#1D9E75; }
  .pk-arrow-coral { color:#D85A30; }

  .pk-login-card { background:#fff;border-radius:24px;padding:3rem 2.5rem;border:1.5px solid #E8E6DE;box-shadow:0 16px 60px rgba(0,0,0,.08);max-width:420px;margin:1.5rem auto 0;text-align:center; }
  .pk-login-card h2 { font-family:'Fredoka One',cursive;font-size:1.8rem;color:#2C2C2A;margin-bottom:.4rem; }
  .pk-login-sub { font-size:14px;color:#888780;margin-bottom:1.75rem; }
  .pk-login-input { font-family:inherit;width:100%;border:2px solid #E8E6DE;border-radius:12px;padding:13px 16px;font-size:15px;background:#FAFAF7;color:#2C2C2A;outline:none;text-align:center;display:block;transition:border-color .2s;margin-bottom:4px; }
  .pk-login-input:focus { border-color:#1D9E75; }
  .pk-login-btn { margin-top:1rem;width:100%;font-family:'Nunito',sans-serif;font-weight:800;font-size:15px;border:none;border-radius:999px;padding:13px;cursor:pointer;transition:transform .15s,box-shadow .15s; }
  .pk-login-error { font-size:13px;color:#D85A30;font-weight:700;margin-top:.75rem; }
  .pk-login-hint { font-size:12px;color:#B4B2A9;margin-top:1.25rem;line-height:1.6; }
  .pk-back-btn { font-family:'Nunito',sans-serif;font-weight:800;font-size:13px;color:#888780;background:none;border:none;cursor:pointer;padding:0;margin-bottom:1.25rem;display:block;transition:color .2s; }
  .pk-back-btn:hover { color:#1D9E75; }

  .pk-portal-wrap { }
  .pk-topbar { display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:1.75rem; }
  .pk-welcome-name { font-family:'Fredoka One',cursive;font-size:1.3rem;color:#2C2C2A;margin-bottom:2px; }
  .pk-welcome-meta { font-size:13px;color:#888780;font-weight:600; }
  .pk-card { background:#fff;border-radius:20px;padding:2rem;border:1.5px solid #E8E6DE;margin-bottom:1.5rem; }
  .pk-card-title { font-family:'Fredoka One',cursive;font-size:1.2rem;color:#2C2C2A;margin-bottom:1.4rem; }
  .pk-tabs { display:flex;gap:.5rem;background:#fff;border-radius:999px;padding:5px;border:1.5px solid #E8E6DE;width:fit-content;margin-bottom:1.75rem; }
  .pk-tab { font-family:'Nunito',sans-serif;font-weight:800;font-size:13px;border:none;border-radius:999px;padding:8px 20px;cursor:pointer;background:transparent;color:#888780;transition:background .2s,color .2s; }
  .pk-tab.active { background:#1D9E75;color:#fff; }
  .pk-btn { font-family:'Nunito',sans-serif;font-weight:800;font-size:13px;border:none;border-radius:999px;padding:9px 18px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:transform .15s,box-shadow .15s; }
  .pk-btn-teal { background:#1D9E75;color:#fff;box-shadow:0 3px 0 #0F6E56; }
  .pk-btn-teal:hover { transform:translateY(-2px);box-shadow:0 5px 0 #0F6E56; }
  .pk-btn-coral { background:#D85A30;color:#fff;box-shadow:0 3px 0 #993C1D; }
  .pk-btn-coral:hover { transform:translateY(-2px);box-shadow:0 5px 0 #993C1D; }
  .pk-btn-yellow { background:#FAC775;color:#2C2C2A;box-shadow:0 3px 0 #BA7517; }
  .pk-btn-yellow:hover { transform:translateY(-2px);box-shadow:0 5px 0 #BA7517; }
  .pk-btn-outline { background:#fff;color:#888780;border:1.5px solid #E8E6DE; }
  .pk-btn-outline:hover { border-color:#1D9E75;color:#1D9E75; }

  .pk-student-stats, .pk-staff-stats { display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:1rem;margin-bottom:1.75rem; }
  .pk-sstat { background:#fff;border-radius:18px;padding:1.3rem 1rem;border:1.5px solid #E8E6DE;text-align:center; }
  .pk-sstat-num { font-family:'Fredoka One',cursive;font-size:2.2rem;display:block;line-height:1;margin-bottom:3px; }
  .pk-sstat-label { font-size:11px;font-weight:700;color:#888780;text-transform:uppercase;letter-spacing:.1em; }

  .pk-term-tabs { display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:1.5rem; }
  .pk-term-tab { font-family:'Nunito',sans-serif;font-weight:800;font-size:13px;border:2px solid #E8E6DE;border-radius:999px;padding:7px 18px;cursor:pointer;background:#fff;color:#888780;transition:all .18s; }
  .pk-term-tab.active { background:#1D9E75;color:#fff;border-color:#1D9E75; }

  .pk-student-results { display:flex;flex-direction:column;gap:1rem; }
  .pk-student-card { background:#fff;border-radius:20px;padding:1.5rem 1.75rem;border:1.5px solid #E8E6DE;display:flex;align-items:center;gap:2rem;transition:transform .2s,box-shadow .2s; }
  .pk-student-card:hover { transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,.07); }
  @media(max-width:600px){ .pk-student-card { flex-direction:column;align-items:stretch;gap:1rem; } }
  .pk-sc-left { flex:1; }
  .pk-sc-subject { font-family:'Fredoka One',cursive;font-size:1.2rem;color:#2C2C2A;margin-bottom:4px; }
  .pk-sc-meta { font-size:12px;color:#888780;font-weight:600;margin-bottom:6px; }
  .pk-sc-remarks { font-size:13px;color:#5F5E5A;font-style:italic; }
  .pk-sc-right { text-align:right;flex-shrink:0;min-width:130px; }
  .pk-sc-score { font-family:'Fredoka One',cursive;font-size:2.2rem;display:block;line-height:1;margin-bottom:6px; }
  .pk-sc-score small { font-size:1rem;color:#B4B2A9; }
  .pk-sc-bar { height:5px;background:#E8E6DE;border-radius:4px;overflow:hidden;margin-bottom:8px; }
  .pk-sc-bar div { height:100%;border-radius:4px;transition:width .6s ease; }
  .pk-sc-grade { font-size:11px;font-weight:800;letter-spacing:.1em;padding:4px 12px;border-radius:999px;display:inline-block; }

  .pk-record-row { display:grid;grid-template-columns:2fr 1fr 1fr auto auto;gap:1rem;align-items:center;padding:1rem 1.25rem;border-radius:14px;border:1.5px solid #E8E6DE;background:#FAFAF7;transition:border-color .2s; }
  .pk-record-row:hover { border-color:#1D9E75; }
  @media(max-width:700px){ .pk-record-row { grid-template-columns:1fr 1fr;gap:.75rem; } }
  .pk-rr-name { font-weight:800;font-size:14px;display:block;margin-bottom:2px; }
  .pk-rr-meta { font-size:11px;color:#888780;font-weight:600; }
  .pk-rr-subject { font-size:13px;font-weight:700;color:#444441; }
  .pk-rr-score { font-family:'Fredoka One',cursive;font-size:1.3rem;display:block;margin-bottom:3px; }
  .pk-rr-bar { height:4px;background:#E8E6DE;border-radius:4px;overflow:hidden; }
  .pk-rr-bar div { height:100%;border-radius:4px; }
  .pk-rr-grade { font-size:11px;font-weight:800;padding:3px 12px;border-radius:999px; }
  .pk-del { background:#FEE2E2;color:#C0392B;border:none;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:800;cursor:pointer;transition:background .2s;font-family:inherit; }
  .pk-del:hover { background:#FECACA; }

  .pk-form-grid { display:grid;grid-template-columns:1fr 1fr;gap:1rem; }
  @media(max-width:600px){ .pk-form-grid { grid-template-columns:1fr; } }
  .pk-field { display:flex;flex-direction:column;gap:5px; }
  .pk-field label { font-size:13px;font-weight:800;color:#2C2C2A; }
  .pk-field-err { font-size:12px;color:#D85A30;font-weight:700; }
  .pk-filters { display:flex;flex-wrap:wrap;gap:.75rem;align-items:center; }

  .pk-empty { text-align:center;padding:3rem 1rem; }
  .pk-empty p { color:#888780;font-weight:700;font-size:15px; }
  .pk-loading { text-align:center;padding:2.5rem;color:#1D9E75;font-weight:700;font-size:15px; }
  .pk-toast { position:fixed;top:1.5rem;right:1.5rem;background:#1D9E75;color:#fff;font-weight:800;font-size:14px;padding:12px 24px;border-radius:999px;box-shadow:0 8px 24px rgba(29,158,117,.35);z-index:9998;animation:toastIn .3s ease; }
  @keyframes toastIn { from{opacity:0;transform:translateY(-14px)} to{opacity:1;transform:translateY(0)} }
  .pk-overlay { position:fixed;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(4px);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem; }
  .pk-confirm { background:#fff;border-radius:20px;padding:2.5rem;max-width:340px;width:100%;text-align:center; }
  .pk-confirm h3 { font-family:'Fredoka One',cursive;font-size:1.4rem;margin-bottom:.5rem;color:#2C2C2A; }
  .pk-confirm p { font-size:14px;color:#5F5E5A;margin-bottom:.5rem;line-height:1.6; }

  @media(max-width:600px){
    .pk-hero { padding:4rem 1.25rem 3rem; }
    .pk-shell { padding:1.5rem 1rem 4rem; }
    .pk-card { padding:1.5rem 1.25rem; }
    .pk-login-card { padding:2rem 1.5rem; }
  }
`