'use client';

import AuthService from '@/service/auth.service';
import Link from 'next/link';
import { useState } from 'react';
import Image from "next/image";
import leftarrow from "@/assets/images/back.png";
import { H3 } from '../Heading/H3';
import { Input } from '@heroui/react';

export default function ResendVerifyForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validateEmail = (value: string) => {
    if (!value.trim()) return 'Email is required';
    if (!/^\S+@\S+\.\S+$/.test(value)) return 'Invalid email format';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    const err = validateEmail(email);
    if (err) {
      setError(err);
      return;
    }

    setError('');
    setLoading(true);

    try {
      await AuthService.resendVerify(email);
      setSubmitted(true);
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-[200px] flex items-center justify-center">
      <div className="bg-white text-black p-8 rounded-2xl shadow-md w-[400px]">
        <div className="flex justify-center items-center p-[24px] border-b border-[#31394f14] mb-5">
          <Link href="/auth/login">
            <Image src={leftarrow} alt="Back" width={16} height={16} />
          </Link>

          <H3 className="text-center flex-1">Resend Verify</H3>
        </div>
          {submitted ? (
            <p className="text-theme-secondary text-sm">
              If this email is registered, a verification link has been resent to your email. Please check your inbox.
            </p>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                  setApiError('');
                }}
                className="input-custom w-full px-3 py-2 rounded-md border border-gray-300"
                placeholder="Enter your email"
              />
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary font-semibold py-2 rounded-md cursor-pointer" 
            >
              {loading ? 'Sending...' : 'Resend Verification Link'}
            </button>
          </form>
          )} 
      </div>
    </div>
  );
}
