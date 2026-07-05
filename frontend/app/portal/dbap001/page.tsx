"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"

type ResultRecord = {
  id: string
  student: string
  classLevel: string
  term: string
  subject: string
  score: string
  remarks: string
  date: string
}

type Staff = {
  id: number
  name: string
  role: string
  email: string
  staff_number: string
  subjects?: string[]
}

const CLASS_LEVELS = ["Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6"]
const TERMS = ["First Term", "Second Term", "Third Term"]

export default function StudentResultPage() {
  const searchParams = useSearchParams()
  const admissionNumber = searchParams?.get("admissionNumber") ?? ""

  const [results, setResults] = useState<ResultRecord[]>([])
  const [subjects, setSubjects] = useState<string[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    student: "",
    classLevel: "Primary 1",
    term: "First Term",
    subject: "",
    score: "",
    remarks: "",
  })

  // Match the staff member by staff_number matching the admissionNumber query arg
  const currentStaff = useMemo(() => {
    if (!admissionNumber) return null
    return staff.find(s => s.staff_number.trim().toUpperCase() === admissionNumber.trim().toUpperCase())
  }, [staff, admissionNumber])

  // Get subjects linked to this staff member
  const staffSubjects = useMemo(() => {
    return currentStaff?.subjects || []
  }, [currentStaff])

  // Load existing results, subjects, and staff via Next.js proxy endpoints to bypass connection blocks/challenges
  useEffect(() => {
    fetch('/api/get_results')
      .then(res => res.json())
      .then(data => setResults(Array.isArray(data) ? data : []))
      .catch(() => setResults([]))

    fetch('/api/get_subjects')
      .then(res => res.json())
      .then(data => setSubjects(Array.isArray(data) ? data : []))
      .catch(() => setSubjects([]))

    fetch('/api/get_staff')
      .then(res => res.json())
      .then(data => setStaff(Array.isArray(data) ? data : []))
      .catch(() => setStaff([]))
  }, [])

  // Auto-fill subject if staff member has subjects assigned
  useEffect(() => {
    if (staffSubjects.length > 0 && !form.subject) {
      setForm(prev => ({ ...prev, subject: staffSubjects[0] }))
    }
  }, [staffSubjects])

  // Alternate fallback auto-fill if all system subjects loaded
  useEffect(() => {
    if (subjects.length > 0 && !form.subject && staffSubjects.length === 0) {
      setForm(prev => ({ ...prev, subject: subjects[0] }))
    }
  }, [subjects, staffSubjects])

  const summary = useMemo(() => {
    const total = results.length
    const byClass = results.reduce<Record<string, number>>((acc, item) => {
      acc[item.classLevel] = (acc[item.classLevel] || 0) + 1
      return acc
    }, {})
    return { total, byClass }
  }, [results])

  const handleFormChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleAddResult = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.student.trim() || !form.subject.trim() || !form.score.trim()) return

    setSaving(true)
    const newResult = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      student: form.student.trim(),
      admissionNumber: admissionNumber.trim().toUpperCase() || "UNKNOWN",
      classLevel: form.classLevel,
      term: form.term,
      subject: form.subject.trim(),
      score: form.score.trim(),
      remarks: form.remarks.trim() || "-",
      date: new Date().toLocaleDateString(),
    }

    try {
      const res = await fetch('/api/save_result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newResult),
      })
      if (res.ok) {
        const refreshed = await fetch('/api/get_results').then(r => r.json())
        setResults(Array.isArray(refreshed) ? refreshed : [])
        setForm({
          student: "",
          classLevel: "Primary 1",
          term: "First Term",
          subject: staffSubjects.length > 0 ? staffSubjects[0] : (subjects.length > 0 ? subjects[0] : ""),
          score: "",
          remarks: "",
        })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="portal-page">
      <div className="portal-shell">
        <header className="portal-hero">
          <div>
            <p className="portal-label">Student Portal</p>
            <h1>Result Entry</h1>
            {admissionNumber && <p>Logged in as <strong>{admissionNumber}</strong></p>}
            {currentStaff && <p style={{ fontSize: '14px', marginTop: '4px' }}>Staff Member: <strong>{currentStaff.name}</strong> ({currentStaff.role})</p>}
            <p>Enter a new result for your class.</p>
          </div>
        </header>

        <section className="portal-card portal-form">
          <h2>Log a new student result</h2>
          <form onSubmit={handleAddResult}>
            <div className="portal-grid">
              <label>
                Student name
                <input type="text" value={form.student} onChange={e => handleFormChange('student', e.target.value)} placeholder="e.g. Mary Johnson" required disabled={saving} />
              </label>
              <label>
                Class level
                <select value={form.classLevel} onChange={e => handleFormChange('classLevel', e.target.value)} disabled={saving}>
                  {CLASS_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
                </select>
              </label>
              <label>
                Term
                <select value={form.term} onChange={e => handleFormChange('term', e.target.value)} disabled={saving}>
                  {TERMS.map(term => <option key={term} value={term}>{term}</option>)}
                </select>
              </label>
              <label>
                Subject
                {staffSubjects.length > 0 ? (
                  <select value={form.subject} onChange={e => handleFormChange('subject', e.target.value)} disabled={saving}>
                    <option value="">Select a subject...</option>
                    {staffSubjects.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                ) : subjects.length > 0 ? (
                  <select value={form.subject} onChange={e => handleFormChange('subject', e.target.value)} disabled={saving}>
                    <option value="">Select a subject...</option>
                    {subjects.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                ) : (
                  <input type="text" value={form.subject} onChange={e => handleFormChange('subject', e.target.value)} placeholder="e.g. Mathematics" required disabled={saving} />
                )}
              </label>
              <label>
                Score
                <input type="text" value={form.score} onChange={e => handleFormChange('score', e.target.value)} placeholder="e.g. 85" required disabled={saving} />
              </label>
              <label>
                Remarks
                <input type="text" value={form.remarks} onChange={e => handleFormChange('remarks', e.target.value)} placeholder="e.g. Excellent effort" disabled={saving} />
              </label>
            </div>
            <div className="portal-actions">
              <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save result"}</button>
            </div>
          </form>
        </section>

        <section className="portal-card portal-table">
          <div className="portal-row">
            <h2>Saved result entries</h2>
          </div>
          {results.length === 0 ? (
            <p>No results saved yet. Add one above to start logging.</p>
          ) : (
            <div className="portal-list">
              {results.map(item => (
                <article key={item.id} className="portal-item">
                  <div>
                    <h3>{item.student}</h3>
                    <p>{item.classLevel} • {item.term}</p>
                  </div>
                  <div className="portal-meta">
                    <span>{item.subject}</span>
                    <strong>{item.score}</strong>
                    <small>{item.remarks}</small>
                    <small>{item.date}</small>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
