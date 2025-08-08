import UpdateAuthProfileForm from '@/components/User/Auth/UpdateProfileForm'
import MyProjectDetails from '@/components/User/Project/MyProjectDetail'
import AdminProjectService from '@/service/adminProject.service'
import UserService from '@/service/user.service'
import type { Metadata, ResolvingMetadata } from 'next'
 
type Props = {
  params: Promise<{ projectId: string }>
}
 
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {

  const { projectId } = await params
 
  
  const Userdata = await AdminProjectService.getProjectById(projectId);
 
 
  return {
    title: {
      absolute:`Project | ${Userdata?.code}`
      
    },
  }
}
 
export default async function ProjectViewPage({ params}: Props) {
  const { projectId } = await params
  return(
    <MyProjectDetails projectId={projectId}/>
  )
}