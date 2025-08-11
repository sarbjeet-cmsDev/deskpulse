import UpdateAuthProfileForm from '@/components/User/Auth/UpdateProfileForm'
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
  
  const Userdata = await AdminUserService.getUserById(id);
 
  return {
    title: {
      absolute:`Profile | ${Userdata?.firstName}`
    },
  }
}
 
export default async function UpdateAuthProfilePage({ params}: Props) {
  const { id } = await params
  return(
    <UpdateAuthProfileForm id={id}/>
  )
}

