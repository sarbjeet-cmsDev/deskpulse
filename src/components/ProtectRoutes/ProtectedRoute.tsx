'use client';

import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut } from '@/store/slices/authSlice';
import AuthService from '@/service/auth.service';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {

  const dispatch = useDispatch();
  const router = useRouter();
  const [checkingToken, setCheckingToken] = useState(true);

  useEffect(() => {
    const checkToken = async () => {



      try {
        const res = await AuthService.validateToken();

        if (!res.valid || !res.user) {
        }
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('type');
        Cookies.remove("token")
        Cookies.remove("role")

        dispatch(signOut());
        router.push('/auth/login');
      } finally {
        setCheckingToken(false);
      }
    };

    checkToken();
  }, [dispatch, router]);

  if (checkingToken) {
    return <div className="text-center mt-20">Checking token...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;