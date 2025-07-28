import { Suspense } from 'react';
import CreateUserForm from '@/components/admin/User/CreateUserForm';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title : {
    absolute: 'User | Create',
   }
}

export default function CreateUser() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <CreateUserForm />
    </Suspense>
  );
}