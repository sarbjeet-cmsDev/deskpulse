"use client";
import { useEffect, useState } from "react";
import Datagrid from "@/components/Datagrid/Datagrid";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AdminProjectService from "@/service/adminProject.service";
import AdminTaskService from "@/service/adminTask.service";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

type Task = {
  _id: string;
  title: string;

};

const TaskListTable = () => {
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
  const debouncedSearch = useDebounce(search, 300);

  const fetchTasks = async () => {
    try {
      const res = await AdminTaskService.getAllTasks({
        page,
        limit,
        keyword: debouncedSearch,
        sortOrder,
      });
      setTasks(res.data as Task[]);
      setTotalRecords(res.total);
      setTotalPages(res.totalPages);
      setLimit(res.limit)
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [debouncedSearch, page, sortOrder, sortField]);

  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
    if (pageFromUrl !== page) setPage(pageFromUrl);
  }, [searchParams]);

  const headers = [
    { id: "code", title: "Code", is_sortable: true },
    { id: "title", title: "Title" },
    // { id: "description", title: "Description" },
  ];

  const rows = (tasks ?? []).map((task) => ({
    ...task,
    actions: [{ title: "Delete" }, { title: "View" }],
  }));

  return (
    <div className="flex">
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Task List</h1>
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
            if (action === "View") {
              router.push(`/task/${row.code}`);
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

export default TaskListTable;
