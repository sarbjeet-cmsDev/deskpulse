import MyProjectDetails from '@/components/User/Project/MyProjectDetail'
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ code: string }>
}
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {

  const { code } = await params
  return {
    title: {
      absolute: `Project | ${code}`

    },
  }
}

export default async function ProjectViewPage({ params }: Props) {
  const { code } = await params
  return (
    <MyProjectDetails code={code} />
  )
}