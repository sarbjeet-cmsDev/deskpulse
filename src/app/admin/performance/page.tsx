import { Suspense } from 'react';
import UsersPerformanceList from '@/components/admin/Performance/UsersPerformanceList';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title : {
    absolute: 'Performance',
   }
}

export default function UserPerformance() {
  return (
    <Suspense fallback={<div className="p-6">Loading Performance...</div>}>
      < UsersPerformanceList />
    </Suspense>
  );
}
