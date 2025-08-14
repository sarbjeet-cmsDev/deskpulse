"use client";
import { H3 } from "@/components/Heading/H3";
import ProjectCard from "@/components/IndexPage/ProjectCard";
import { useEffect,useRef, useState } from "react";
import ProjectService from "@/service/project.service";
import Link from "next/link";
import { P } from "@/components/ptag";
import ReminderService from "@/service/reminder.service";
import SubTasks from "@/components/ProjectDetails/SubTaskList";
import ReminderList from "@/components/Reminder/ReminderList";
import { useRouter } from "next/navigation";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import TaskService from "@/service/task.service";
import { getSocket } from "@/utils/socket";  //socket 



export default function Dashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reminder, setReminder] = useState<any>([]);
  const [task, setTask] = useState<any>([]);

  const user: any = useSelector((state: RootState) => state.auth.user);
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await ProjectService.getProjectByUserId();
        const reminderResult = await ReminderService.getActiveReminderById(user?.id);
        const getTask = await TaskService.getMyTasks();
        setTask(getTask?.data?.slice(0, 5));
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
      const interval = setInterval(() => {
        loadProjects();
      }, 60_000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const socketRef = useRef(getSocket());

useEffect(()=>{
  console.log("socket is there")
const socket = socketRef.current;

if(!socket.connected){
  socket.connect();
}
socket.on('connect', () => {
    socket.emit('register-user', user.id); // Send your user ID immediately
  });


  // return () => {
  //   socket.off('connect');
  //   socket.off('receive-message');
  //   socket.off('connect_error');
  //   socket.off('disconnect');
  //   socket.disconnect();
  // };

},[])


  const router = useRouter();
  return (
    <div>
      <div className="main-content">
        <div className="rounded-tl-[24px] rounded-tr-[24px] bg-white">
          <div className="max-w-6xl mx-auto">
            {reminder?.length > 0 && (
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
                <div className="w-full"><p className="text-gray-500 text-left flex items-left justify-left">No projects available.</p></div>

              ) : (
                projects.map((project) => (
                  <Link
                    className="max-w-[calc(50%-1em)]"
                    key={project._id}
                    href={`/project/${project.code}`}
                  >
                    <ProjectCard project={project}
                      kanban={[]}
                      taskCounts={{}} />
                  </Link>
                ))
              )}
            </div>
            <div>
              <div className="pt-8 flex justify-between items-center">
                <H3>Recent Tasks</H3>
                <div
                  onClick={() => router.push("/mytask")}
                  className="font-bold text-[#31394f99] cursor-pointer"
                >
                  View All
                </div>
              </div>
              <div className="mt-[14px]">
                <SubTasks tasks={task} isKanban={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
