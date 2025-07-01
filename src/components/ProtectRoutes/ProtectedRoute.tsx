'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut } from '@/store/slices/authSlice';
import UserService from '@/service/auth.service';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [checkingToken, setCheckingToken] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await UserService.validateToken();
  
        if (!res.valid || !res.user ) {
          }
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('type');
        dispatch(signOut());
        router.push('/signin');
      } finally {
        setCheckingToken(false);
      }
    };

    checkToken();
  }, [dispatch, router]);

  if (checkingToken) {
    return <div className="text-center mt-20">Checking token...</div>;
  }

  if (!user || user.role !== 'user') {
    return <div className="text-center mt-20">Redirecting...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;