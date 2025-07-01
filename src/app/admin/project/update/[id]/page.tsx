'use client';

import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { z } from 'zod';
import Swal from 'sweetalert2';

import { Input } from '@/components/Form/Input';
import { Button } from '@/components/Form/Button';
import { H1 } from '@/components/Heading/H1';
import AdminProjectService from '@/service/adminProject.service';
import { projectUpdateSchema } from '@/components/validation/projectValidation';

type UpdateProjectInput = z.infer<typeof projectUpdateSchema>;

const UpdateProjectPage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProjectInput>({
    resolver: zodResolver(projectUpdateSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const project = await AdminProjectService.getProjectById(id);
        reset(project);
      } catch (error) {
        console.error('Failed to fetch project', error);
        Swal.fire('Error', 'Failed to load project.', 'error');
        router.push('/admin/project');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, reset, router]);

  const onSubmit: SubmitHandler<UpdateProjectInput> = async (data) => {
    try {
      await AdminProjectService.updateProject(id, data);
      Swal.fire('Success', 'Project updated successfully!', 'success');
      router.push('/admin/project');
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to update project.', 'error');
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

        <Input placeholder="Project Code" {...register('code')} />
        {errors.code && <p className="text-sm text-red-500">{errors.code.message}</p>}

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

        <Input type="number" placeholder="Sort Order" {...register('sort_order')} />
        {errors.sort_order && <p className="text-sm text-red-500">{errors.sort_order.message}</p>}

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
