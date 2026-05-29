// pages/export-results.tsx
import { useEffect, useState } from 'react';
import { requestBackend } from '../utils/backendProxy';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function ExportResults() {
  const [results, setResults] = useState<any[]>([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    requestBackend('/get_results.php', 'GET')
      .then(r => setResults(r.results || r))
      .catch(() => setMsg('Failed to load results'));
  }, []);

  const downloadPdf = () => {
    const doc = new jsPDF();
    const cols = ['ID', 'Student', 'Admission #', 'Class', 'Term', 'Subject', 'Score', 'Grade', 'Remarks', 'Date'];
    const rows = results.map(r => [
      r.id, r.student, r.admissionNumber, r.classLevel, r.term, r.subject, r.score, r.grade, r.remarks, r.date
    ]);
    // @ts-ignore – autotable plugin
    doc.autoTable({ head: [cols], body: rows });
    doc.save('results.pdf');
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl mb-4">Export Results</h1>
      {msg && <p>{msg}</p>}
      <button onClick={downloadPdf} className="btn-primary mb-4">Download PDF</button>
      <table className="table-auto w-full border">
        <thead><tr>{['ID','Student','Admission #','Class','Term','Subject','Score','Grade','Remarks','Date'].map(c => <th key={c} className="border p-2">{c}</th>)}</tr></thead>
        <tbody>
          {results.map(r => (
            <tr key={r.id}>
              <td className="border p-2">{r.id}</td>
              <td className="border p-2">{r.student}</td>
              <td className="border p-2">{r.admissionNumber}</td>
              <td className="border p-2">{r.classLevel}</td>
              <td className="border p-2">{r.term}</td>
              <td className="border p-2">{r.subject}</td>
              <td className="border p-2">{r.score}</td>
              <td className="border p-2">{r.grade}</td>
              <td className="border p-2">{r.remarks}</td>
              <td className="border p-2">{r.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
