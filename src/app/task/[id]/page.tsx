import TaskDetails from '@/components/User/Task/TaskDetail'
import TaskService from '@/service/task.service'
import type { Metadata, ResolvingMetadata } from 'next'
 
type Props = {
  params: Promise<{ id: string }>
}
 
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {

  // const { id } = await params
 
  
  // const TaskData = await TaskService.getTaskById(id);
 
 
  return {
    title: {
      // absolute:`Task | ${TaskData?.title}`
      absolute:`Task`
      
    },
  }
}
 
export default async function TaskViewPage({ params}: Props) {
  const { id } = await params
  return(
    <TaskDetails id={id}/>
  )
}