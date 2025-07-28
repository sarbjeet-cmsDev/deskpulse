"use client";
import { useEffect, useState } from "react";
import Datagrid from "@/components/Datagrid/Datagrid";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useRouter } from "next/navigation";
import AdminProjectService from "@/service/adminProject.service";
import { H1 } from "@/components/Heading/H1";
import { Button } from "@heroui/button";
import { H3 } from "@/components/Heading/H3";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

type Project = {
  _id: string;
  code: string;
  notes?: string;
  avatar?: string;
};

const ProjectListPage = () => {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState("code");
  const debouncedSearch = useDebounce(search, 300);

  const fetchProjects = async () => {
    try {
      const res = await AdminProjectService.getAllProjects({
        page,
        limit,
        keyword: debouncedSearch,
        sortOrder,
      });
      setProjects(res.data as Project[]);
      setTotalRecords(res.total);
      setTotalPages(res.totalPages);
      setLimit(res.limit)
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [debouncedSearch, page, sortOrder, sortField]);

  const headers = [
    { id: "code", title: "Code", is_sortable: true },
    { id: "title", title: "Title" },
    // { id: "description", title: "Description" },
  ];

  const rows = (projects ?? []).map((project) => ({
    ...project,
    actions: [{ title: "Edit" }, { title: "Delete" }],
  }));

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-4 sm:p-6 md:p-8 w-[100%]">
        <div className="flex flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <H3 className="text-lg sm:text-2xl font-semibold">Project List</H3>
          <Button
            onPress={() => router.push("/admin/project/create")}
            className="btn-primary text-white font-semibold py-2 px-4 rounded "
          >
            + Create Project
          </Button>
        </div>
       <div className="">
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
          onPageChange={(newPage) => {
            if (newPage >= 1 && newPage <= totalPages) {
              setPage(newPage);
            }
          }}
          onAction={async (action, row) => {
            if (action === "Edit") {
              router.push(`/admin/project/update/${row._id}`);
            } else if (action === "Delete") {
              const result = await Swal.fire({
                title: "Are you sure?",
                text: `You are about to delete Project: "${row.code}"`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
                reverseButtons: true,
                customClass: {
                  confirmButton:
                    "bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none mr-2",
                  cancelButton:
                    "bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 focus:outline-none",
                },
                buttonsStyling: false,
              });

              if (result.isConfirmed) {
                try {
                  await AdminProjectService.deleteProject(row._id);
                  setProjects((prev) => prev.filter((p) => p._id !== row._id));
                  setTotalRecords((prev) => prev - 1);
                  await fetchProjects();
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
        />
        </div>
      </main>
    </div>
  );
};

export default ProjectListPage;
