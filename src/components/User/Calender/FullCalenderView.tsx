"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import TaskService, { ITask } from "@/service/task.service";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TimelineService from "@/service/timeline.service";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import "sweetalert2/dist/sweetalert2.min.css";
import AvatarList from "@/components/IndexPage/avatarlist";
import ReactSelect from "react-select";
import { useForm, Controller } from "react-hook-form";
import ProjectService from "@/service/project.service";
import UserService from "@/service/user.service";
import { H3 } from "@/components/Heading/H3";

export default function FullCalendarView() {
  interface ProjectOption {
    label: string;
    value: string;
  }

  const router = useRouter();
  const user: any = useSelector((state: RootState) => state.auth.user) || {};
  console.log("user", user);
  const [tasks, setTasks] = useState<any[]>([]);
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [projectOptions, setProjectOptions] = useState<ProjectOption[]>([]);

  console.log("selectedUserIds", selectedUserIds);

  console.log("tasks", tasks);

  const {
    control,
    watch,
    formState: { errors },
  } = useForm({});

  const selectedProjectId = watch("projectId");

  const fetchTasks = async (userIds: string[]) => {
    try {
      let res;
      if (user?.role === "user") {
        res = await TimelineService.getAllTimelineWithTaskDetails(user.id, {
          projectId: selectedProjectId,
        });
      } else if (userIds.length > 0) {
        res = await TimelineService.getAllTimelineWithTaskDetails(
          userIds.join(","),
          { projectId: selectedProjectId }
        );
      }
      setTasks(res?.data || []);
    } catch (e) {
      console.error("Failed to fetch tasks", e);
      setTasks([]);
    }
  };

  const fetchProjects = async () => {
    let res;
    if (user.role === "user") {
      res = await ProjectService.getProjectByUserId();
    } else {
      res = await ProjectService.getAllProject();
    }
    const options = (res?.data || []).map((p: any) => ({
      value: p._id,
      label: p.title,
    }));

    setProjectOptions(options);
  };

  const fetchUsers = async () => {
    try {
      const response: any = await UserService.findAllUser();
      console.log("response", response);
      setUsers(response || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    fetchTasks(selectedUserIds);
    fetchProjects();
    fetchUsers();
  }, [selectedUserIds, selectedProjectId]);

  const formatTime = (time: any) => {
    const totalTime = time || 0;
    const hours = Math.floor(totalTime / 60);
    const minutes = totalTime % 60;
    const totalUpdatedTime =
      hours > 0
        ? minutes > 0
          ? `${hours}h ${minutes}min`
          : `${hours}h`
        : `${minutes}min`;
    return totalUpdatedTime;
  };

  const colors = [
    "#6366f1",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#3b82f6",
    "#8b5cf6",
    "#14b8a6",
    "#ec4899",
    "#84cc16",
    "#f97316",
    "#0ea5e9",
    "#a855f7",
  ];

  function getColor(index: number) {
    return colors[index % colors.length];
  }

  return (
    <div className="flex flex-col">
      <main className="flex-1 p-4 sm:p-6 md:p-8 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="md:w-4/4 w-full">
            <H3 className="text-xl md:text-4xl font-bold text-gray-800">
              Calender
            </H3>
          </div>
          <div className="md:w-1/3 w-full">
            <Controller
              name="projectId"
              control={control}
              render={({ field }) => {
                const selectedOption =
                  projectOptions.find((opt) => opt.value === field.value) ||
                  null;

                const isDisabled =
                  user?.role === "admin" && selectedUserIds.length === 0;
                return (
                  <ReactSelect
                    menuShouldScrollIntoView
                    options={isDisabled ? [] : projectOptions}
                    value={selectedOption}
                    placeholder={
                      isDisabled
                        ? "Please select a user first"
                        : "Select Project"
                    }
                    onChange={(selected) =>
                      field.onChange(selected?.value || null)
                    }
                    isClearable
                    isDisabled={isDisabled}
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: "40px",
                      }),
                      menu: (base) => ({
                        ...base,
                        position: "absolute",
                        zIndex: 15,
                      }),
                      menuList: (base) => ({
                        ...base,
                        paddingTop: 0,
                        paddingBottom: 0,
                      }),
                    }}
                  />
                );
              }}
            />
          </div>
          {user?.role === "admin" && (
            <div className="md:w-1/3 w-full">
              <AvatarList
                users={users}
                selectedUserIds={selectedUserIds}
                setSelectedUserIds={setSelectedUserIds}
                fetchKanbonList={fetchTasks}
              />
            </div>
          )}
        </div>

        <div className="md:w-6/6 w-full z-1">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={tasks
              .filter((t) =>
                ["done", "progress", "code_review"].includes(t.task_status)
              )
              .flatMap((item, index) =>
                item.calenderBars.map((bars: any, barIndex: number) => ({
                  title: `${item?.task_code} (${formatTime(item?.task_totaltimespent)}) (${item?.task_status})`,
                  // date: bars.start,
                  id: `${item?.task_code}-${barIndex}`,
                  backgroundColor: getColor(index),
                  textColor: "#fff",
                  start: bars?.start,
                  end:
                    item.task_status === "progress"
                      ? new Date()
                      : bars.end || bars.start,
                }))
              )}
            eventClick={(info) => {
              info.jsEvent.preventDefault();
              router.push(
                `/task/${info.event.id.split("-").slice(0, 2).join("-")}`
              );
            }}
            eventClassNames={() =>
              "font-semibold text-sm tracking-wide cursor-pointer"
            }
            dayMaxEventRows={6}
            moreLinkClick="popover"
            fixedWeekCount={true}
            expandRows={false}
          />
        </div>
      </main>
    </div>
  );
}
