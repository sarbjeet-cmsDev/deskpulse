'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { z } from 'zod';
import { MultiValue, Props as SelectProps } from 'react-select';

import { Input } from '@/components/Form/Input';
import { Button } from '@/components/Form/Button';
import { H1 } from '@/components/Heading/H1';
import AdminUserService, { IUser } from '@/service/adminUser.service';
import AdminProjectService from '@/service/adminProject.service';
import { projectUpdateSchema } from '@/components/validation/projectValidation';

type UpdateProjectInput = z.infer<typeof projectUpdateSchema>;
type UserOption = { label: string; value: string };

// Dynamic import for react-select
const ReactSelect = dynamic(() => import('react-select') as any, {
  ssr: false,
}) as React.ComponentType<SelectProps<UserOption, true>>;

const UpdateProjectPage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [userOptions, setUserOptions] = useState<UserOption[]>([]);
  const [inputValue, setInputValue] = useState('');

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProjectInput>({
    resolver: zodResolver(projectUpdateSchema),
  });

  // Debounced fetch for user search
  const fetchUsers = useCallback(
    debounce(async (input: string) => {
      try {
        const users = await AdminUserService.searchUsers(input || '');
        const options = users.map((user: IUser) => ({
          label: `${user.firstName || ''} ${user.lastName || ''} (${user.email})`,
          value: user._id,
        }));
        setUserOptions(options);
      } catch (err) {
        console.error('Error fetching users:', err);
        setUserOptions([]);
      }
    }, 300),
    []
  );

  // Fetch and populate project
  useEffect(() => {
    const fetchData = async () => {
      try {
        const project = await AdminProjectService.getProjectById(id);

        // Preload selected user options
        const users = await AdminUserService.searchUsers('');
        const options = users.map((user: IUser) => ({
          label: `${user.firstName || ''} ${user.lastName || ''} (${user.email})`,
          value: user._id,
        }));
        setUserOptions(options);

        reset(project);
      } catch (error) {
        console.error('Failed to fetch project', error);
        router.push('/admin/project');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, reset, router]);

  const onSubmit = async (data: UpdateProjectInput) => {
    try {
      await AdminProjectService.updateProject(id, data);
      router.push('/admin/project');
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading project...</div>;
  }

  return (
    <div className="min-h-screen flex justify-center pt-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl bg-white p-6 rounded shadow space-y-4"
      >
        <H1 className="text-2xl font-semibold text-gray-900 mb-4">Update Project</H1>

        {/* <Input placeholder="Project Code" {...register('code')} />
        {errors.code && <p className="text-sm text-red-500">{errors.code.message}</p>} */}
<Input placeholder="Title" {...register('title')} />
        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
        {/* Assign Users */}
        <Controller
          name="users"
          control={control}
          render={({ field }) => {
            const selectedOptions = userOptions.filter((opt) =>
              field.value?.includes(opt.value)
            );

            return (
              <ReactSelect
                isMulti
                options={userOptions}
                placeholder="Assign Users"
                value={selectedOptions}
                inputValue={inputValue}
                onInputChange={(value) => {
                  setInputValue(value);
                  if (value.length >= 1) {
                    fetchUsers(value);
                  }
                }}
                onChange={(selected: MultiValue<UserOption>) => {
                  const ids = selected.map((opt) => opt.value);
                  field.onChange(ids);
                }}
                styles={{
                  option: (base) => ({ ...base, color: 'black' }),
                  singleValue: (base) => ({ ...base, color: 'black' }),
                  multiValueLabel: (base) => ({ ...base, color: 'black' }),
                }}
                classNamePrefix="react-select"
              />
            );
          }}
        />

        <Input placeholder="Dev URL" {...register('url_dev')} />
        <Input placeholder="Live URL" {...register('url_live')} />
        <Input placeholder="Staging URL" {...register('url_staging')} />
        <Input placeholder="UAT URL" {...register('url_uat')} />

        <Input placeholder="Notes" {...register('notes')} />
        <Input placeholder="Creds" {...register('creds')} />
        <Input placeholder="Additional Information" {...register('additional_information')} />

        <Input type="text" placeholder="Project Coordinator ID" {...register('project_coordinator')} />
        <Input type="text" placeholder="Team Leader ID" {...register('team_leader')} />
        <Input type="text" placeholder="Project Manager ID" {...register('project_manager')} />

        <Input placeholder="Avatar URL" {...register('avatar')} />
{/* 
        <Input type="number" placeholder="Sort Order" {...register('sort_order')} />
        {errors.sort_order && (
          <p className="text-sm text-red-500">{errors.sort_order.message}</p>
        )} */}

        <div>
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register('is_active')} />
            <span>Is Active</span>
          </label>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          {isSubmitting ? 'Updating...' : 'Update Project'}
        </Button>
      </form>
    </div>
  );
};

export default UpdateProjectPage;
