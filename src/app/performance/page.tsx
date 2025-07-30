import { Suspense } from 'react';
import PerformancePreview from '@/components/User/Performance/PerformancePreview';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title : {
    absolute: 'Performance',
   }
}

export default function MyPerformance() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      < PerformancePreview/>
    </Suspense>
  );
}

