import { Suspense } from 'react';
import TimeSheetList from '@/components/admin/TimeSheet/TimeSheetList';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title : {
    absolute: 'Time sheet',
   }
}

export default function TimeSheet() {
  return (
    <Suspense fallback={<div className="p-6">Loading Tasks...</div>}>
      <TimeSheetList />
    </Suspense>
  );
}
