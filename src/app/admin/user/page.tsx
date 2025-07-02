'use client';

import { Suspense } from 'react';
import UsersComponent from './userComponent';

export default function UsersPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading Users...</div>}>
      <UsersComponent />
    </Suspense>
  );
}
