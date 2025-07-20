import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      setLoading(false);
    } else {
      router.replace('/login');
    }
  }, []);

  if (loading) return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Customer Records</h1>
      <p>This is your protected customer dashboard.</p>
    </div>
  );
}
