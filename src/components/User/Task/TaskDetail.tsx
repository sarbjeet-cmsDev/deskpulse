"use client";
import { H5 } from "@/components/Heading/H5";
import Image from "next/image";
import leftarrow from "@/assets/images/back.png";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import TaskService, { ITask } from "@/service/task.service";
import Link from "next/link";
import TimelineList from "@/components/Task/TimelineList";
import TimelineService, { ITimeline } from "@/service/timeline.service";
import ProjectService from "@/service/project.service";
import { IUserRedux } from "@/types/user.interface";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { IComment } from "@/types/comment.interface";
import CommentService from "@/service/comment.service";
import CommentList from "@/components/Comment/CommentList";
import CommentInputSection from "@/components/Comment/commentSection";
import TaskChecklistService from "@/service/taskChecklist.service";
import CreateChecklistModal from "@/components/TaskChecklist/createChecklistModal";
import TaskChecklist from "@/components/TaskChecklist/taskChecklist";
import { ITaskChecklist } from "@/types/taskchecklist.interface";
import DropdownOptions from "@/components/DropdownOptions";
import DetailsTable from "@/components/Task/taskDetailTable";
import { EstimateTime } from "./EstimateTime";

interface Props {
  id: string;
}

export default function TaskDetails({ id }: Props) {
  const params = useParams();
  const taskCode = params?.id as string;
  const router = useRouter();
  const [task, setTask] = useState<ITask | null>(null);
  const [taskChecklist, setTaskChecklist] = useState<ITaskChecklist[]>([]);
  const [project, setProject] = useState<any>(null);
  const [timelines, setTimelines] = useState<ITimeline[]>([]);
  const [timelineTotal, setTimelineTotal] = useState<number>(0);
  const [timelinePage, setTimelinePage] = useState<number>(1);
  const [timelineLimit, setTimelineLimit] = useState<number>(5);
  const [taskId, setTaskId] = useState<any>(null);
  const [comments, setComments] = useState<IComment[]>([]);

  const user: IUserRedux | null = useSelector(
    (state: RootState) => state.auth.user
  );
  useEffect(() => {
    const getTaskByCode = async () => {
      const result = await TaskService.getTaskByCode(taskCode);
      setTaskId(result?._id);
    };

    getTaskByCode();
  }, [taskCode]);
  const fetchTask = async (id: string) => {
    try {
      const data = await TaskService.getTaskById(id);
      setTask(data);

      if (data.project) {
        fetchProject(data.project);
      }

      fetchTimelines(id);
      fetchTaskchecklist(id);
    } catch (error) {
      console.error("Failed to load task:", error);
    }
  };
  useEffect(() => {
    if (taskId) {
      fetchTask(taskId);
    }
  }, [taskId]);

  const fetchTaskchecklist = async (taskId: string) => {
    try {
      const data = await TaskChecklistService.getChecklistByTaskId(taskId);
      setTaskChecklist(data.checklists);
    } catch (error) {
      console.error("Failed to load task:", error);
    }
  };

  const fetchProject = async (projectId: string) => {
    try {
      const res = await ProjectService.getProjectById(projectId);
      setProject(res);
    } catch (error) {
      console.error("Failed to load project", error);
    }
  };

  const fetchTimelines = async (taskId: string, page = 1, limit = 5) => {
    try {
      const res = await TimelineService.getTimelinesByTask(taskId, page, limit);
      setTimelines(res.data);
      setTimelineTotal(res.total);
      setTimelinePage(res.page);
      setTimelineLimit(res.limit);
    } catch (error) {
      console.error("Failed to load timelines", error);
    }
  };

  const fetchComments = async () => {
    if (!taskId) return;
    try {
      const BIG_LIMIT = 1000;
      const res = await CommentService.getCommentsByTask(taskId, 1, BIG_LIMIT);
      setComments(res.data);
    } catch (error) {
      console.error("Failed to load comments:", error);
      setComments([]);
    }
  };

  const handleCreateTaskChecklist = async (title: string) => {
    try {
      await TaskChecklistService.createChecklist({
        title,
        status: "pending",
        task: taskId,
        created_by: user?.id || "",
        visibility: true,
      });
      fetchTaskchecklist(taskId);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  const handleActivityLog = () => {
    router.push(`/task-activitylog/${task?.code}`);
  };

  const handleViewKanban = () => {
    router.push(`/project/projectDetail/${task?.project}`);
  };

  const handleUpdateTaskDescription = (id: string) => {
    return async (description: string) => {
      try {
        await TaskService.updateTask(id, {
          description,
        });
      } catch (error) {
        console.error(error);
      }
    };
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="main-content md:p-0 p-3">
        <div>
          <div className="flex justify-between items-center border-b border-[#31394f14]">
            <div className="flex items-center gap-2">
              <div className="w-10">
                <Link href={`/project/${task?.code?.split("-")[0]}`}>
                  <Image src={leftarrow} alt="Logo" width={16} height={16} />
                </Link>
              </div>
              <EstimateTime
                user={user}
                task={task}
                taskId={taskId}
                fetchTask={fetchTask}
              />
            </div>
            <div className="">
              <DropdownOptions
                options={[
                  {
                    key: "View Activity Log",
                    label: "View Activity Log",
                    color: "primary",
                    onClick: handleActivityLog,
                  },
                  {
                    key: "View Kanban",
                    label: "View Kanban",
                    color: "primary",
                    onClick: handleViewKanban,
                  },
                ]}
              />
            </div>
          </div>

          <div className="pt-4">
            {task && (
              <CommentInputSection
                key={task._id + (task.description || "")}
                taskId={task._id}
                defaultValue={task.description}
                title="Description"
                onClick={handleUpdateTaskDescription(task?._id)}

                isButton={true}
                inline={true}
                isEditing
              />
            )}

            <DetailsTable
              project={project}
              taskId={taskId}
              task={task}
              // projectId={task?.project}
              fetchTask={fetchTask}
              onTaskUpdate={() => fetchTask(taskId)}
            />

            <div className="mt-[28px]">
              <H5>Task Timeline</H5>

              <TimelineList
                timelines={timelines}
                task={task}
                onLogTimeClick={() => console.log("Open Log Time Modal")}
                totalItems={timelineTotal}
                currentPage={timelinePage}
                itemsPerPage={timelineLimit}
                onPageChange={(page) =>
                  fetchTimelines(taskId, page, timelineLimit)
                }
                refreshTimelines={() =>
                  fetchTimelines(taskId, timelinePage, timelineLimit)
                }
                refreshTask={() => fetchTask(taskId)}
              />

              <div className="mt-[34px] border-t pt-8">
                <div className="flex justify-between items-center mb-4">
                  <H5>Task Checklist</H5>
                  <CreateChecklistModal onCreate={handleCreateTaskChecklist} />
                </div>
                {taskChecklist?.length > 0 && (
                  <TaskChecklist
                    taskchecklist={taskChecklist}
                    refreshList={() => fetchTaskchecklist(taskId)}
                  />
                )}
              </div>

              <CommentInputSection
                taskId={taskId}
                createdBy={user?.id || ""}
                defaultValue=""
                onCommentCreated={() => fetchComments()}
                inline={true}
                isButton={true}
                title="Comment"
                code={taskCode}
              />

              <CommentList
                comments={comments}
                refreshComments={fetchComments}
                fetchComments={() => fetchComments()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
