import { GetKanbonList } from "@/components/KanbanBoard/GetKabanList";
import AdminProjectService from '@/service/adminProject.service'
import type { Metadata, ResolvingMetadata } from 'next'


// type Props = {
//   params: Promise<{ project: string }>
// }

// export async function generateMetadata(
//   { params }: Props,
//   parent: ResolvingMetadata
// ): Promise<Metadata> {

//   const { project } = await params


//   return {
//     title: {
//       absolute: `Project Kanban`

//     },
//   }
// }

export default function index() {
  return <GetKanbonList />;
}
