import { useEffect } from 'react';
import { useRouter } from 'next/router';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    // If not logged in and not on login page, redirect to login
    if (!isLoggedIn && router.pathname !== '/login') {
      router.push('/login');
    }

    // If already logged in and on login page, redirect to home
    if (isLoggedIn && router.pathname === '/login') {
      router.push('/');
    }
  }, [router]);

  return <Component {...pageProps} />;
}
