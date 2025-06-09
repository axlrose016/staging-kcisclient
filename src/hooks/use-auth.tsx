"use client"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const useAuthRedirect = (isAuthenticated:boolean) => {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/'); // Redirect to login page if not authenticated
    }
  }, [isAuthenticated, router]);
};

export default useAuthRedirect;
