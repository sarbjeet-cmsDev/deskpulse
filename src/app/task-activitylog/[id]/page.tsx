
import TaskActivityLog from '@/components/User/TaskActivityLog/TaskActivityLog'
import AdminTaskService from '@/service/adminTask.service'
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {

  const { id } = await params

  const Taskdata = await AdminTaskService.getTaskByCode(id);

  return {
    title: {
      absolute: `ActivityLog | ${Taskdata?.code}`

    },
  }
}

export default async function index({ params }: Props) {
  const { id } = await params
  return (
    <TaskActivityLog code={id} />
  )
}


