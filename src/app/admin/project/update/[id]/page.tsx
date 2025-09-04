import UpdateProjectForm from '@/components/admin/Project/UpdateProjectForm'
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
      absolute: `Project | ${id}`
    },
  }
}

export default async function UpdateProjectPage({ params }: Props) {
  const { id } = await params
  return (
    <UpdateProjectForm id={id} />
  )
}