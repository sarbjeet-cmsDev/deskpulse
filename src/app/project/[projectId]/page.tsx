import MyProjectDetails from '@/components/User/Project/MyProjectDetail'
import AdminProjectService from '@/service/adminProject.service'
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: { projectId: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {

  const { projectId } = params



  return {
    title: {
      absolute: `Project | ${projectId}`

    },
  }
}

export default async function ProjectViewPage({ params }: Props) {
  const { projectId } = await params
  return (
    <MyProjectDetails code={projectId} />
  )
}