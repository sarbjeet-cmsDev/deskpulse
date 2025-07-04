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

export default function TaskDetails() {
  const params = useParams();
  const taskId = params?.id as string;
  const [task, setTask] = useState<ITask | null>(null);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timelines, setTimelines] = useState<ITimeline[]>([]);
  const [timelineTotal, setTimelineTotal] = useState<number>(0);
  const [timelinePage, setTimelinePage] = useState<number>(1);
  const [timelineLimit, setTimelineLimit] = useState<number>(5);
  console.log('timelines in TaskDetails',timelines)

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
    }
  }, [taskId]);

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
  const handleLogTimeClick = () => {
    console.log("Open Log Time Modal");
  };

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
              <DropDownOptions />
            </div>
          </div>
          <div className="">
            <div className="pt-4 ">
              <H5 className="mt-[20px]">Description</H5>
              <P className="text-start">
                {project?.notes || "No description provided."}
                <a href="#" className="text-primary mt-[12px]">
                  See Details
                </a>
              </P>
              <Details project={project} />
              <div className="mt-[28px]">
                <H5>Task Timeline</H5>

                <TimelineList
                  timelines={timelines}
                  task={task}
                  onLogTimeClick={handleLogTimeClick}
                  totalItems={timelineTotal}
                  currentPage={timelinePage}
                  itemsPerPage={timelineLimit}
                  onPageChange={(page) => fetchTimelines(taskId, page, timelineLimit)}
                   refreshTimelines={() => fetchTimelines(taskId, timelinePage, timelineLimit)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
