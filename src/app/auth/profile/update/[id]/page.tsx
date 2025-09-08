import UpdateAuthProfileForm from '@/components/User/Auth/UpdateProfileForm'
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
      absolute: `Update Profile`
    },
  }
}

export default async function UpdateAuthProfilePage({ params }: Props) {
  const { id } = await params
  return (
    <UpdateAuthProfileForm id={id} />
  )
}

