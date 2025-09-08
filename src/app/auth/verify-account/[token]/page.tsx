'use client';

import { useEffect, useState } from 'react';
import React from "react";
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import AuthService from '@/service/auth.service';

interface VerifyAccountPageProps {
  params: {
    token: string;
  };
}

export default function VerifyAccountPage({ params }: any) {
  const router = useRouter();
  const { token } = params;
  const [status, setStatus] = useState<'pending' | 'verified' | 'error'>('pending');

   React.useEffect(() => {
    const verify = async () => {
      try {
        const res:any = await AuthService.verifyAccount(token);
        console.log("res",res)
        if (res.status === 200) {
          setStatus('verified');
        }
        } catch (err:any) {
          console.error(err);
          setStatus('error')
          Swal.fire({
                    icon: 'error',
                    title: 'Oops!',
                    text: err.response?.data?.message || err.message || 'Something went wrong. Please try again later.',
                    confirmButtonText: 'Okay',
                    width: '350px',
                    padding: '1em',
                    iconColor: '#ef4444', 
                    confirmButtonColor: '#0d9488',
                    customClass: {
                      popup: 'rounded-xl shadow-md',
                      title: 'text-lg font-semibold',
                      confirmButton: 'px-8 py-1 text-sm',
                    },
                  });
        }
      };

      verify();
    }, [token, router]);

    const renderMessage = () => {
      if (status === 'verified') {
        return (
          <>
            <h1 className="text-2xl font-bold text-black mb-4">Thank you! Your account has been verified.</h1>
            <button
              onClick={() => router.push('/auth/login')}
              className="btn-primary mt-10 px-6 py-2 rounded-md text-white transition "
            >
              Go to Login
            </button>
          </>
        );
      }

      if (status === 'error') {
        return (
          <h1 className="text-xl text-gray-700">
            Something went wrong. Please try again.
          </h1>
        );
      }

      return null; 
    };

    return (

      
      <div className="flex items-center justify-center flex max-[767px]:mt-[60px] mt-[180px]">
        {status === 'pending' && (
        <p className="text-gray-600 text-lg animate-pulse">Verifying your account...</p>
        )}

        {(status === 'verified' || status === 'error') && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-md w-[390px] h-[300px] flex flex-col items-center justify-center text-center p-4">
          {renderMessage()}
        </div>
        )}
      </div>
    );
}