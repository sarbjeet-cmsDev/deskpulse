import { Suspense } from 'react';
import MyProjectList from '@/components/User/Project/MyProjectList';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title : {
    absolute: 'Project',
   }
}

export default function Project() {
  return (
    <Suspense fallback={<div className="p-6">Loading Projects...</div>}>
      <MyProjectList />
    </Suspense>
  );
}