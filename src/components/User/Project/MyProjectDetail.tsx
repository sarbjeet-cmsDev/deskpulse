"use client";
import { H5 } from "@/components/Heading/H5";
import Image from "next/image";
import leftarrow from "@/assets/images/back.png";
import ProjectAvtar from "@/assets/images/projectimage.png";
import Details from "@/components/ProjectDetails/DetailTable";
import SubTasks from "@/components/ProjectDetails/SubTaskList";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ProjectService from "@/service/project.service";
import TaskService, { ITask } from "@/service/task.service";
import CreateTaskModal from "@/components/Task/createTaskModal";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import Link from "next/link";
import { Button } from "@heroui/button";
import AvatarList from "@/components/IndexPage/avatarlist";
import AdminUserService from "@/service/adminUser.service";
import { ProjectKanbon } from "@/service/projectKanbon.service";
import { KanbanColumn } from "@/types/projectKanbon.interface";
import { getSocket } from "@/utils/socket";
import { InstructionCard } from "./InstructionCard";
import { UploadImage } from "./UploadImage";

interface Props {
  code: string;
}

export default function MyProjectDetails({ code }: Props) {
  const [projectId, setProjectId] = useState<any>(null);
  const router = useRouter();
  const [project, setProject] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [users, setUsers] = useState([]);
  const [kanbanList, setKanbanList] = useState<KanbanColumn[]>([]);
  const user: any = useSelector((state: RootState) => state.auth.user);
  const [version, setVersion] = useState<number>(Date.now());

  const [projectImage, setProjectImage] = useState<string>(ProjectAvtar.src);
  const loginUser: any = useSelector((state: RootState) => state.user.data);

  const socketRef = useRef(getSocket());

  const fetchProjectByCode = async () => {
    const result = await ProjectService.getProjectByCode(code);
    setProjectId(result?._id);
  };
  useEffect(() => {
    fetchProjectByCode();
  }, [code]);

  useEffect(() => {
    if (project?.avatar) {
      setProjectImage(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}${project.avatar}?v=${version}`
      );
    }
  }, [project, version]);

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
        if (projectId) {
          taskRes = await TaskService.getTasksByProject(projectId);
        }
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

  const fetchTaskByKanbonList = async (userIds: string[]) => {
    try {
      const res = await ProjectKanbon.getProjectKanbonList(projectId);

      const taskRes = await TaskService.getTasksByProject(projectId);

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
    if (user?.id && projectId) {
      setSelectedUserIds([]);
    }
    if (projectId) {
      fetchUsers();
    }
  }, [user?.id]);

  useEffect(() => {
    fetchKanbonList([]);

  }, [projectId])
  const fetchTasks = async (projectId: string, page = 1, limit = 100) => {
    try {
      const res = await TaskService.getTasksByProject(projectId, page, limit);

      if (res?.tasks || res?.data) {
        setTasks(res.tasks || res.data);
      }
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
    if (projectId !== null && projectId !== undefined) {
      fetchProject();
    }
  }, [projectId]);

  const refreshTasks = () => {
    if (project?._id) fetchTasks(project._id);
  };

  const handleCreateTask = async (
    title: string,
    description: string,
    due_date: string,
    estimated_time: number,
    assigned_to?: string
  ) => {
    try {
      await TaskService.createTask({
        title,
        description,
        project: project._id,
        report_to: user?.id || "",
        assigned_to: assigned_to || user?.id || "",
        due_date,
        estimated_time,
      });
      refreshTasks();
      fetchTaskByKanbonList([]);
      fetchTasks(project._id);

      if (title) {
        if (!socketRef.current.connected) {
          socketRef.current.connect();
        }
        socketRef.current.on("connect", () => {
          socketRef.current.emit("register-user", loginUser.id);
        });

        socketRef.current.emit("task-updated", {
          taskId: "1111",
          sender: assigned_to
            ? loginUser.firstName + " " + loginUser.lastName
            : "This",
          receiverId: assigned_to || user?.id || "",
          description: assigned_to
            ? `Assigned you a task : ${title}`
            : `${title} task is assigned by you.`,
        });

        console.log(
          "✅ socket event 'task-updated' hit while assigned user in project"
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading project...</div>;
  if (!project) return <div className="p-6 text-center">Project not found</div>;
  return (
    <div className="max-w-6xl mx-auto">
      <div className="main-content md:p-0 p-3">
        <div>
          <div className="flex justify-between items-center border-b border-[#31394f14] pb-4 max-[768px]:flex-wrap max-[768px]:gap-[10px]">
            <div className="flex items-center gap-2">
              <div className="w-10">
                <Link href="/project/list">
                  <Image src={leftarrow} alt="Logo" width={16} height={16} />
                </Link>
              </div>
              <H5 className="w-[98%] text-center">{project.title}</H5>
            </div>
            <div className="flex items-center">
              <div className="mr-3">
                <CreateTaskModal
                  onCreate={handleCreateTask}
                  projectId={projectId}
                />
              </div>
              <Button
                onPress={() =>
                  router.push(`/project/projectDetail/${projectId}`)
                }
                className="btn-primary text-white block w-full flex justify-center items-center gap-2 text-[14px] leading-[16px] font-bold py-[16px] rounded-[12px] px-[28px]"
              >
                View Kanban
              </Button>
              <UploadImage
                project={project}
                projectId={projectId}
                fetchProject={fetchProject}
              />
            </div>
          </div>
          <div className="">
            <div className="pt-4 ">
              <div className="mt-[14px] h-[175px] overflow-hidden border border-[#e3e3e35c] rounded-[8px]">
                {projectImage ? (
                  <Image
                    src={projectImage}
                    alt="project-avatar"
                    className="rounded-[8px] object-cover w-full h-full"
                    width={1200}
                    height={50}
                  />
                ) : (
                  <Image
                    src={ProjectAvtar}
                    alt="project-avatar-placeholder"
                    className="rounded-[8px] object-cover w-full h-full"
                    width={1200}
                    height={50}
                  />
                )}
              </div>

              <InstructionCard project={project} />
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
              <div className="mt-[20px]">
                <CreateTaskModal
                  onCreate={handleCreateTask}
                  projectId={projectId}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
