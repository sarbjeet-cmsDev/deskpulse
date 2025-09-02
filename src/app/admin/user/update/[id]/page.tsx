import UpdateUserForm from '@/components/admin/User/UpdateUserForm'
import AdminUserService from '@/service/adminUser.service'
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
      absolute: `Update User`
    },
  }
}

export default async function UpdateUserPage({ params }: Props) {
  const { id } = await params
  return (
    <UpdateUserForm id={id} />
  )
}


