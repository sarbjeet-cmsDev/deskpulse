import UpdateAuthProfileForm from '@/components/User/Auth/UpdateProfileForm'
import UserService from '@/service/user.service'
import type { Metadata, ResolvingMetadata } from 'next'
 
type Props = {
  params: Promise<{ id: string }>
}
 
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {

  // const { id } = await params
 
  
  // const Userdata = await UserService.getUserById();
 
 
  return {
    title: {
      // absolute:`User | ${Userdata?.firstName}`
      absolute:`Profile | Update`
    },
  }
}
 
export default async function UpdateAuthProfilePage({ params}: Props) {
  const { id } = await params
  return(
    <UpdateAuthProfileForm id={id}/>
  )
}

