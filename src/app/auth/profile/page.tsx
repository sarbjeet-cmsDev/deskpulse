import { Suspense } from 'react';
import AuthProfileView from '@/components/User/Auth/ProfileView';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title : {
    absolute: 'Profile',
   }
}

export default function Profile() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <AuthProfileView />
    </Suspense>
  );
}


