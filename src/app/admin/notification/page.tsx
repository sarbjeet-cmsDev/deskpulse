import { Suspense } from 'react';
import NotificationListTable from '@/components/admin/Notification/NotificationListTable';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title : {
    absolute: 'Notifications',
   }
}

export default function NotificationList() {
  return (
    <Suspense fallback={<div className="p-6">Loading Notifications...</div>}>
      <NotificationListTable />
    </Suspense>
  );
}

