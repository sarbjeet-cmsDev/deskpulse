import { GetKanbonList } from "@/components/KanbanBoard/GetKabanList";
import AdminProjectService from '@/service/adminProject.service'
import type { Metadata, ResolvingMetadata } from 'next'


type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {

  const { id } = await params


  const Projectdata = await AdminProjectService.getProjectById(id);

  return {
    title: {
      absolute: `Project Kanban | ${Projectdata?.code}`

    },
  }
}

export default function index() {
  return <GetKanbonList />;
}
