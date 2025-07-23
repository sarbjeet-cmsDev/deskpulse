"use client";
import { useEffect, useState } from "react";
import Datagrid from "@/components/Datagrid/Datagrid";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useRouter } from "next/navigation";
import AdminNotificationService from "@/service/adminNotification.service";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

type Notification = {
  _id: string;
  content: string;
  is_read:boolean;

};

function highlightMentions(content: string): string {
  return content.replace(/@([A-Za-z0-9_ ]+)/g, (match) => {
    return `<span class="bg-blue-100 text-gray-700 px-1 py-1 rounded">${match}</span>`;
  });
}

const NotificationListPage = () => {
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState("code");
  const debouncedSearch = useDebounce(search, 300);

  const fetchNotifictions = async () => {
    try {
      const res = await AdminNotificationService.getAllNotification({
        page,
        limit,
        keyword: debouncedSearch,
        sortOrder,
      });
      setNotifications(res.data as unknown as Notification[]);
      setTotalRecords(res.total);
      setTotalPages(res.totalPages);
      setLimit(res.limit)
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  };

  useEffect(() => {
    fetchNotifictions();
  }, [debouncedSearch, page, sortOrder, sortField]);

  const headers = [
    { id: "content", title: "content", is_sortable: true },
  ];

  const rows = (notifications ?? []).map((notification) => ({
    ...notification,
    content: <div className="flex items-center gap-2">
      {/* {!notification.is_read && (
        <span className="w-2 h-2 bg-red-500 rounded-full inline-block"></span>
      )} */}
      <span
        dangerouslySetInnerHTML={{
          __html: highlightMentions(notification.content),
        }}
      />
    </div>,
    actions: [{ title: "Delete" }],
  }));

  return (
    <div className="flex">
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Notification List</h1>
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
                text: `You are about to delete notification: "${row.content}"`,
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
                  await AdminNotificationService.deleteNotification(row._id);
                  setNotifications((prev) => prev.filter((p) => p._id !== row._id));
                  setTotalRecords((prev) => prev - 1);
                  await fetchNotifictions();
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

export default NotificationListPage;
