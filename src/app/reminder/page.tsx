import { Suspense } from 'react';
import MyReminderList from '@/components/User/Reminder/MyReminderList';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title : {
    absolute: 'Reminder',
   }
}

export default function MyReminder() {
  return (
    <Suspense fallback={<div className="p-6">Loading Reminder...</div>}>
      <MyReminderList />
    </Suspense>
  );
}
