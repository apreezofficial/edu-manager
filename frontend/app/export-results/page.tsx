"use client";

import { useEffect, useState } from "react";

type ResultRecord = {
  id: string;
  student: string;
  admissionNumber: string;
  classLevel: string;
  term: string;
  subject: string;
  score: string;
  grade: string;
  remarks: string;
  date: string;
};

function getGrade(score: string): string {
  const n = parseFloat(score);
  if (isNaN(n)) return "-";
  if (n >= 75) return "A";
  if (n >= 60) return "B";
  if (n >= 50) return "C";
  if (n >= 40) return "D";
  return "F";
}

export default function ExportResultsPage() {
  const [results, setResults] = useState<ResultRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/backend/get_results.php")
      .then((res) => res.json())
      .then((data) => {
        // Ensure each record has a grade field calculated from score
        const enriched = (data as ResultRecord[]).map((r) => ({
          ...r,
          grade: getGrade(r.score),
        }));
        setResults(enriched);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Helper to render column headers in a friendly way
  const renderHeader = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (c) => c.toUpperCase())
      .trim();
  };

  return (
    <main
      style={{
        padding: "2rem",
        fontFamily: "'Nunito', sans-serif",
        background: "linear-gradient(145deg, #534AB7, #26215C)",
        color: "#fff",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "1.5rem" }}>
        Student Results
      </h1>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : results.length === 0 ? (
        <p style={{ textAlign: "center" }}>No results found.</p>
      ) : (
        <div style={{ overflowX: "auto", borderRadius: "12px" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#fff",
              color: "#2C2C2A",
            }}
          >
            <thead style={{ background: "#1D9E75", color: "#fff" }}>
              <tr>
                {Object.keys(results[0]).map((key) => (
                  <th key={key} style={{ padding: "0.75rem", textAlign: "left" }}>
                    {renderHeader(key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((row) => (
                <tr key={row.id} style={{ borderBottom: "1px solid #ddd" }}>
                  {Object.values(row).map((value, i) => (
                    <td key={i} style={{ padding: "0.5rem" }}>
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
