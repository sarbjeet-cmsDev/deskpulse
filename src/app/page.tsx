"use client";
import TopHeader from "@/components/IndexPage/TopHeader";
import { H3 } from "@/components/Heading/H3";
import ProjectCard from "@/components/IndexPage/ProjectCard";
import TodayTaskCard from "@/components/IndexPage/TodayTask";
import AddTask from "@/components/addtask";
import { InputSearch } from "@/components/search";
import { useEffect, useState } from "react";
import ProjectService from "@/service/project.service";
import Link from "next/link";



export default function Dashboard(){
     const [projects, setProjects] = useState<any[]>([]);
      const [loading, setLoading] = useState(true);
    

     useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await ProjectService.getProjectByUserId();
        setProjects(res.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

    return(
        <div>
            <div className="main-content">
                    <div className="rounded-tl-[24px] rounded-tr-[24px] bg-white">
                        <div className="max-w-6xl mx-auto">
                            
                            <div className="pt-4 flex justify-between items-center">
                                <H3>Recent Projects</H3>
                                <Link className="font-bold text-[#31394f99]" href={`/project/list` }>View All</Link>
                            </div>
                            <div className="pt-4 flex justify-center items-center gap-4 flex-wrap flex-row">
                              {loading ? (
                                    <p>Loading projects...</p>
                                ) : projects.length === 0 ? (
                                    <p>No projects found.</p>
                                ) : (
                                    projects.map((project) => (
                                    <Link className="max-w-[calc(50%-1em)]" key={project._id} href={`/project/${project._id}` }>
                                        <ProjectCard project={project} />
                                    </Link>
                                    ))
                                )}
                            </div>
                            {/* <div>
                                <div className="pt-8 flex justify-between items-center">
                                    <H3>Today Tasks</H3>
                                    <a href="#" className="font-bold text-[#31394f99]">View All</a>
                                </div>
                                <div className="mt-[14px]">
                                    <TodayTaskCard/>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        //  </div>
    );
}