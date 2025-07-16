"use client";
import TopHeader from "@/components/IndexPage/TopHeader";
import { H3 } from "@/components/Heading/H3";
import ProjectCard from "@/components/IndexPage/ProjectCard";
import TodayTaskCard from "@/components/IndexPage/TodayTask";
import AddTask from "@/components/addtask";
import { InputSearch } from "@/components/search";
import { useEffect, useState } from "react";
import ProjectService from "@/service/project.service";
import Link from "next/link";
import { P } from "@/components/ptag";
import ReminderService from "@/service/reminder.service";
import SubTasks from "@/components/ProjectDetails/SubTaskList";
import { H1 } from "@/components/Heading/H1";
import ReminderList from "@/components/Reminder/ReminderList";
import { useRouter } from "next/navigation";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

export default function Dashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reminder, setReminder] = useState<any>([]);
  const user: any = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await ProjectService.getProjectByUserId();
        const reminderResult = await ReminderService.getReminderById(user?.id);
        console.log(reminderResult, "reminderResultreminderResult");
        setReminder(reminderResult?.reminders?.slice(0, 5));
        setProjects(res.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      loadProjects();
    }
  }, []);
  const router = useRouter();
  console.log(reminder, "reminderreminder");
  return (
    <div>
      <div className="main-content">
        <div className="rounded-tl-[24px] rounded-tr-[24px] bg-white">
          <div className="max-w-6xl mx-auto">
            {reminder?.length>0 && (
              <>
              <H3 className="flex flex-start">Reminders</H3>
              <ReminderList reminders={reminder} />
              {reminder?.length > 4 && (
                <P
                  className="flex flex-start py-3 cursor-pointer"
                  onClick={() => router.push("/reminder")}
                >
                  See more
                </P>
              )}
</>
            )}
            <div className="pt-4 flex justify-between items-center">
              <H3>Recent Projects</H3>
              <Link
                className="font-bold text-[#31394f99]"
                href={`/project/list`}
              >
                View All
              </Link>
            </div>
            <div className="pt-4 flex justify-center items-center gap-4 flex-wrap flex-row">
              {loading ? (
                <p>Loading projects...</p>
              ) : projects.length === 0 ? (
                <p>No projects found.</p>
              ) : (
                projects.map((project) => (
                  <Link
                    className="max-w-[calc(50%-1em)]"
                    key={project._id}
                    href={`/project/${project._id}`}
                  >
                    <ProjectCard project={project} />
                  </Link>
                ))
              )}
            </div>
            {/* <div>
                                <div className="pt-8 flex justify-between items-center">
                                    <H3>Today Tasks</H3>
                                    <a href="#" className="font-bold text-[#31394f99]">View All</a>
                                </div>
                                <div className="mt-[14px]">
                                    <TodayTaskCard/>
                                </div>
                            </div> */}
          </div>
        </div>
      </div>
    </div>
    //  </div>
  );
}
