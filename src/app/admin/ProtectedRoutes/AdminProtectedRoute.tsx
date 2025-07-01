'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const admin = useSelector((state: RootState) => state.auth.admin); 
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !admin || admin.role !== 'admin') {
      router.replace('/admin/signin');
    }
  }, [admin, router]);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (!token || !admin || admin.role !== 'admin') {
    return <div className="text-center mt-20">Redirecting...</div>;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;