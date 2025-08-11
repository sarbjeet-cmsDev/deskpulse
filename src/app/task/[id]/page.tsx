import TaskDetails from '@/components/User/Task/TaskDetail'
import AdminTaskService from '@/service/adminTask.service'
import TaskService from '@/service/task.service'
import type { Metadata, ResolvingMetadata } from 'next'
 
type Props = {
  params: Promise<{ id: string }>
}
 
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {

  const { id } = await params

  const TaskData = await AdminTaskService.getTask(id);
 
  return {
    title: {
      absolute:`Task | ${TaskData?.code}`
    },
  }
}
 
export default async function TaskViewPage({ params}: Props) {
  const { id } = await params
  return(
    <TaskDetails id={id}/>
  )
}