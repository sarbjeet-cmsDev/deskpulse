import { GetKanbonList } from "@/components/KanbanBoard/GetKabanList";
import type { Metadata, ResolvingMetadata } from 'next'


type Props = {
  params: Promise<{ project: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return {
    title: {
      absolute: `Project Kanban`

    },
  }
}

export default function index() {
  return <GetKanbonList />;
}
