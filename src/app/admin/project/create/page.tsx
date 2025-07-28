import { Suspense } from 'react';
import CreateProjectForm from '@/components/admin/Project/CreateProjectForm';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title : {
    absolute: 'Project | Create',
   }
}

export default function CreateProject() {
  return (
    <Suspense fallback={<div className="p-6">Loading Project...</div>}>
      <CreateProjectForm />
    </Suspense>
  );
}


