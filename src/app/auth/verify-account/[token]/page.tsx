'use client';

import { useState } from 'react';
import React from "react";
import { useRouter } from 'next/navigation';
import AuthService from '@/service/auth.service';


export default function VerifyAccountPage({ params }: { params: Promise<{ token: string }> }) {
  const router = useRouter();
  const { token } = React.use(params);
  const [status, setStatus] = useState<'pending' | 'verified' | 'alreadyVerified' | 'error'>('pending');

   React.useEffect(() => {
    const verify = async () => {
      try {
        const res:any = await AuthService.verifyAccount(token);
        if (res.status === 200) {
          if(res.data === 'already verified'){
            setStatus('alreadyVerified')
          }else{
            setStatus('verified');

          }
        }
        } catch (err:any) {
          console.error(err);
          setStatus("error");
        }
      };

      verify();
    }, [token, router]);
    
    console.log("status",status)
    
    const renderMessage = () => {
      if (status == 'alreadyVerified') {
      return (
        <>
          <h1 className="text-2xl font-bold text-black mb-4">Your account is already verified! Please Login.</h1>
          <button
            onClick={() => router.push('/auth/login')}
            className="btn-primary mt-10 px-6 py-2 rounded-md text-white transition "
          >
            Go to Login
          </button>
        </>
      );
    }
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

        {(status === 'verified' || status === 'alreadyVerified' || status === 'error') && (
        <div className="mt-[130px] bg-white border border-gray-200 rounded-xl shadow-md w-[390px] h-[300px] flex flex-col items-center justify-center text-center p-4">
          {renderMessage()}
        </div>
        )}
      </div>
    );
}