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

const CLASS_LEVELS = ["Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6"]
const TERMS = ["First Term", "Second Term", "Third Term"]

export default function StudentResultPage() {
  const searchParams = useSearchParams()
  const admissionNumber = searchParams?.get("admissionNumber") ?? ""

  const [results, setResults] = useState<ResultRecord[]>([])
  const [form, setForm] = useState({
    student: "",
    classLevel: "Primary 1",
    term: "First Term",
    subject: "",
    score: "",
    remarks: "",
  })

  // Load existing results
  useEffect(() => {
    fetch('/backend/get_results.php')
      .then(res => res.json())
      .then(data => setResults(data as ResultRecord[]))
      .catch(() => setResults([]))
  }, [])

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
    const newResult: ResultRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      student: form.student.trim(),
      classLevel: form.classLevel,
      term: form.term,
      subject: form.subject.trim(),
      score: form.score.trim(),
      remarks: form.remarks.trim() || "-",
      date: new Date().toLocaleDateString(),
    }
    await fetch('/backend/save_result.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newResult),
    })
    const refreshed = await fetch('/backend/get_results.php').then(r => r.json())
    setResults(refreshed)
    setForm({ student: "", classLevel: "Primary 1", term: "First Term", subject: "", score: "", remarks: "" })
  }

  return (
    <main className="portal-page">
      <div className="portal-shell">
        <header className="portal-hero">
          <div>
            <p className="portal-label">Student Portal</p>
            <h1>Result Entry</h1>
            {admissionNumber && <p>Logged in as <strong>{admissionNumber}</strong></p>}
            <p>Enter a new result for your class.</p>
          </div>
        </header>

        <section className="portal-card portal-form">
          <h2>Log a new student result</h2>
          <form onSubmit={handleAddResult}>
            <div className="portal-grid">
              <label>
                Student name
                <input type="text" value={form.student} onChange={e => handleFormChange('student', e.target.value)} placeholder="e.g. Mary Johnson" />
              </label>
              <label>
                Class level
                <select value={form.classLevel} onChange={e => handleFormChange('classLevel', e.target.value)}>
                  {CLASS_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
                </select>
              </label>
              <label>
                Term
                <select value={form.term} onChange={e => handleFormChange('term', e.target.value)}>
                  {TERMS.map(term => <option key={term} value={term}>{term}</option>)}
                </select>
              </label>
              <label>
                Subject
                <input type="text" value={form.subject} onChange={e => handleFormChange('subject', e.target.value)} placeholder="e.g. Mathematics" />
              </label>
              <label>
                Score
                <input type="text" value={form.score} onChange={e => handleFormChange('score', e.target.value)} placeholder="e.g. 85/100" />
              </label>
              <label>
                Remarks
                <input type="text" value={form.remarks} onChange={e => handleFormChange('remarks', e.target.value)} placeholder="e.g. Excellent effort" />
              </label>
            </div>
            <div className="portal-actions">
              <button type="submit">Save result</button>
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
