"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
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
import listPlugin from "@fullcalendar/list";
import formatMinutes from "@/utils/formatMinutes";

export default function FullCalendarView() {
  interface ProjectOption {
    label: string;
    value: string;
  }

  const router = useRouter();
  const user: any = useSelector((state: RootState) => state.auth.user) || {};
  const [tasks, setTasks] = useState<any[]>([]);
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [projectOptions, setProjectOptions] = useState<ProjectOption[]>([]);
  const [calendarView, setCalendarView] = useState("dayGridMonth");

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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response: any = await UserService.findAllUser();
        const userData = response.filter(
          (item: any) => item?.roles[0] === "user"
        );
        setUsers(userData || []);
        if (userData.length > 0) {
          const firstUserId = userData[0]._id;
          setSelectedUserIds([firstUserId]);
          fetchTasks([firstUserId]);
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchTasks(selectedUserIds);
    fetchProjects();
  }, [selectedUserIds, selectedProjectId]);

   useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCalendarView("dayGridWeek"); 
      } else {
        setCalendarView("dayGridMonth"); 
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);


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
          <div className="md:w-3/4 w-full">
            <H3 className="text-xl md:text-4xl font-bold text-gray-800">
              Calender
            </H3>
          </div>
          <div className="flex flex-col gap-2 w-full sm:flex-row sm:w-1/3 md:w-1/3 sm:justify-between">
            <div className="w-full">
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
              <div className="w-full flex justify-end">
                <AvatarList
                  users={users}
                  selectedUserIds={selectedUserIds}
                  setSelectedUserIds={setSelectedUserIds}
                  fetchKanbonList={fetchTasks}
                />
              </div>
            )}
          </div>
        </div>

        <div className="z-1 md:w-6/6 w-full z-1">
          <FullCalendar
            plugins={[dayGridPlugin, listPlugin, interactionPlugin]}
            initialView={calendarView}
            events={(() => {
              const allEvents = tasks
                .filter((t) =>
                  ["done", "progress", "code_review"].includes(t.task_status)
                )
                .flatMap((item, index) =>
                  item.calenderBars.map((bars: any, barIndex: number) => {
                    const totalTime = item.timeline_data
                      .filter(
                        (d: any) =>
                          new Date(d.date) >= new Date(bars.start) &&
                          new Date(d.date) <= new Date(bars.end)
                      )
                      .reduce((sum: number, d: any) => sum + d.time_spent, 0);

                    return {
                      title: `${item?.task_code} (${formatMinutes(
                        item?.task_totaltimespent
                      )}) (${item?.task_status})`,
                      id: `${item?.task_code}-${barIndex}`,
                      backgroundColor: getColor(index),
                      textColor: "#fff",
                      start: bars?.start,
                      end:
                        item.task_status === "progress"
                          ? new Date()
                          : bars.end || bars.start,
                      extendedProps: {
                        taskId: item.task_id,
                        totalTime,
                      },
                    };
                  })
                );

              const seen = new Set<string>();
              return allEvents.filter((ev) => {
                const key = `${ev.extendedProps.taskId}-${new Date(ev.start).toDateString()}`;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
              });
            })()}
            eventClick={(info) => {
              info.jsEvent.preventDefault();
              router.push(
                `/task/${info.event.id.split("-").slice(0, 2).join("-")}`
              );
            }}
            eventClassNames={() =>
              "font-semibold text-sm tracking-wide cursor-pointer"
            }
            eventDidMount={(info) => {
              const time = info.event.extendedProps.totalTime;
              if (time && time > 0) {
                info.el.setAttribute(
                  "title",
                  `Log time : ${formatMinutes(time)}`
                );
              }
            }}
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
