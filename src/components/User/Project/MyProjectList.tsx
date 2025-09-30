"use client";
import { H5 } from "@/components/Heading/H5";
import ProjectCard from "@/components/IndexPage/ProjectCard";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import leftarrow from "@/assets/images/back.png";
import ProjectService from "@/service/project.service";
import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination/pagination";
import { ProjectKanbon } from "@/service/projectKanbon.service";
import TaskService from "@/service/task.service";
import { KanbanColumn } from "@/types/projectKanbon.interface";
import { ITask } from "@/service/task.service";


export default function MyProjects() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const favoriteParam = searchParams.get("favorite");
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const itemsPerPage = 20;



  useEffect(() => {
    const loadProjects = async (page: number) => {
      setLoading(true);
      try {
        if(favoriteParam){
          const res = await ProjectService.getFavoriteProject(
          currentPage,
          itemsPerPage
        );
        setProjects(res?.data || []);
        setTotalItems(res?.total || 0);
        }else{
          const res = await ProjectService.getProjectByUserId(
            currentPage,
            itemsPerPage
          );
          setProjects(res?.data || []);
          setTotalItems(res?.total || 0);
        }
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

  const [projectKanbanMap, setProjectKanbanMap] = useState<
    Record<string, { kanbans: KanbanColumn[]; counts: Record<string, number> }>
  >({});

  const fetchKanbonList = async () => {
    try {
      const projectIds: string[] = projects.map((item) => item._id);
      const resultMap: Record<
        string,
        { kanbans: KanbanColumn[]; counts: Record<string, number> }
      > = {};

      for (const projectId of projectIds) {
        const kanbanRes = await ProjectKanbon.getProjectKanbonList(projectId);
        const kanbans: KanbanColumn[] = kanbanRes?.data || [];

        const taskRes = await TaskService.getTasksByProject(projectId);
        const tasks: ITask[] = taskRes?.data || taskRes?.tasks || [];

        const counts: Record<string, number> = {};
        kanbans.forEach((k) => {
          counts[k.title] = tasks.filter((t) => t.status === k.title).length;
        });

        resultMap[projectId] = {
          kanbans,
          counts,
        };
      }

      setProjectKanbanMap(resultMap);
    } catch (error) {
      console.error("Failed to load kanban data:", error);
    }
  };

  useEffect(() => {
    if (projects.length > 0) {
      fetchKanbonList();
    }
  }, [projects]);

  return (
    <div className="max-w-6xl mx-auto md:p-0 p-2">
      <div className="main-content sm:p-2">
        <div>
          <div className="flex justify-center items-center md:p-[24px] p-2 border-b border-[#31394f14]">
            <div className="w-10 cursor-pointer">
              <span onClick={() => router.back()} >
                <Image src={leftarrow} alt="Back" width={16} height={16} />
              </span>
            </div>
            <H5 className="w-[98%] text-center">{favoriteParam ? "My Favorite Projects" : "My Projects"}</H5>
          </div>
          <div className="">
            <div className="pt-4 flex justify-center items-center gap-4 flex-wrap flex-row">
              {loading ? (
                <p>Loading projects...</p>
              ) : projects.length === 0 ? (
                <p className="text-gray-500 text-left italic">No projects found.</p>
              ) : (
                projects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    kanban={projectKanbanMap[project._id]?.kanbans || []}
                    taskCounts={projectKanbanMap[project._id]?.counts || {}}
                    linkTo={`/project/${project.code}`}
                    onFavoriteChange={() => {
                        if (favoriteParam) {
                          const reload = async () => {
                            const res = await ProjectService.getFavoriteProject(
                              currentPage,
                              itemsPerPage
                            );
                            setProjects(res?.data || []);
                            setTotalItems(res?.total || 0);
                          };
                          reload();
                        }
                      }}
                  />
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
