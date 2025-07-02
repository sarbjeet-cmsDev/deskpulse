'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

import { userResetPasswordSchema } from '@/components/validation/userValidation';
import { Input } from '@/components/Form/Input';
import { Button } from '@/components/Form/Button';
import { H1 } from '@/components/Heading/H1';
import AdminUserService from '@/service/adminUser.service';

type ResetPasswordInput = z.infer<typeof userResetPasswordSchema>;

const ResetPasswordPage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(userResetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      await AdminUserService.resetPassword(id, data.newPassword);

      router.push('/admin/user');
    } catch (err) {
      console.error('Password reset failed:', err);

    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start pt-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-6 rounded shadow space-y-4"
      >
        <H1 className="text-2xl font-semibold mb-4 text-gray-900">Reset Password</H1>

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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
