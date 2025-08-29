import ReminderDetailPage from '@/components/User/Reminder/ReminderDetails'
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ reminderId: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {

  return {
    title: {
      absolute: `Reminder | Details`

    },
  }
}

export default async function Page({ params }: Props) {
  const { reminderId } = await params
  return (
    <ReminderDetailPage reminderId={reminderId} />
  )
}