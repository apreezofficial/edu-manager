"use client";
import { useEffect, useState } from "react";

type ResultRecord = {
  id: string;
  student: string;
  classLevel: string;
  term: string;
  subject: string;
  score: string;
  remarks: string;
  date: string;
};

const STORAGE_KEY = "dk-portal-results";

export default function PortalViewPage() {
  const [results, setResults] = useState<ResultRecord[]>([]);

  // Load results from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setResults(JSON.parse(saved) as ResultRecord[]);
      } catch (e) {
        console.error("Failed to parse saved results", e);
        setResults([]);
      }
    }
  }, []);

  return (
    <main className="portal-view-page">
      <div className="portal-shell">
        <section className="portal-card portal-summary">
          <h2>Student / Parent Results</h2>
          <p>Below are the results logged for the selected term. This view is read‑only.</p>
        </section>

        <section className="portal-card portal-table">
          {results.length === 0 ? (
            <p>No results saved yet. Ask your teacher to log results.</p>
          ) : (
            <div className="portal-list">
              {results.map((item) => (
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
      <style jsx>{`
        .portal-view-page { padding: 2rem 1rem; background: #F9F8F4; min-height: 100vh; }
        .portal-shell { max-width: 980px; margin: 0 auto; }
        .portal-card { background: #fff; border-radius: 24px; padding: 2rem; box-shadow: 0 24px 60px rgba(0,0,0,0.06); margin-bottom: 1.5rem; }
        .portal-card h2 { font-size: 1.5rem; margin-bottom: 1rem; }
        .portal-card p { color: #5F5E5A; line-height: 1.8; }
        .portal-list { display: grid; gap: 1rem; }
        .portal-item { display: flex; justify-content: space-between; gap: 1rem; padding: 1.1rem 1.25rem; border-radius: 18px; border: 1px solid #E5E1D8; background: #FEFEFE; }
        .portal-item h3 { margin: 0 0 0.35rem; font-size: 1.05rem; }
        .portal-item p { margin: 0; color: #6B6A65; font-size: 0.94rem; }
        .portal-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 0.35rem; text-align: right; min-width: 160px; }
        .portal-meta span { font-size: 0.95rem; color: #2C2C2A; }
        .portal-meta strong { font-size: 1.15rem; color: #1D9E75; }
        .portal-meta small { display: block; color: #7F7D78; font-size: 0.82rem; }
        @media (max-width: 820px) {
          .portal-item { flex-direction: column; align-items: stretch; }
          .portal-meta { align-items: flex-start; text-align: left; }
        }
      `}</style>
    </main>
  );
}
