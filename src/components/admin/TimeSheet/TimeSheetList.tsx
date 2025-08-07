"use client";
import { useEffect, useState } from "react";
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
  assigned_to:any;
  totaltaskminutes:any;

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

  const fetchTasks = async () => {
    try {
      const res = await AdminTaskService.getAllTasksDetails({
        page,
        limit,
        keyword: debouncedSearch,
        sortOrder,
      });

      const ress = await TaskService.getMyTasks();
      console.log("res.data",res.data)
      setTasks(res.data as Task[]);
      setTotalRecords(res.total);
      setTotalPages(res.totalPages);
      setLimit(res.limit)
      fetchUsers();
      fetchKanbonList([])
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  };

   const fetchKanbonList = async (userIds: string[]) => {
    try {
      // const res = await ProjectKanbon.getProjectKanbonList(projectId);
      let taskRes;

      if (userIds.length > 0) {
        taskRes = await TaskService.getTasksByAssignedUser(userIds.join(","))
        console.log("taskRes",taskRes)
      } else {
        taskRes = await AdminTaskService.getAllTasksDetails({
        page,
        limit,
        keyword: debouncedSearch,
        sortOrder,
      });
      console.log("taskRes22",taskRes.data)
      }

      // if (res?.data) {
      //   setKanbanList(res.data);
      // }

      // const task = taskRes?.data || taskRes?.tasks;
      // if (task) {
      //   setTasks(task as Task[]);
      // }
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [debouncedSearch, page, sortOrder, sortField]);

  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
    if (pageFromUrl !== page) setPage(pageFromUrl);
  }, [searchParams]);

  const fetchUsers = async () => {
    try {
      const response: any = await AdminUserService.getAllUsers();
      setUsers(response.data || []);
      // const result = await ProjectService.getProjectById(projectId);
      // const userIds = new Set(result?.users || []);
      // const matchingUsers = data.data.filter((user: any) =>
      //   userIds.has(user._id)
      // );
      // if (matchingUsers.length > 0) setUsers(matchingUsers);
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
    assignedUserName: `${task.assigned_to?.firstName || ""} ${task.assigned_to?.lastName || ""}`.trim() || "—",
    totaltaskminutes: formattedTime,
    actions: [{ title: "Delete" }],
  };
});

  return (
    <div className="flex">
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Time Sheet</h1>
           <AvatarList
                              users={users}
                              selectedUserIds={selectedUserIds}
                              setSelectedUserIds={setSelectedUserIds}
                              fetchKanbonList={fetchKanbonList}
                            />
        </div>

        <Datagrid
          headers={headers}
          rows={rows}
          pagination={{
            total_records: totalRecords,
            total_page: totalPages,
            current_page: page,
            limit: limit,
          }}
          onSearch={(query) => {
            setSearch(query);
            setPage(1);
          }}
          
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
                  await fetchTasks();
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
      </main>
    </div>
  );
};

export default TimeSheetList;
