import { Suspense } from 'react';
import ProjectListTable from '@/components/admin/Project/ProjectListTable';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title : {
    absolute: 'Project',
   }
}

export default function ProjectList() {
  return (
    <Suspense fallback={<div className="p-6">Loading Projects...</div>}>
      <ProjectListTable />
    </Suspense>
  );
}

