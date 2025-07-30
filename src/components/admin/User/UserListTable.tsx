"use client";

import { useEffect, useState } from "react";
import Datagrid from "@/components/Datagrid/Datagrid";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AdminUserService, { IUser } from "@/service/adminUser.service";
import { H3 } from "@/components/Heading/H3";
import { Button } from "@heroui/button";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

type SortField = "firstName" | "lastName" | "email";

const Users = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [users, setUsers] = useState<IUser[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortField, setSortField] = useState<SortField>("firstName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const debouncedSearch = useDebounce(search, 300);

  const fetchUsers = async () => {
    try {
      const data = await AdminUserService.getAllUsers({
        page,
        limit,
        keyword: debouncedSearch,
        sortField,
        sortOrder,
      });

      setUsers(data?.data ?? []);
      setTotalRecords(data?.total ?? 0);
      setTotalPages(Math.ceil((data?.total ?? 0) / limit));
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [debouncedSearch, page, sortField, sortOrder]);

  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
    if (pageFromUrl !== page) setPage(pageFromUrl);
  }, [searchParams]);

  const headers = [
    { id: "firstName", title: "First Name", is_sortable: true },
    { id: "lastName", title: "Last Name" },
    { id: "email", title: "Email" },
  ];

  const rows = users.map((user) => ({
    ...user,
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    actions: [
      { title: "Edit" },
      { title: "Reset Password" },
      { title: "Delete" },
    ],
  }));

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-4 sm:p-6 md:p-8 w-[100%]">
        <div className="flex justify-between items-center mb-4">
          <H3 className="text-2xl sm:text-2xl font-semibold">Users List</H3>
          <Button
            onPress={() => router.push("/admin/user/create")}
            className="btn-primary text-white font-semibold py-2 px-4 rounded"
          >
            + Create User
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
              limit,
            }}
            onSearch={(query) => {
              setSearch(query);
              setPage(1);
            }}
            onAction={async (action, row) => {
              if (action === "Edit") {
                router.push(`/admin/user/update/${row._id}`);
              } else if (action === "Delete") {
                const result = await Swal.fire({
                  title: "Are you sure?",
                  text: `You are about to delete ${row.firstName} ${row.lastName}.`,
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
                    await AdminUserService.deleteUser(row._id);
                    setUsers((prev) => prev.filter((u) => u._id !== row._id));
                    setTotalRecords((prev) => prev - 1);
                    await fetchUsers();
                  } catch (err) {
                    console.error("Delete failed", err);
                    Swal.fire("Error", "Failed to delete user.", "error");
                  }
                }
              } else if (action === "Reset Password") {
                router.push(`/admin/user/resetPassword/${row._id}`);
              }
            }}
            sort={{ field: sortField, order: sortOrder }}
            onSort={(field) => {
              if (field === sortField) {
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
              } else {
                setSortField(field as SortField);
                setSortOrder("asc");
              }
              setPage(1);
            }}
            router={router}
            pathname={pathname}
            searchParams={searchParams}
          />
        </div>
      </main>
    </div>
  );
};

export default Users;
