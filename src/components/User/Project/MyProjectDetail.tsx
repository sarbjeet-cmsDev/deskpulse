"use client";
import { H5 } from "@/components/Heading/H5";
import { P } from "@/components/ptag";
import Image from "next/image";
import leftarrow from "@/assets/images/back.png";
import ProjectAvtar from "@/assets/images/projectimage.png";
import Details from "@/components/ProjectDetails/DetailTable";
import SubTasks from "@/components/ProjectDetails/SubTaskList";
import DropDownOptions from "@/components/ProjectDetails/DropDown";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProjectService from "@/service/project.service";
import TaskService, { ITask } from "@/service/task.service";
import CreateTaskModal from "@/components/Task/createTaskModal";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { IUserRedux } from "@/types/user.interface";
import Link from "next/link";
import { Button } from "@heroui/button";
import AvatarList from "@/components/IndexPage/avatarlist";
import AdminUserService from "@/service/adminUser.service";
import { ProjectKanbon } from "@/service/projectKanbon.service";
import { KanbanColumn } from "@/types/projectKanbon.interface";
import CommentInputSection from "@/components/Comment/commentSection";
import DropdownOptions from "@/components/DropdownOptions";

interface Props {
  projectId : string;
}


export default function MyProjectDetails({projectId}:Props) {
//   const params = useParams();
//   const projectId = params?.projectId as string;
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [version, setVersion] = useState<number>(Date.now());

  const [projectImage, setProjectImage] = useState<string>(ProjectAvtar.src)

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
      fetchTasks(project._id);
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

  const handleProjectAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await ProjectService.uploadProjectAvatar(
        projectId as string,
        file
      );

      if (res) {
        const avatarUrl = res?.avatar
          ? `${process.env.NEXT_PUBLIC_BACKEND_HOST}${res?.avatar}?v=${version}`
          : ProjectAvtar.src;
        setProjectImage(avatarUrl);
        setVersion(Date.now());
        fetchProject();
      } else {
        console.error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading project...</div>;
  if (!project) return <div className="p-6 text-center">Project not found</div>;
 
  return (
    <div className="max-w-6xl mx-auto">
      <div className="main-content">
        <div>
          <div className="flex justify-between items-center border-b border-[#31394f14] pb-4">
            <div className="flex items-center gap-2">
              <div className="w-10">
                <Link href="/project/list">
                  <Image src={leftarrow} alt="Logo" width={16} height={16} />
                </Link>
              </div>
              <H5 className="w-[98%] text-center">{project.title}</H5>
            </div>
            <div className="flex items-center">
              <Button
                onPress={() =>
                  router.push(`/project/projectDetail/${projectId}`)
                }
                className="btn-primary px-4 py-2 text-sm md:text-base w-full md:w-auto"
              >
                View Kanban
              </Button>
              <div className="">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <DropdownOptions
                  options={[
                    {
                      key: "Update Project Avatar",
                      label: "Update Project Avatar",
                      color: "primary",
                      onClick: handleProjectAvatar,
                    },
                  ]}
                />
              </div>
            </div>
          </div>
          <div className="">
            <div className="pt-4 ">
              <div className="mt-[14px] h-[175px] overflow-hidden border border-[#e3e3e35c] rounded-[8px]" >
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
              <div className="flex flex-col gap-2 py-5">
                <CommentInputSection
                  defaultValue={project?.description}
                  title="Description"
                  onClick={handleUpdateProjectDescription(project?._id)}
                  isButton={true}
                />
          
                 <CommentInputSection
                  defaultValue={project?.deploy_instruction}
                  title="Deploy Instruction"
                  // onClick={handleUpdateProjectDescription(project?._id)}
                  isButton={false}
                /> 
                <CommentInputSection
                  defaultValue={project?.critical_notes}
                  title="Critical Notes"
                  // onClick={handleUpdateProjectDescription(project?._id)}
                  isButton={false}
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
