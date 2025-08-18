import { Suspense } from 'react';
import CommentListTable from '@/components/admin/Comment/CommentListTable';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    absolute: 'Comments',
  }
}

export default function CommentList() {
  return (
    <Suspense fallback={<div className="p-6">Loading Comments...</div>}>
      <CommentListTable />
    </Suspense>
  );
}