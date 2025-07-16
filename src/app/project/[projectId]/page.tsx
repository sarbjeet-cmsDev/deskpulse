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
import CommentInputSection from "@/components/Comment/commentSection";

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
      let taskRes;

      if (userIds.length > 0) {
        taskRes = await TaskService.getTasksByUserIds(
          projectId,
          userIds.join(",")
        );
      } else {
        taskRes = await TaskService.getTasksByProject(projectId);
      }

      if (res?.data) {
        setKanbanList(res.data);
      }

      const tasks = taskRes?.data || taskRes?.tasks;
      if (tasks) {
        setTasks(tasks);
      }
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  };
  const fetchUsers = async () => {
    try {
      const data: any = await AdminUserService.getAllUsers();
      const result = await ProjectService.getProjectById(projectId);
      const userIds = new Set(result?.users || []);
      const matchingUsers = data.data.filter((user: any) =>
        userIds.has(user._id)
      );
      if (matchingUsers.length > 0) setUsers(matchingUsers);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };
  useEffect(() => {
    if (user?.id) {
      setSelectedUserIds([]);
      fetchKanbonList([]);
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
      fetchUsers();
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

  const handleCreateTask = async (title: string, description: string) => {
    console.log(description, "89789899889", title);
    try {
      await TaskService.createTask({
        title,
        description,
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
                className="btn-primary"
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
              <div className="py-5">
                <CommentInputSection
                  defaultValue={project?.description}
                  title="Description"
                  onClick={handleUpdateProjectDescription(project?._id)}
                />
              </div>
              <Details
                project={project}
                user={users}
                projectId={projectId}
                onTaskUpdate={() => fetchProject()}
              />

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
