import { Suspense } from 'react';
import MyTaskList from '@/components/User/Task/MyTaskList';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title : {
    absolute: 'Task',
   }
}

export default function MyTask() {
  return (
    <Suspense fallback={<div className="p-6">Loading Tasks...</div>}>
      <MyTaskList />
    </Suspense>
  );
}

