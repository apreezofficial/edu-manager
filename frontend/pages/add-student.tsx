import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AddStudentRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif', background: '#FAFAF7', color: '#2C2C2A' }}>
      <p>Redirecting to Admin Dashboard...</p>
    </div>
  );
}
