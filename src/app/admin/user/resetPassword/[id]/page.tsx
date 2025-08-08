import ResetPasswordForm from '@/components/admin/User/ResetPasswordForm'
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
      absolute:`User | ${Userdata?.firstName}`
    },
  }
}
 
export default async function Page({ params}: Props) {
  const { id } = await params
  return(
    <ResetPasswordForm id={id}/>
  )
}
