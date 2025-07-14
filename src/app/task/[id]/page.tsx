"use client";
import { H5 } from "@/components/Heading/H5";
import { P } from "@/components/ptag";
import Image from "next/image";
import leftarrow from "@/assets/images/back.png";
import Details from "@/components/ProjectDetails/DetailTable";
import DropDownOptions from "@/components/ProjectDetails/DropDown";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
import CommentList from "@/components/Comment/CommnetList";
import Pagination from "@/components/Pagination/pagination";
import CommentInputSection from "@/components/Comment/commentSection";
import TaskChecklistService from "@/service/taskChecklist.service";
import CreateChecklistModal from "@/components/TaskChecklist/createChecklistModal";
import TaskChecklist from "@/components/TaskChecklist/taskChecklist";
import { ITaskChecklist } from "@/types/taskchecklist.interface";

export default function TaskDetails() {
  const params = useParams();
  const taskId = params?.id as string;
  const [task, setTask] = useState<ITask | null>(null);
  const [taskChecklist, setTaskChecklist] = useState<ITaskChecklist[]>([]);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timelines, setTimelines] = useState<ITimeline[]>([]);
  const [timelineTotal, setTimelineTotal] = useState<number>(0);
  const [timelinePage, setTimelinePage] = useState<number>(1);
  const [timelineLimit, setTimelineLimit] = useState<number>(5);

  const [comments, setComments] = useState<IComment[]>([]);
  const [commentTotal, setCommentTotal] = useState<number>(0);
  const [commentPage, setCommentPage] = useState<number>(1);
  const [commentLimit, setCommentLimit] = useState<number>(5);

  const user: IUserRedux | null = useSelector(
    (state: RootState) => state.auth.user
  );

  console.log("checklist", taskChecklist);

  useEffect(() => {
    if (taskId) {
      TaskService.getTaskById(taskId)
        .then((data) => {
          setTask(data);
          if (data.project) {
            fetchProject(data.project);
          }
        })
        .catch((err) => console.error("Failed to load task:", err))
        .finally(() => setLoading(false));

      fetchTimelines(taskId);
      fetchTaskchecklist(taskId);
    }
  }, [taskId]);

  const fetchTaskchecklist = async (taskId: string) => {
    try {
      const data = await TaskChecklistService.getChecklistByTaskId(taskId);
      console.log("data in TaskDetails checklist---", data);
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
      const res = await CommentService.getCommentsByTask(
        taskId,
        commentPage,
        commentLimit
      );
      console.log(res?.data,"kjshkjfhksjhfkjdkshf")
      setComments(res.data);
      setCommentTotal(res.total);
      setCommentPage(res.page);
      setCommentLimit(res.limit);
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
  }, [taskId, commentPage, commentLimit]);
console.log(comments,"ksdjflkdjslkjflksdklj")
  return (
    <div className="max-w-6xl mx-auto">
      <div className="main-content">
        <div>
          <div className="flex justify-between items-center p-[24px] border-b border-[#31394f14]">
            <div className="flex items-center gap-4">
              <div className="">
                <Link href={`/project/${task?.project}`}>
                  <Image src={leftarrow} alt="Logo" width={16} height={16} />
                </Link>
              </div>
              <H5 className="w-[98%] text-center">{task?.title}</H5>
            </div>
            <div className="">
              {/* <DropDownOptions /> */}
            </div>
          </div>

          <div className="pt-4">
            <H5 className="mt-[20px]">Description</H5>
            <P className="text-start">
              {project?.notes || "No description provided."}
              {/* <a href="#" className="text-primary mt-[12px]">
                See Details
              </a> */}
            </P>

            <Details 
            project={project} 
            taskId={taskId}
            onTaskUpdate={() => fetchProject(project?._id)}
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
              />

              <div className="mt-[34px] border-t pt-8">
                <div className="flex justify-between items-center mb-4">
                <H5>Task Checklist</H5>
                <CreateChecklistModal onCreate={handleCreateTaskChecklist} />

                </div>
                <TaskChecklist taskchecklist={taskChecklist} refreshList={() => fetchTaskchecklist(taskId)} />
              </div>

              <CommentInputSection
                taskId={taskId}
                createdBy={user?.id || ""}
                onCommentCreated={() => fetchComments()}
                inline={true}
              />

              <CommentList
                comments={comments}
                refreshComments={() => fetchComments()}
                fetchComments={()=>fetchComments()}
              />

              <Pagination
                currentPage={commentPage}
                totalItems={commentTotal}
                itemsPerPage={commentLimit}
                onPageChange={(page) => setCommentPage(page)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
