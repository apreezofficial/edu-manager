// pages/add-student.tsx
import { useState } from 'react';
import axios from 'axios';

export default function AddStudent() {
  const [adm, setAdm] = useState('');
  const [fullName, setFullName] = useState('');
  const [classLevel, setClassLevel] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/add_student.php', {
        admissionNumber: adm,
        full_name: fullName,
        class_level: classLevel,
      });
      setMsg(res.data.message || 'Student added');
    } catch (err:any) {
      setMsg(err.response?.data?.error || 'Error');
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl mb-4">Add Student</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input placeholder="Admission Number" value={adm} onChange={e=>setAdm(e.target.value)} required className="input"/>
        <input placeholder="Full Name" value={fullName} onChange={e=>setFullName(e.target.value)} required className="input"/>
        <input placeholder="Class Level" value={classLevel} onChange={e=>setClassLevel(e.target.value)} required className="input"/>
        <button type="submit" className="btn-primary">Add Student</button>
      </form>
      {msg && <p className="mt-4">{msg}</p>}
    </div>
  );
}
