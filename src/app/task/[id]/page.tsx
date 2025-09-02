import TaskDetails from '@/components/User/Task/TaskDetail'
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
      absolute: `Task | ${id}`
    },
  }
}

export default async function TaskViewPage({ params }: Props) {
  const { id } = await params
  return (
    <TaskDetails id={id} />
  )
}