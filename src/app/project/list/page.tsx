"use client";
import { H5 } from "@/components/Heading/H5";
import ProjectCard from "@/components/IndexPage/ProjectCard";
import Image from "next/image";
import leftarrow from "@/assets/images/back.png";
import ProjectService from "@/service/project.service";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function MyProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await ProjectService.getProjectByUserId();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="main-content">
        <div>
          <div className="flex justify-center items-center p-[24px] border-b border-[#31394f14]">
            <div className="w-[2%]">
              <a href="#">
                <Image src={leftarrow} alt="Logo" width={16} height={16} />
              </a>
            </div>
            <H5 className="w-[98%] text-center">My Projects</H5>
          </div>
          <div className="">
            <div className="pt-4 flex justify-center items-center gap-4 flex-wrap flex-row">
              {loading ? (
                <p>Loading projects...</p>
              ) : projects.length === 0 ? (
                <p>No projects found.</p>
              ) : (
                projects.map((project) => (
                   <Link key={project._id} href={`/project/${project._id}`}>
                     <ProjectCard project={project} />
                   </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
