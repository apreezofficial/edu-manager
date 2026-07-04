import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ExportResultsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/portal');
  }, [router]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif', background: '#FAFAF7', color: '#2C2C2A' }}>
      <p>Redirecting to Results Portal...</p>
    </div>
  );
}
