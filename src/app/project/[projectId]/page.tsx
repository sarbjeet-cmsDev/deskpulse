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
import { useParams, useRouter } from "next/navigation";
import ProjectService from "@/service/project.service";
import TaskService, { ITask } from "@/service/task.service";
import CreateTaskModal from "@/components/Task/createTaskModal";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { IUserRedux } from "@/types/user.interface";
import Link from "next/link";
import Pagination from "@/components/Pagination/pagination";
import { Button } from "@heroui/button";
import AvatarList from "@/components/IndexPage/avatarlist";
import AdminUserService from "@/service/adminUser.service";
import { ProjectKanbon } from "@/service/projectKanbon.service";
import { KanbanColumn } from "@/types/projectKanbon.interface";
import UpdateProjectDescriptionModal from "@/components/ProjectDetails/UpdateProjectDescriptionModal";

export default function MyProjectDetails() {
  const params = useParams();
  const projectId = params?.projectId as string;
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [taskTotal, setTaskTotal] = useState<number>(0);
  const [taskPage, setTaskPage] = useState<number>(1);
  const [taskLimit, setTaskLimit] = useState<number>(5);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [users, setUsers] = useState([]);
  const [kanbanList, setKanbanList] = useState<KanbanColumn[]>([]);
  const user: any = useSelector((state: RootState) => state.auth.user);
  const fetchKanbonList = async (userIds: string[]) => {
    try {
      const res = await ProjectKanbon.getProjectKanbonList(projectId);
      const taskRes = await TaskService.getTasksByUserIds(
        projectId,
        userIds.join(",")
      );
      if (res?.data) setKanbanList(res.data);
      if (taskRes?.tasks) setTasks(taskRes.tasks);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  };
  const fetchUsers = async () => {
    try {
      const data: any = await AdminUserService.searchUsers();
      setUsers(data || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };
  useEffect(() => {
    if (user?.id) {
      setSelectedUserIds([user.id]);
      fetchKanbonList([user.id]);
    }
    fetchUsers();
  }, [user?.id]);
  const fetchTasks = async (projectId: string, page = 1, limit = 50) => {
    try {
      const res = await TaskService.getTasksByProject(projectId, page, limit);

      setTaskTotal(res.total);
      setTaskPage(res.page);
      setTaskLimit(res.limit);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const fetchProject = async () => {
    try {
      if (!projectId) return;

      const data = await ProjectService.getProjectById(projectId as string);
      setProject(data);
      fetchTasks(data._id);
    } catch (error) {
      console.error("Failed to load project", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const refreshTasks = () => {
    if (project?._id) fetchTasks(project._id);
  };

  const handleCreateTask = async (title: string) => {
    try {
      await TaskService.createTask({
        title,
        project: project._id,
        report_to: user?.id || "",
        assigned_to: user?.id || "",
      });
      refreshTasks();
      fetchKanbonList([user.id]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateProjectDescription = (id: string) => {
    return async (description: string) => {
      try {
        await ProjectService.updateProject(id, {
          description,
          is_active: true,
        });
        fetchProject();
      } catch (error) {
        console.error(error);
      }
    };
  };

  if (loading) return <div className="p-6 text-center">Loading project...</div>;
  if (!project) return <div className="p-6 text-center">Project not found</div>;
  console.log(tasks, "tasks");
  return (
    <div className="max-w-6xl mx-auto">
      <div className="main-content">
        <div>
          <div className="flex justify-between items-center p-[24px] border-b border-[#31394f14]">
            <div className="flex items-center gap-4">
              <div className="">
                <Link href="/project/list">
                  <Image src={leftarrow} alt="Logo" width={16} height={16} />
                </Link>
              </div>
              <H5 className="w-[98%] text-center">{project.code}</H5>
            </div>
            <div className="">
              <Button
                onPress={() =>
                  router.push(`/project/projectDetail/${projectId}`)
                }
              >
                View Kanban
              </Button>
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
              <P className="text-start text-gray-700 text-sm">
                {project?.description || "description."}
                <UpdateProjectDescriptionModal
                  onUpdate={handleUpdateProjectDescription(projectId)}
                  projectId={projectId}
                />
              </P>
              <Details
                project={project}
                taskId={""}
                onTaskUpdate={() => fetchTasks(project?._id)}
              />
              {/* <div className="mt-[20px]">
                <a
                  href="#"
                  className="text-[#7980ff] bg-[#7980ff1f] py-[16px] px-[28px] rounded-[12px] w-full text-[14px] leading-[16px] font-bold text-center block"
                >
                  Add Custom Section
                </a>
              </div> */}
              <div className="mt-[28px]">
                <div className="flex justify-between">
                  <H5>Tasks</H5>
                  <AvatarList
                    users={users}
                    selectedUserIds={selectedUserIds}
                    setSelectedUserIds={setSelectedUserIds}
                    fetchKanbonList={fetchKanbonList}
                  />
                </div>
                <SubTasks tasks={tasks} kanbanList={kanbanList} />
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
