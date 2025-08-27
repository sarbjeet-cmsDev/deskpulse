"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import TimelineService from "@/service/timeline.service";

import Datagrid from "@/components/Datagrid/Datagrid";
import AvatarList from "@/components/IndexPage/avatarlist";
import { Button } from "@heroui/button";
import { RangeCalendar } from "@heroui/react";

import { today, getLocalTimeZone } from "@internationalized/date";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrBefore);

import Image from "next/image";
import ChevronUp from "@/assets/images/chevronup.svg";
import ChevronDown from "@/assets/images/chevrondown.svg";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

type Task = {
  task_title: string;
  comment: string;
  time_spent: number;
};

const TimeSheetList = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const user: any = useSelector((state: RootState) => state.auth.user);
  const calendarRef = useRef<HTMLDivElement | null>(null);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState("task_title");

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [users, setUsers] = useState([]);

  const [selectedRange, setSelectedRange] = useState<{
    start: any;
    end: any;
  }>({
    start: today(getLocalTimeZone()).add({ weeks: -1 }),
    end: today(getLocalTimeZone()).add({ weeks: 1 }),
  });

  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
    if (pageFromUrl !== page) setPage(pageFromUrl);
  }, [searchParams]);

  useEffect(() => {
    if (user?.id) {
      fetchTasks();
    }
  }, [user?.id, debouncedSearch, page, sortOrder, sortField, selectedRange]);

  const fetchTasks = async () => {
    try {
      const startDate = selectedRange.start.toDate(getLocalTimeZone()).toISOString();
      const endDate = selectedRange.end.toDate(getLocalTimeZone()).toISOString();

      const res = await TimelineService.getTimeLineList(user?.id, page, limit, startDate, endDate);

      const timelineData = res?.data || [];

      const cleanedTasks: Task[] = timelineData.map((item: any) => ({
        task_title: item.task_title,
        comment: item.comment,
        time_spent: item.time_spent,
      }));

      setTasks(cleanedTasks);
      setTotalRecords(res.total || 0);
      setTotalPages(Math.ceil((res.total || 0) / limit));
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  const headers = [
    { id: "taskNumber", title: "TimeSheet", is_sortable: false },
    { id: "task_title", title: "Task Title" },
    { id: "comment", title: "Log" },
    { id: "time_spent", title: "Spent Time" },
  ];

  const rows = tasks.map((task, index) => {
    const totalMinutes = task.time_spent || 0;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const formattedTime =
      hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;

    const globalIndex = (page - 1) * limit + index + 1;

    return {
      ...task,
      taskNumber: globalIndex,
      time_spent: formattedTime,
      task_title: task.task_title || "—",
      comment: task.comment,
    };
  });

  const formattedRange = `${dayjs(
    selectedRange.start.toDate(getLocalTimeZone())
  ).format("DD MMM YY")} - ${dayjs(
    selectedRange.end.toDate(getLocalTimeZone())
  ).format("DD MMM YY")}`;
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
  return (
    <div className="flex flex-col min-h-screen ">
      <main className="flex-1 p-4 sm:p-6 md:p-8 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
            Time Sheet
          </h1>

          <div className="md:w-[250px] w-full" ref={calendarRef}>
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
              className={`transition-all absolute duration-300 ease-in-out overflow-hidden border bg-white shadow rounded mt-2 ${showCalendar
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
                  // onChange={setSelectedRange}

                  onChange={(range) => {
                    setSelectedRange(range as any);
                    setShowCalendar(false);
                  }}
                />
              </div>
            </div>
          </div>



        </div>

        <div className="flex flex-col md:flex-row gap-4">


          <div className=" w-full">
            <Datagrid
              headers={headers}
              rows={rows}
              pagination={{
                total_records: totalRecords,
                total_page: totalPages,
                current_page: page,
                limit: limit,
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
