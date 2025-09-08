'use client';

import AuthService from '@/service/auth.service';
import { createAxiosClient } from '@/utils/createAxiosClient';
import { useRouter,useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

const axiosClient = createAxiosClient({ withCreds: false });

export default function ResetPasswordPage() {
  const router = useRouter();
  const { id, token } = useParams<{ id: string; token: string }>();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (id && token) {
      setIsReady(true);
    }
  }, [id, token]);

  const validate = (): boolean => {
    const newErrors: { password?: string; confirmPassword?: string } = {};

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password)
    ) {
      newErrors.password = 'Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.'}

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    setSuccessMsg('');

    if (!validate()) return;


    try {
      await AuthService.passwordReset(id,token,password)
    
      setSuccessMsg('Password reset successful! Redirecting...');
      setTimeout(() => router.push('/auth/login'), 2000);
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Reset failed');
    }

  };

  if (!isReady) return <p className="text-center">Loading...</p>;

  return (
    <div className="mt-[200px] flex items-center justify-center px-4">
      <div className="bg-white text-gray-900 p-6 rounded-xl shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-custom w-full px-3 py-2 rounded-md border border-gray-300"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-custom w-full px-3 py-2 rounded-md border border-gray-300"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>
          
          <button
            className="w-full btn-primary font-semibold py-2 rounded-md cursor-pointer"
            type="submit"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
