'use client';

import AuthService from '@/service/auth.service';
import { createAxiosClient } from '@/utils/createAxiosClient';
import { useRouter,useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { userResetPasswordSchema } from '@/components/validation/userValidation';
import Link from "next/link";
import Image from "next/image";
import leftarrow from "@/assets/images/back.png";
import { H3 } from "@/components/Heading/H3";
import { Input } from '@/components/Form/Input';
import { Button } from '@/components/Form/Button';


interface Props {
  id: string;
  token:string;
}

type ResetPasswordInput = z.infer<typeof userResetPasswordSchema>;

export default function AuthResetPasswordForm({id,token}:Props) {
  const router = useRouter();
  // const { id, token } = useParams<{ id: string; token: string }>();

  const [isReady, setIsReady] = useState(false);


  const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<ResetPasswordInput>({
      resolver: zodResolver(userResetPasswordSchema),
    });

  useEffect(() => {
    if (id && token) {
      setIsReady(true);
    }
  }, [id, token]);

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      await AuthService.passwordReset(id,token, data.newPassword)
      setTimeout(() => router.push('/auth/login'), 2000);
    } catch (err: any) {
      console.error('Password reset failed:', err);
    }

  };

  if (!isReady) return <p className="text-center">Loading...</p>;

  return (
    <div className="mt-[230px] flex justify-center items-start md:pt-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white md:p-6 p-3 rounded shadow space-y-4"
      >
        <div className="flex justify-center items-center md:py-[24px] p-2 border-b border-[#31394f14]">
          <div className="w-[5%]">
            <Link href="/auth/login">
              <Image src={leftarrow} alt="Back" width={30} height={30} />
            </Link>
          </div>
          <H3 className="w-[98%] text-center">Reset Password</H3>
        </div>

        <Input
          type="password"
          placeholder="New Password"
          {...register('newPassword')}
        />
        {errors.newPassword && (
          <p className="text-sm text-red-500">{errors.newPassword.message}</p>
        )}

        <Input
          type="password"
          placeholder="Confirm Password"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary text-white font-semibold py-2 px-4 rounded"
        >
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </Button>
      </form>
    </div>
  );
}
