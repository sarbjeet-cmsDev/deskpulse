'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userCreateSchema } from '@/components/validation/userValidation';
import { z } from 'zod';
import { Input } from '@/components/Form/Input';
import { Button } from '@/components/Form/Button';
import { H1 } from '@/components/Heading/H1';
import AdminUserService from '@/service/adminUser.service';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Swal from 'sweetalert2';

type CreateUserInput = z.infer<typeof userCreateSchema>;

const CreateUserPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      gender: undefined,
      userRoles: [],
      isActive: true,
    },
  });

  const onSubmit = async (data: CreateUserInput) => {
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = data;
      await AdminUserService.createUser(payload);
 
      router.push('/admin/user');
    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start pt-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-xl bg-white p-6 rounded shadow space-y-4"
      >
        <H1 className="text-2xl font-semibold mb-4 text-gray-900">Create New User</H1>

        <Input placeholder="Username" {...register('username')} />
        {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}

        <Input type="email" placeholder="Email" {...register('email')} />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}

        <Input type="password" placeholder="Password" {...register('password')} />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}

        <Input type="password" placeholder="Confirm Password" {...register('confirmPassword')} />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
        )}

        <Input placeholder="First Name" {...register('firstName')} />
        <Input placeholder="Last Name" {...register('lastName')} />
        <Input placeholder="Phone" {...register('phone')} />

        {/* Gender Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select
            {...register('gender')}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <p className="text-sm text-red-500">{errors.gender.message}</p>}
        </div>

        {/* User Roles Multi-Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">User Roles</label>
          <select
            multiple
            {...register('userRoles')}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="admin">Admin</option>
            <option value="project_manager">Project Manager</option>
            <option value="team_member">Team Member</option>
            <option value="client">Client</option>
            <option value="employee">Employee</option>
          </select>
          {errors.userRoles && <p className="text-sm text-red-500">{errors.userRoles.message}</p>}
        </div>

        {/* isActive Checkbox */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register('isActive')}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label className="text-sm text-gray-700">Is Active</label>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          {loading ? 'Creating...' : 'Create User'}
        </Button>
      </form>
    </div>
  );
};

export default CreateUserPage;
