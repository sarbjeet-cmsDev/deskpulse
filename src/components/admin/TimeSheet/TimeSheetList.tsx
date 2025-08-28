"use client";
import { useEffect, useState, useRef } from "react";
import Datagrid from "@/components/Datagrid/Datagrid";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AdminProjectService from "@/service/adminProject.service";
import AdminUserService from "@/service/adminUser.service";
import AvatarList from "@/components/IndexPage/avatarlist";
import { getLocalTimeZone, today, CalendarDate } from "@internationalized/date";
import { Button } from "@heroui/button";
import Image from "next/image";
import ChevronUp from "@/assets/images/chevronup.svg";
import ChevronDown from "@/assets/images/chevrondown.svg";
import { RangeCalendar } from "@heroui/react";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import dayjs from "dayjs";
import AdminTimelineService from "@/service/adminTimeline.service";
import TimelineService from "@/service/timeline.service";
import ReactSelect from "react-select";
import { useForm, Controller } from "react-hook-form";
import { H3 } from "@/components/Heading/H3";
dayjs.extend(isSameOrBefore);

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

type Task = {
  project: any;
  _id: string;
  title: string;
  assigned_to: any;
  totaltaskminutes: any;
  time_spent: any;
};

const TimeSheetList = () => {
  interface ProjectOption {
    label: string;
    value: string;
  }
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(25);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState("code");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const debouncedSearch = useDebounce(search, 300);
  const [users, setUsers] = useState([]);
  const [projectOptions, setProjectOptions] = useState<ProjectOption[]>([]);
  const calendarRef = useRef<HTMLDivElement | null>(null);

  const jsToday = new Date();
  jsToday.setHours(0, 0, 0, 0);

  const startDate = new CalendarDate(
    jsToday.getFullYear(),
    jsToday.getMonth() + 1,
    jsToday.getDate() - 10
  );
  const tomorrow = new CalendarDate(
    jsToday.getFullYear(),
    jsToday.getMonth() + 1,
    jsToday.getDate()
  );

  const [selectedRange, setSelectedRange] = useState<{
    start: CalendarDate;
    end: CalendarDate;
  }>({
    start: startDate,
    end: tomorrow,
  });

  const [showCalendar, setShowCalendar] = useState(false);
  const {
    control,
    watch,
    formState: { errors },
  } = useForm({});

  const selectedProjectId = watch("projectId");

  const fetchTasks = async (userIds: string[]) => {
    if (!selectedRange.start || !selectedRange.end) return;

    const startDate = dayjs(selectedRange.start.toDate(getLocalTimeZone()));
    const endDate = dayjs(selectedRange.end.toDate(getLocalTimeZone()));

    try {
      if (userIds.length > 0) {
        const taskRes = await AdminTimelineService.getTimelineByUserId(
          userIds.join(","),
          {
            start: startDate.format("YYYY-MM-DD"),
            end: endDate.format("YYYY-MM-DD"),
            page,
            projectId: selectedProjectId || undefined,
          }
        );

        setTasks(
          (taskRes.data || []).map((task: any) => ({
            ...task,
            time_spent: task.time_spent ?? 0,
          }))
        );
        setTotalRecords(taskRes.total || 0);
        setTotalPages(Math.ceil((taskRes.total || 0) / limit) || 1);
        setLimit(taskRes.limit || limit);
        setTotalTimeSpent(taskRes.totalTimeSpent);
      } else {
        const res = await AdminTimelineService.getAllTimelineDetails({
          start: startDate.format("YYYY-MM-DD"),
          end: endDate.format("YYYY-MM-DD"),
          projectId: selectedProjectId || undefined,
          page,
          limit,
          keyword: debouncedSearch,
          sortOrder,
        });

        setTasks(
          (res.data || []).map((task: any) => ({
            ...task,
            time_spent: task.time_spent ?? 0,
          }))
        );
        setTotalRecords(res.total || 0);
        setTotalPages(res.totalPages || 1);
        setLimit(res.limit || limit);
        setTotalTimeSpent(res.totalTimeSpent);
      }
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks(selectedUserIds);
  }, [watch("projectId")]);

  useEffect(()=>{
    setPage(1)
  },[selectedProjectId, selectedRange, selectedUserIds])

  const fetchProjects = async () => {
    const projects = await AdminProjectService.getAllProjectListing();
    const options = (projects?.data || []).map((p: any) => ({
      value: p._id,
      label: p.title,
    }));

    setProjectOptions(options);
  };

  useEffect(() => {
    fetchTasks([]);
    fetchUsers();
    fetchProjects();
  }, [debouncedSearch, page, sortOrder, sortField]);

  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
    if (pageFromUrl !== page) setPage(pageFromUrl);
  }, [searchParams]);

  useEffect(() => {
    fetchTasks(selectedUserIds);
  }, [
    debouncedSearch,
    page,
    sortOrder,
    sortField,
    selectedRange,
    selectedUserIds,
  ]);

  const fetchUsers = async () => {
    try {
      const response: any = await AdminUserService.getAllUsers();
      setUsers(response.data || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const headers = [
    { id: "taskNumber", title: "TimeSheet", is_sortable: false },
    { id: "comment", title: "Timeline" },
    { id: "project_name", title: "Project" },
    { id: "task_title", title: "Task" },
    { id: "task_status", title: "Task Status" },
    { id: "totaltaskminutes", title: "Spent Time" },
    { id: "username", title: "User" },
  ];

  const rows = (tasks ?? []).map((task, index) => {
    const totalMinutes = task.time_spent || 0;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const formattedTime =
      hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;

    const globalIndex = (page - 1) * limit + index + 1;

    return {
      ...task,
      taskNumber: globalIndex,
      projectTitle: task.project?.title || "—",
      assignedUserName:
        `${task.assigned_to?.firstName || ""} ${task.assigned_to?.lastName || ""}`.trim() ||
        "—",
      totaltaskminutes: formattedTime,
      actions: [{ title: "View" }, { title: "Delete" }],
    };
  });

  const formattedRange = `${dayjs(
    selectedRange.start.toDate(getLocalTimeZone())
  ).format("DD MMM YY")} - ${dayjs(
    selectedRange.end.toDate(getLocalTimeZone())
  ).format("DD MMM YY")}`;

  const isDateUnavailable = (date: CalendarDate) => {
    return date.compare(tomorrow) > 0;
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    }
    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  const totalTime = totalTimeSpent || 0;
  const hours = Math.floor(totalTime / 60);
  const minutes = totalTime % 60;
  const totalUpdatedTime =
    hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;

  return (
    <div className="flex flex-col">
      <main className="flex-1 p-4 sm:p-6 md:p-8 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="md:w-4/4 w-full">

            <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
              Time Sheet
            </h1>
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-3/4 w-full">
            <div ref={calendarRef} className="md:w-1/3 w-full">
              <Button
                onPress={() => setShowCalendar(!showCalendar)}
                className="flex justify-between items-center w-full border px-4 py-2 rounded bg-white shadow-sm text-sm font-medium"
              >
                <span>{formattedRange}</span>
                <Image
                  src={showCalendar ? ChevronUp : ChevronDown}
                  alt="Toggle Calendar"
                  width={16}
                  height={16}
                />
              </Button>

              <div
                className={`transition-all absolute z-10 duration-300 ease-in-out overflow-hidden border bg-white shadow rounded mt-2 ${showCalendar
                  ? "max-h-[500px] opacity-100 scale-100"
                  : "max-h-0 opacity-0 scale-95"
                  }`}
              >
                <div className="flex justify-end p-2">
                  <Button
                    onPress={() => setShowCalendar(false)}
                    className="text-sm text-gray-500 hover:text-gray-800 h-auto flex justify-end bg-white w-full"
                  >
                    ✕
                  </Button>
                </div>
                <div className="p-2">
                  <RangeCalendar
                    aria-label="Select Range"
                    value={selectedRange as any}
                    onChange={(range) => {
                      setSelectedRange(range as any);
                      setShowCalendar(false);
                    }}
                    isDateUnavailable={isDateUnavailable as any}
                  />
                </div>
              </div>
            </div>
            <div className="md:w-1/3 w-full">
              <Controller
                name="projectId"
                control={control}
                render={({ field }) => {
                  const selectedOption =
                    projectOptions.find((opt) => opt.value === field.value) ||
                    null;
                  return (
                    <ReactSelect
                      menuShouldScrollIntoView
                      options={projectOptions}
                      value={selectedOption}
                      placeholder="Select Project"
                      onChange={(selected) =>
                        field.onChange(selected?.value || null)
                      }
                      isClearable
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: "40px",
                        }),
                        menu: (base) => ({
                          ...base,
                          // zIndex: 9999,
                          // maxHeight: 200,
                          // overflowY: "scroll",
                          position: "absolute",
                        }),
                        menuList: (base) => ({
                          ...base,
                          paddingTop: 0,
                          paddingBottom: 0,
                          // overflowX: "auto",
                        }),
                      }}
                    />
                  );
                }}
              />
            </div>
            <div className="md:w-1/3 w-full">
              <AvatarList
                users={users}
                selectedUserIds={selectedUserIds}
                setSelectedUserIds={setSelectedUserIds}
                fetchKanbonList={fetchTasks}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-6/6 w-full">
            <Datagrid
              headers={headers}
              rows={rows}
              pagination={{
                total_records: totalRecords,
                total_page: totalPages,
                current_page: page,
                limit: limit,
              }}
              onAction={async (action, row) => {
                if (action === "View") {
                  router.push(`/task/${row.task_code}`);
                } else if (action === "Delete") {
                  const result = await Swal.fire({
                    title: "Are you sure?",
                    text: `You are about to delete Timeline: "${row.comment}"`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, delete it!",
                    cancelButtonText: "No, cancel!",
                    reverseButtons: true,
                    customClass: {
                      confirmButton:
                        "bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none mr-2",
                      cancelButton:
                        "bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 focus:outline-none mr-2",
                    },
                    buttonsStyling: false,
                  });

                  if (result.isConfirmed) {
                    try {
                      await TimelineService.deleteTimeline(row._id);
                      setTasks((prev) => prev.filter((p) => p._id !== row._id));
                      setTotalRecords((prev) => prev - 1);
                      await fetchTasks([]);
                    } catch (err) {
                      console.error("Delete failed", err);
                      Swal.fire("Error", "Failed to delete project.", "error");
                    }
                  }
                }
              }}
              sort={{ field: sortField, order: sortOrder }}
              onSort={(field) => {
                setSortField(field);
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                setPage(1);
              }}
              router={router}
              pathname={pathname}
              searchParams={searchParams}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-10 p-4 bg-gray-50 rounded-2xl shadow-sm w-fit">
          <H3 className="text-gray-700 md:text-[28px] text-sm">Total Time Spent</H3>
          <span className="ml-4 px-3 py-1 rounded-xl bg-theme-primary text-white font-semibold">
            {totalUpdatedTime}
          </span>
        </div>
      </main>
    </div>
  );
};

export default TimeSheetList;
