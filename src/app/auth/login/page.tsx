'use client';

import { useForm } from 'react-hook-form';
import Image from "next/image";
import leftarrow from "@/assets/images/back.png";
import { zodResolver } from '@hookform/resolvers/zod';
import { userLoginSchema } from '@/components/validation/userValidation';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/Form/Button';
import { Input } from '@/components/Form/Input';
import { H3 } from '@/components/Heading/H3';
import AuthService from '@/service/auth.service';
import { signIn } from '@/store/slices/authSlice';

type LoginInput = z.infer<typeof userLoginSchema>;

export default function AuthLoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const emailRef = useRef<HTMLInputElement>(null);

  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (formData: LoginInput) => {
    setApiError('');
    setLoading(true);

    try {
      const data = await AuthService.login(formData);
      const { access_token, user } = data;
      const role = user.role[0];


      localStorage.setItem('token', access_token);
      localStorage.setItem('type', role);

      dispatch(signIn({ id: user.id, email: user.email, role }));

      if (role === 'admin') {
        router.push('/admin');
      } else if (redirect) {
        router.push(`/${redirect}`);
      } else {
        router.push('/');
      }
    } catch (error: any) {
      setApiError(error?.response?.data?.message || error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center items-center p-[24px] border-b border-[#31394f14]">
        <div className="w-[2%]">
          <a href="/auth/profile">
            <Image src={leftarrow} alt="Logo" width={16} height={16} />
          </a>
        </div>
        <H3 className="w-[98%] text-center">Sign In</H3>
      </div>
        <p className="text-center text-sm text-gray-500">
          Give credentials to sign in your account
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            {...register('email')}
            type="text"
            placeholder="Type your email"
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}

          <div className="relative">
            <Input
              {...register('password')}
              placeholder="Type your password"
              type="password"
            />
          </div>
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}

          <Button type="submit" disabled={loading} className="w-full bg-indigo-500 text-white hover:bg-indigo-600">
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
}
