import MyProjectDetails from '@/components/User/Project/MyProjectDetail'
import AdminProjectService from '@/service/adminProject.service'
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ projectId: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {

  const { projectId } = await params


  const Projectdata = await AdminProjectService.getProjectByCode(projectId);

  return {
    title: {
      absolute: `Project | ${Projectdata?.code}`

    },
  }
}

export default async function ProjectViewPage({ params }: Props) {
  const { projectId } = await params
  return (
    <MyProjectDetails code={projectId} />
  )
}