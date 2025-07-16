'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut } from '@/store/slices/authSlice';
import AuthService from '@/service/auth.service';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.auth.user);

  const dispatch = useDispatch();
  const router = useRouter();
  const [checkingToken, setCheckingToken] = useState(true);

  useEffect(() => {
    const checkToken = async () => {

      const token = localStorage.getItem('token');
      if (!token) {
        dispatch(signOut());
        router.push('/auth/login');
        return;
      }

      // try {
      //   const res = await AuthService.validateToken();
  
      //   if (!res.valid || !res.user ) {
      //     localStorage.removeItem('token');
      //     localStorage.removeItem('type');
      //     dispatch(signOut());
      //     router.push('/auth/login');
      //     }
      // } catch (err) {
      //   localStorage.removeItem('token');
      //   localStorage.removeItem('type');
      //   dispatch(signOut());
      //   router.push('/auth/login');
      // } finally {
      //   setCheckingToken(false);
      // }
    };

    checkToken();
  }, [dispatch, router]);

  // if (checkingToken) {
  //   return <div className="text-center mt-20">Checking token...</div>;
  // }

  // if (!user || user.role !== 'user') {
  //   return <div className="text-center mt-20">Redirecting...</div>;
  // }

  return <>{children}</>;
};

export default ProtectedRoute;