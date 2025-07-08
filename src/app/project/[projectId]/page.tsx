"use client";
import { H5 } from "@/components/Heading/H5";
import { P } from "@/components/ptag";
import Image from "next/image";
import leftarrow from "@/assets/images/back.png";
import ProjectImage from "@/assets/images/projectimage.png";
import Details from "@/components/ProjectDetails/DetailTable";
import SubTasks from "@/components/ProjectDetails/SubTaskList";
import DropDownOptions from "@/components/ProjectDetails/DropDown";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProjectService from "@/service/project.service";
import TaskService, { ITask } from "@/service/task.service";
import CreateTaskModal from "@/components/Task/createTaskModel";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { IUser } from "@/types/user.interface";
import Link from "next/link";
import Pagination from "@/components/Pagination/pagination";


export default function MyProjectDetails() {
  const params = useParams();
  const projectId = params?.projectId as string;
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [taskTotal, setTaskTotal] = useState<number>(0);
  const [taskPage, setTaskPage] = useState<number>(1);
  const [taskLimit, setTaskLimit] = useState<number>(5);
  const user: IUser | null = useSelector((state: RootState) => state.auth.user);

  const fetchTasks = async (projectId: string, page = 1, limit = 5) => {
    try {
      const res = await TaskService.getTasksByProject(projectId, page, limit);
      setTasks(res.data);
      setTaskTotal(res.total);
      setTaskPage(res.page);
      setTaskLimit(res.limit)

    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  useEffect(() => {
    if (projectId) {
      ProjectService.getProjectById(projectId as string)
        .then((data) => {
          setProject(data);
          fetchTasks(data._id);
        })
        .catch((err) => console.error("Failed to load project", err))
        .finally(() => setLoading(false));
    }
  }, [projectId]);

  const refreshTasks = () => {
    if (project?._id) fetchTasks(project._id);
  };

  const handleCreateTask = async (title: string) => {
    try {
      await TaskService.createTask({
        title,
        project: project._id,
        report_to: user?.id || '',
        assigned_to:user?.id || '',
      
      });
      refreshTasks();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading project...</div>;
  if (!project) return <div className="p-6 text-center">Project not found</div>;

  return (
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
              <H5 className="w-[98%] text-center">{project.code}</H5>
            </div>
            <div className="">
              <DropDownOptions />
            </div>
          </div>
          <div className="">
            <div className="pt-4 ">
              <div className="mt-[14px]  h-[175px] overflow-hidden border border-[#e3e3e35c] rounded-[8px]">
                <Image
                  src={ProjectImage}
                  alt="project-image"
                  className="rounded-[8px]"
                />
              </div>
              <H5 className="mt-[20px]">Description</H5>
              <P className="text-start">
                {project?.notes || "No description provided."}
                <a href="#" className="text-primary mt-[12px]">
                  See Details
                </a>
              </P>
              <Details project={project} />
              <div className="mt-[20px]">
                <a
                  href="#"
                  className="text-[#7980ff] bg-[#7980ff1f] py-[16px] px-[28px] rounded-[12px] w-full text-[14px] leading-[16px] font-bold text-center block"
                >
                  Add Custom Section
                </a>
              </div>
              <div className="mt-[28px]">
                <H5>Tasks</H5>
                <SubTasks tasks={tasks} />
                <Pagination
                        currentPage={taskPage}
                        totalItems={taskTotal}
                        itemsPerPage={taskLimit}
                        onPageChange={(page) => fetchTasks(projectId, page, taskLimit)}
                      />
              </div>
              <div className="mt-[5px]">
                <CreateTaskModal onCreate={handleCreateTask} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
