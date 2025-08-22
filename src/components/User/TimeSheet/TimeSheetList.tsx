"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProjectService from "@/service/project.service";
import AvatarList from "@/components/IndexPage/avatarlist";
import TaskButton from "@/components/taskButton";
import CreateGlobalTaskModal from "@/components/CreateGlobalTaskModal";

type ProjectTask = {
  totaltaskminutes: number;
};

type ProjectEntry = {
  title: string;
  tasks: ProjectTask[];
};

type ProjectItem = {
  _id: string;
  project: ProjectEntry[];
};

type FlattenedProject = {
  parentId: string;
  title: string;
  tasks: ProjectTask[];
  totalMinutes: number;
};

const TimeSheetList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [flattenedProjects, setFlattenedProjects] = useState<FlattenedProject[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");

const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);



  // Sync page with URL on mount & on URL changes
  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
    if (!isNaN(pageFromUrl) && pageFromUrl !== page) {
      setPage(pageFromUrl);
    }
  }, [searchParams]);

  // Update URL when page changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams as any);
    params.set("page", String(page));
    if (searchTitle) params.set("title", searchTitle);
    else params.delete("title");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [page, searchTitle]);

  // Reset page to 1 when searchTitle changes
  useEffect(() => {
    setPage(1);
  }, [searchTitle]);

  // Fetch projects on page or searchTitle change
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const res = await ProjectService.getProjectsDetail(page, itemsPerPage, searchTitle);
        const projectData = res?.data || [];

        const allProjects: FlattenedProject[] = [];
        projectData.forEach((projectItem: ProjectItem) => {
          projectItem.project.forEach((proj) => {
            const totalMinutes = (proj.tasks || []).reduce(
              (acc, task) => acc + (task.totaltaskminutes || 0),
              0
            );
            allProjects.push({
              parentId: projectItem._id,
              title: proj.title,
              tasks: proj.tasks,
              totalMinutes,
            });
          });
        });

        setFlattenedProjects(allProjects);
        setTotalRecords(res?.total || 0);
        setTotalPages(Math.ceil((res?.total || 0) / itemsPerPage));
      } catch (err) {
        console.error("Error fetching projects:", err);
        setFlattenedProjects([]);
        setTotalRecords(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [page, searchTitle]);

  const headers = [
    { id: "taskNumber", title: "S.no" },
    { id: "title", title: "Project Assigned" },
    { id: "totaltaskminutes", title: "Time Logged" },
  ];

  const rows = flattenedProjects.map((proj, index) => {
    const hours = Math.floor(proj.totalMinutes / 60);
    const minutes = proj.totalMinutes % 60;
    const formattedTime =
      proj.totalMinutes === 0
        ? "0"
        : hours > 0
        ? `${hours}h ${minutes}min`
        : `${minutes}min`;

    return {
      _id: `${proj.parentId}-${index}`,
      taskNumber: (page - 1) * itemsPerPage + index + 1,
      title: proj.title || "—",
      totaltaskminutes: formattedTime,
    };
  });

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };
return (
  <div className="min-h-screen bg-gray-100 py-10">
    <main className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Time Sheet</h1>
        <AvatarList users={[]} selectedUserIds={[]} setSelectedUserIds={() => {}} />
      </div>


      <div className="mb-8 max-w-sm">
        <label htmlFor="searchTitle" className="block text-gray-700 font-semibold mb-2">
          Filter by Project 
        </label>
        <input
          id="searchTitle"
          type="text"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          placeholder="Search project title..."
          className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition"
          autoComplete="off"
        />
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5">
        {loading ? (
          <div className="flex justify-center items-center h-48 text-gray-400 font-medium">
            Loading...
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-indigo-50 to-indigo-100">
              <tr>
                {headers.map(({ id, title }) => (
                  <th
                    key={id}
                    scope="col"
                    className="px-8 py-4 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider select-none"
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={headers.length}
                    className="py-12 text-center text-gray-500 text-lg italic"
                  >
                    No records found.
                  </td>
                </tr>
              ) : (
                rows.map((row, idx) => (
                  <tr
                    key={row._id}
                    className="hover:bg-indigo-50 transition-colors duration-200 cursor-pointer"
                  >
                    <td className="whitespace-nowrap px-8 py-5 text-sm font-medium text-gray-700">
                      {row.taskNumber}
                    </td>
                    <td className="whitespace-nowrap px-8 py-5 text-sm font-semibold text-gray-900">
                      {row.title}
                    </td>
                    <td className="whitespace-nowrap px-8 py-5 text-sm text-gray-600">
                      {row.totaltaskminutes}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <nav
        className="mt-10 flex justify-center items-center gap-4"
        aria-label="Pagination"
      >
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page === 1 || loading}
          className="rounded-full border border-indigo-300 bg-white px-5 py-2 text-indigo-600 font-semibold hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          aria-label="Previous Page"
        >
          &larr; Previous
        </button>

        <span className="font-semibold text-gray-700">
          Page <span className="text-indigo-600">{page}</span> of{" "}
          <span className="text-indigo-600">{totalPages}</span>
        </span>

        <button
          onClick={() => goToPage(page + 1)}
          disabled={page === totalPages || loading}
          className="rounded-full border border-indigo-300 bg-white px-5 py-2 text-indigo-600 font-semibold hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          aria-label="Next Page"
        >
          Next &rarr;
        </button>
      </nav>
    </main>
          <TaskButton onClick={openModal} />

      {isModalOpen && (
<CreateGlobalTaskModal
  isOpen={isModalOpen}
  onClose={closeModal}
  onCreate={async (title, description, due_date, estimated_time, assigned_to, projectId) => {
    // Your API call or logic

  }}
/>
)}
  </div>
);


};

export default TimeSheetList;
