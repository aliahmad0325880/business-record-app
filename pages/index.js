import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login'); // Always redirect to login on site load
  }, []);

  return null; // Empty component since it immediately redirects
}
