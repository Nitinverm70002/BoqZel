'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if the user is authenticated from localStorage directly on first mount
    // to avoid layout flicker if possible
    const storedAuth = localStorage.getItem('boqzel_auth');
    if (!isLoggedIn && storedAuth !== 'true') {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  // If not yet mounted, match server render (null)
  if (!mounted) {
    return null;
  }

  // Once mounted, if not logged in, don't show children
  const isAuth = isLoggedIn || localStorage.getItem('boqzel_auth') === 'true';
  if (!isAuth) {
    return null;
  }

  return <>{children}</>;
}
