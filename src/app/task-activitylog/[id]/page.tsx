
import TaskActivityLog from '@/components/User/TaskActivityLog/TaskActivityLog'
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {

  const { id } = await params


  return {
    title: {
      absolute: `ActivityLog | ${id}`

    },
  }
}

export default async function index({ params }: Props) {
  const { id } = await params
  return (
    <TaskActivityLog code={id} />
  )
}


