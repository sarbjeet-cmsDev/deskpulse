"use client";
import  {H5}  from "@/components/Heading/H5";
import { P } from "@/components/ptag";
import Image from 'next/image';
import leftarrow from '@/assets/images/back.png';
import ProjectImage from "@/assets/images/projectimage.png"; 
import Details from "@/components/ProjectDetails/DetailTable";
import SubTasks from "@/components/ProjectDetails/SubTaskList";
import DropDownOptions from "@/components/ProjectDetails/DropDown"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProjectService from "@/service/project.service";

export default function MyProjectDetails(){
    const { projectId } = useParams();
    const [project, setProject] = useState<any>(null);
    // const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log(projectId,"prohectjhkjhjk")
    // if (projectId) {
      ProjectService.getProjectById(projectId as string)
        .then(setProject)
        .catch((err) => console.error("Failed to load project", err))
        // .finally(() => setLoading(false));
    // }
  }, []);

//   if (loading) return <div className="p-6 text-center">Loading project...</div>;
//   if (!project) return <div className="p-6 text-center">Project not found</div>;
   console.log(project,"projectjhj")
    return(
        <div className="max-w-6xl mx-auto">
            <div className="main-content">
                <div>
                    <div className="flex justify-between items-center p-[24px] border-b border-[#31394f14]">
                        <div className="flex items-center gap-4">
                            <div className="">
                                <a href="/project/list">
                                    <Image src={leftarrow} alt="Logo" width={16} height={16} />
                                </a>
                            </div>
                            <H5 className='w-[98%] text-center'>Gaming Platform Web & Mobile Apps</H5>
                        </div>
                        <div className="">
                            <DropDownOptions/>
                        </div>
                    </div>
                    <div className="">
                        <div className="pt-4 ">
                            <div className="mt-[14px]  h-[175px] overflow-hidden border border-[#e3e3e35c] rounded-[8px]">
                                <Image src={ProjectImage} alt="project-image" className="rounded-[8px]"/>
                            </div>
                            <H5 className="mt-[20px]">Description</H5>
                            <P className="text-start">
                                {project?.notes || "No description provided."}
                                <a href="#" className="text-primary mt-[12px]">See Details</a>
                            </P>
                            <Details project={project}/>
                            <div className="mt-[20px]">
                                <a href="#" className="text-[#7980ff] bg-[#7980ff1f] py-[16px] px-[28px] rounded-[12px] w-full text-[14px] leading-[16px] font-bold text-center block">Add Custom Section</a>
                            </div>
                            <div className="mt-[28px]">
                                <H5>Sub Tasks (3)</H5>
                                <SubTasks/>
                            </div>
                            <a href="#" className="bg-[#7980ff] text-white block w-full flex justify-center items-center gap-2 text-[14px] leading-[16px] font-bold py-[16px] rounded-[12px] mt-[24px] px-[28px]" >
                            <svg
                                width="15"
                                height="15"
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M10.9572 0.666748C13.3752 0.666748 14.9998 2.36408 14.9998 4.89008V10.7767C14.9998 13.3027 13.3752 15.0001 10.9572 15.0001H4.70917C2.29117 15.0001 0.666504 13.3027 0.666504 10.7767V4.89008C0.666504 2.36408 2.29117 0.666748 4.70917 0.666748H10.9572ZM10.9572 1.66675H4.70917C2.86117 1.66675 1.6665 2.93141 1.6665 4.89008V10.7767C1.6665 12.7354 2.86117 14.0001 4.70917 14.0001H10.9572C12.8058 14.0001 13.9998 12.7354 13.9998 10.7767V4.89008C13.9998 2.93141 12.8058 1.66675 10.9572 1.66675ZM7.83317 4.88495C8.10917 4.88495 8.33317 5.10895 8.33317 5.38495V7.32675L10.2775 7.32688C10.5535 7.32688 10.7775 7.55088 10.7775 7.82688C10.7775 8.10288 10.5535 8.32688 10.2775 8.32688L8.33317 8.32675V10.2696C8.33317 10.5456 8.10917 10.7696 7.83317 10.7696C7.55717 10.7696 7.33317 10.5456 7.33317 10.2696V8.32675L5.38884 8.32688C5.11217 8.32688 4.88884 8.10288 4.88884 7.82688C4.88884 7.55088 5.11217 7.32688 5.38884 7.32688L7.33317 7.32675V5.38495C7.33317 5.10895 7.55717 4.88495 7.83317 4.88495Z"
                                    fill="white"
                                />
                            </svg>
                
                            Add New Sub Task</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}