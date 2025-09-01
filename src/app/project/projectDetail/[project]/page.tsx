import { GetKanbonList } from "@/components/KanbanBoard/GetKabanList";
import AdminProjectService from '@/service/adminProject.service'
import type { Metadata, ResolvingMetadata } from 'next'


type Props = {
  params: Promise<{ project: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {

  const { project } = await params


  const Projectdata = await AdminProjectService.getProjectById(project);

  return {
    title: {
      absolute: `Project Kanban | ${Projectdata?.code}`

    },
  }
}

export default function index() {
  return <GetKanbonList />;
}
