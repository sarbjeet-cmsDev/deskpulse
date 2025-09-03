"use client";
import { useEffect, useState } from "react";
import Datagrid from "@/components/Datagrid/Datagrid";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AdminNotificationService from "@/service/adminNotification.service";
import { SweetAlert } from "@/components/common/SweetAlert/SweetAlert";

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
  is_read: boolean;
};

function highlightMentions(content: string): string {
  return content.replace(/@([A-Za-z0-9_ ]+)/g, (match) => {
    return `<span class="bg-blue-100 text-gray-700 px-1 py-1 rounded">${match}</span>`;
  });
}

const NotificationListTable = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState("code");
  const debouncedSearch = useDebounce(search, 300);
  const currentPageFromRoute = parseInt(searchParams.get("page") || "1", 10);

  const fetchNotifictions = async () => {
    try {
      const res = await AdminNotificationService.getAllNotification({
        page: currentPageFromRoute,
        limit,
        keyword: debouncedSearch,
        sortOrder,
      });
      setNotifications(res.data as unknown as Notification[]);
      setTotalRecords(res.total);
      setTotalPages(res.totalPages);
      setLimit(res.limit);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  };

  useEffect(() => {
    fetchNotifictions();
  }, [debouncedSearch, page, sortOrder, sortField]);

  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
    if (pageFromUrl !== page) setPage(pageFromUrl);
  }, [searchParams]);

  const headers = [{ id: "content", title: "content", is_sortable: true }];

  const rows = (notifications ?? []).map((notification) => ({
    ...notification,
    content: (
      <div className="flex items-center gap-2">
        <span
          dangerouslySetInnerHTML={{
            __html: highlightMentions(notification.content),
          }}
        />
      </div>
    ),
    actions: [{ title: "Delete" }],
  }));
  return (
    <div className="flex">
      <main className="flex-1 p-6 sm:p-6 md:p-8 w-[100%]">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Notification List</h1>
        </div>

        <Datagrid
          headers={headers}
          rows={rows}
          pagination={{
            total_records: totalRecords,
            total_page: totalPages,
            current_page: currentPageFromRoute,
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

              const result = await SweetAlert({
                title: "Are you sure?",
                text: `You are about to delete this notification`,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
              })
              if (result) {
                try {
                  await AdminNotificationService.deleteNotification(row._id);
                  setNotifications((prev) =>
                    prev.filter((p) => p._id !== row._id)
                  );
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
          router={router}
          pathname={pathname}
          searchParams={searchParams}
        />
      </main>
    </div>
  );
};

export default NotificationListTable;
