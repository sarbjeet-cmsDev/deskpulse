"use client";
import { H5 } from "@/components/Heading/H5";
import ProjectCard from "@/components/IndexPage/ProjectCard";
import Image from "next/image";
import leftarrow from "@/assets/images/back.png";
import ProjectService from "@/service/project.service";
import { useEffect, useState } from "react";
import Link from "next/link";
import Pagination from "@/components/Pagination/pagination";

export default function MyProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const itemsPerPage = 5;

  useEffect(() => {
    const loadProjects = async (page: number) => {
      setLoading(true);
      try {
        const res = await ProjectService.getProjectByUserId();
        setProjects(res?.data || []);
        setTotalItems(res?.total || 0);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadProjects(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="main-content">
        <div>
          <div className="flex justify-center items-center p-[24px] border-b border-[#31394f14]">
            <div className="w-[2%]">
              <Link href="/">
                <Image src={leftarrow} alt="Logo" width={16} height={16} />
              </Link>
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

              <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
