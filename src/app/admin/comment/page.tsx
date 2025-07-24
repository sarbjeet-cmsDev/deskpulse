"use client";
import { useEffect, useState } from "react";
import Datagrid from "@/components/Datagrid/Datagrid";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useRouter } from "next/navigation";
import AdminTaskService from "@/service/adminTask.service";
import AdminCommentService from "@/service/adminComment.service";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

type Comment = {
  _id: string;
  content: string;

};

function highlightMentions(content: string): string {
  return content.replace(/@([A-Za-z0-9 ]+)/g, (match) => {
    return `<span class="bg-blue-100 text-gray-700 px-1 py-1 rounded">${match}</span>`;
  });
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

const CommentListPage = () => {
  const router = useRouter();

  const [comments, setComments] = useState<Comment[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState("code");
  const debouncedSearch = useDebounce(search, 300);

  const fetchComments = async () => {
    try {
      const res = await AdminCommentService.getAllComments({
        page,
        limit,
        keyword: debouncedSearch,
        sortOrder,
      });
        const commentsWithPlainText = (res.data as Comment[]).map((comment) => ({
      ...comment,
      content: highlightMentions(stripHtml(comment.content)),
    }));
     
      setComments(commentsWithPlainText);
      setTotalRecords(res.total);
      setTotalPages(res.totalPages);
      setLimit(res.limit)
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [debouncedSearch, page, sortOrder, sortField]);

  const headers = [
    { id: "content", title: "content", is_sortable: true },
  ];

  const rows = (comments ?? []).map((comment) => ({
    ...comment,
    content: <span dangerouslySetInnerHTML={{ __html: comment.content }} />,
    actions: [{ title: "Delete" }],
  }));

  return (
    <div className="flex">
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Comment List</h1>
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
                text: `You are about to delete comment`,
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
                  await AdminCommentService.deleteComment(row._id);
                  setComments((prev) => prev.filter((p) => p._id !== row._id));
                  setTotalRecords((prev) => prev - 1);
                  await fetchComments();
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
      </main>
    </div>
  );
};

export default CommentListPage;
