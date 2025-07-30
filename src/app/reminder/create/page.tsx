import { Suspense } from 'react';
import CreateReminder from '@/components/User/Reminder/CreateReminder';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title : {
    absolute: 'Reminder | Create',
   }
}

export default function CreateReminderPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      < CreateReminder/>
    </Suspense>
  );
}