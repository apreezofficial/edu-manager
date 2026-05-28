// pages/admin.tsx
import { useState } from 'react';
import { requestBackend } from '../utils/backendProxy';

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
      setMsg(res.data.message || 'Staff added');
    } catch (err:any) {
      setMsg(err.response?.data?.error || 'Error');
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl mb-4">Add Staff (Admin)</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input placeholder="PIN" value={pin} onChange={e=>setPin(e.target.value)} required className="input"/>
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required className="input"/>
        <input placeholder="Role" value={role} onChange={e=>setRole(e.target.value)} required className="input"/>
        <input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="input"/>
        <button type="submit" className="btn-primary">Add Staff</button>
      </form>
      {msg && <p className="mt-4">{msg}</p>}
    </div>
  );
}
