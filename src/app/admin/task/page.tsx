import { Suspense } from 'react';
import TaskListTable from '@/components/admin/Task/TaskListTable';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title : {
    absolute: 'Tasks',
   }
}

export default function TaskList() {
  return (
    <Suspense fallback={<div className="p-6">Loading Tasks...</div>}>
      <TaskListTable />
    </Suspense>
  );
}

