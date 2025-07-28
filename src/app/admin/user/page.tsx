import { Suspense } from 'react';
import UsersListTable from '@/components/admin/User/UserListTable';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title : {
    absolute: 'User',
   }
}

export default function UsersPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading Users...</div>}>
      <UsersListTable />
    </Suspense>
  );
}
