"use client";
import { SetStateAction, useEffect, useState } from "react";
import Datagrid from "@/components/Datagrid/Datagrid";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AdminProjectService from "@/service/adminProject.service";
import AdminTaskService from "@/service/adminTask.service";
import AdminUserService from "@/service/adminUser.service";
import ProjectService from "@/service/project.service";
import TaskService from "@/service/task.service";
import AvatarList from "@/components/IndexPage/avatarlist";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Button } from "@heroui/button";
import Image from "next/image";
import ChevronUp from "@/assets/images/chevronup.svg";
import ChevronDown from "@/assets/images/chevrondown.svg";
import { RangeCalendar } from "@heroui/react";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import dayjs from "dayjs";
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
};

const TimeSheetList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState("code");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const debouncedSearch = useDebounce(search, 300);
  const [users, setUsers] = useState([]);
  const [selectedRange, setSelectedRange] = useState<{
    start: any;
    end: any;
  }>({
    start: today(getLocalTimeZone()).add({ weeks: -1 }),
    end: today(getLocalTimeZone()).add({ weeks: 1 }),
  });

  const [showCalendar, setShowCalendar] = useState(false);

  const fetchTasks = async (userIds: string[]) => {
    if (!selectedRange.start || !selectedRange.end) return;

    const startDate = dayjs(selectedRange.start.toDate(getLocalTimeZone()));
    const endDate = dayjs(selectedRange.end.toDate(getLocalTimeZone()));

    try {
      // let taskRes;

      if (userIds.length > 0) {
        const taskRes = await TaskService.getTasksByAssignedUser(userIds.join(","), {
          start: startDate.format("YYYY-MM-DD"),
          end: endDate.format("YYYY-MM-DD"),
          page,
        });

        setTasks(
          (taskRes.data || []).map((task) => ({
            ...task,
            totaltaskminutes: task.totaltaskminutes ?? 0,
          }))
        );
        setTotalRecords(taskRes.total || 0);
        setTotalPages(Math.ceil((taskRes.total || 0) / limit) || 1);
        setLimit(taskRes.limit || limit);
      } else {
        const res = await AdminTaskService.getAllTasksDetails({
          start: startDate.format("YYYY-MM-DD"),
          end: endDate.format("YYYY-MM-DD"),
          page,
          limit,
          keyword: debouncedSearch,
          sortOrder,
        });


        setTasks(
          (res.data || []).map((task) => ({
            ...task,
            totaltaskminutes: task.totaltaskminutes ?? 0,
          }))
        );
        setTotalRecords(res.total || 0);
        setTotalPages(res.totalPages || 1);
        setLimit(res.limit || limit);
      }
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks([]);
    fetchUsers();
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
    { id: "title", title: "Task Title" },
    { id: "totaltaskminutes", title: "Spent Time" },
    { id: "projectTitle", title: "Project" },
    { id: "assignedUserName", title: "User" },
  ];

  const rows = (tasks ?? []).map((task, index) => {
    const totalMinutes = task.totaltaskminutes || 0;
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
      actions: [{ title: "Delete" }],
    };
  });



  const formattedRange = `${dayjs(
    selectedRange.start.toDate(getLocalTimeZone())
  ).format("DD MMM YY")} - ${dayjs(
    selectedRange.end.toDate(getLocalTimeZone())
  ).format("DD MMM YY")}`;

  return (
    <div className="flex">
      <main className="flex-1 p-6 sm:p-6 md:p-8 w-[100%]">
        <div className="flex justify-between items-center mb-4">
          <h1 className="md:text-2xl font-semibold">Time Sheet</h1>
          <AvatarList
            users={users}
            selectedUserIds={selectedUserIds}
            setSelectedUserIds={setSelectedUserIds}
            fetchKanbonList={fetchTasks}
          />
        </div>
        <div className="flex flex-col md:flex-row md:items-start py-6 gap-2">
          <div className="md:w-[15%]">
            <Button
              onPress={() => setShowCalendar(!showCalendar)}
              className="flex items-center gap-9 border px-4 py-2 rounded bg-white shadow text-sm font-medium"
            >
              {formattedRange}
              <Image
                src={showCalendar ? ChevronUp : ChevronDown}
                alt="Toggle"
                width={16}
                height={16}
              />
            </Button>

            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden bg-white border shadow rounded mt-2 ${showCalendar
                ? "max-h-[500px] opacity-100 scale-100"
                : "max-h-0 opacity-0 scale-95"
                }`}
            >
              <div className="flex justify-end p-2">
                <Button
                  onPress={() => setShowCalendar(false)}
                  className="text-sm text-gray-500 hover:text-gray-800"
                >
                  ✕
                </Button>
              </div>
              <div className="p-2">
                <RangeCalendar
                  aria-label="Select Range"
                  value={selectedRange}
                  onChange={setSelectedRange}
                />
              </div>
            </div>
          </div>
          <div className="md:w-[85%]">
            <Datagrid
              headers={headers}
              rows={rows}
              pagination={{
                total_records: totalRecords,
                total_page: totalPages,
                current_page: page,
                limit: limit,
              }}
              // onSearch={(query) => {
              //   setSearch(query);
              //   setPage(1);
              // }}
              onAction={async (action, row) => {
                if (action === "Edit") {
                  router.push(`/admin/project/update/${row._id}`);
                } else if (action === "Delete") {
                  const result = await Swal.fire({
                    title: "Are you sure?",
                    text: `You are about to delete Task: "${row.code}"`,
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
                      await AdminTaskService.deleteTask(row._id);
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
      </main>
    </div>
  );
};

export default TimeSheetList;
