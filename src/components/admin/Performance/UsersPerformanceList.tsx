"use client";
import MyChart from "@/components/chart/LineChart";
import { H3 } from "@/components/Heading/H3";
import PerformanceService from "@/service/performanceService";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { RangeCalendar } from "@heroui/react";
import { today, getLocalTimeZone, CalendarDate } from "@internationalized/date";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import Link from "next/link";
import Image from "next/image";
import leftarrow from "@/assets/images/back.png";
import { Button } from "@heroui/button";
import ChevronUp from "@/assets/images/chevronup.svg";
import ChevronDown from "@/assets/images/chevrondown.svg";
import AvatarList from "@/components/IndexPage/avatarlist";
import AdminUserService from "@/service/adminUser.service";
import AdminPerformanceService from "@/service/adminPerformance.service";
dayjs.extend(isSameOrBefore);

export default function PerformancePreview() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [data, setData] = useState<{ labels: string[]; datasets: any[] }>({
    labels: [],
    datasets: [],
  });
  const [userColors, setUserColors] = useState<Record<string, string>>({});
  const calendarRef = useRef<HTMLDivElement | null>(null);

  // Today
  const jsToday = new Date();
  jsToday.setHours(0, 0, 0, 0);

  // CalendarDate objects for min and max
  const startDate = new CalendarDate(
    jsToday.getFullYear(),
    jsToday.getMonth() + 1,
    jsToday.getDate() - 10
  ); // 10 days ago
  const tomorrow = new CalendarDate(
    jsToday.getFullYear(),
    jsToday.getMonth() + 1,
    jsToday.getDate() + 1
  ); // +1 day from today

  const [selectedRange, setSelectedRange] = useState<{
    start: CalendarDate;
    end: CalendarDate;
  }>({
    start: startDate,
    end: tomorrow,
  });

  const [showCalendar, setShowCalendar] = useState(false);

  // Generate a distinct color for a new user
  const generateColorForUser = (userId: string, index: number) => {
    const hue = (index * 137.508) % 360; // spread colors using golden angle
    return `hsl(${hue}, 70%, 50%)`;
  };

  useEffect(() => {
    async function fetchUsers() {
      const res = await AdminUserService.getOnlyUsers();
      setUsers(res);
      if (res.length > 0) {
        const firstUserId = res[0]._id;
        setSelectedUserIds([firstUserId]);
        setUserColors((prev) => ({
          ...prev,
          [firstUserId]: generateColorForUser(firstUserId, 0),
        }));
        fetchPerformance([firstUserId]);
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUserIds.length > 0) {
      fetchPerformance(selectedUserIds);
    }
  }, [selectedRange, selectedUserIds]);

  async function fetchPerformance(userIds: string[]) {
    if (!selectedRange.start || !selectedRange.end || userIds.length === 0) {
      setData({ labels: [], datasets: [] });
      return;
    }

    const start = dayjs(selectedRange.start.toDate(getLocalTimeZone()));
    const end = dayjs(selectedRange.end.toDate(getLocalTimeZone()));

    try {
      const results = await AdminPerformanceService.getMultipleUsersPerformance(
        {
          userIds,
          start: start.format("YYYY-MM-DD"),
          end: end.format("YYYY-MM-DD"),
        }
      );

      const daysInRange: string[] = [];
      let current = start;
      while (current.isSameOrBefore(end)) {
        daysInRange.push(current.format("YYYY-MM-DD"));
        current = current.add(1, "day");
      }

      const updatedColors = { ...userColors };
      results.forEach((userResult: any, idx: number) => {
        if (!updatedColors[userResult.userId]) {
          updatedColors[userResult.userId] = generateColorForUser(
            userResult.userId,
            idx
          );
        }
      });
      setUserColors(updatedColors);

      const datasets = results.map((userResult: any) => {
        const performanceMap: Record<string, number> = {};
        userResult.performance.forEach((item: any) => {
          const dateKey = dayjs(item.date).format("YYYY-MM-DD");
          performanceMap[dateKey] = item.performance;
        });

        // 👇 Replace 0 with null (skip point instead of hitting zero)
        const userData = daysInRange.map((day) =>
          performanceMap[day] !== undefined ? performanceMap[day] : null
        );

        const color = updatedColors[userResult.userId];

        return {
          label: userResult.name,
          data: userData,
          fill: false,
          borderColor: color,
          backgroundColor: color,
          tension: 0.1,
        };
      });

      const formattedLabels = daysInRange.map((day) =>
        dayjs(day).format("DD MMM")
      );
      setData({
        labels: formattedLabels,
        datasets,
      });
    } catch (error) {
      console.error("Error fetching performance:", error);
    }
  }

  const formattedRange = `${dayjs(
    selectedRange.start.toDate(getLocalTimeZone())
  ).format(
    "DD MMM YY"
  )} - ${dayjs(selectedRange.end.toDate(getLocalTimeZone())).format("DD MMM YY")}`;

  // Disable dates outside the 10 days ago → tomorrow range
  const isDateUnavailable = (date: CalendarDate) => {
    return date.compare(tomorrow) > 0; // disable only after tomorrow
  };

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
    <div className="px-4 sm:px-6 lg:px-8">
      <div>
        <H3 className=" text-center flex-1 text-base sm:text-lg md:text-xl md:text-center text-end">
          Performance
        </H3>
      </div>
      <div className="flex md:justify-end mt-6 gap-3">
        <div ref={calendarRef}>
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
          {showCalendar && (
            <div
              className={`transition-all absolute duration-300 ease-in-out overflow-hidden bg-white border shadow rounded mt-2 ${showCalendar
                  ? "max-h-[500px] opacity-100 scale-100"
                  : "max-h-0 opacity-0 scale-95"
                }`}
            >
              <div className="flex justify-end p-2">
                <Button
                  onPress={() => setShowCalendar(false)}
                  className="text-sm text-gray-500 hover:text-gray-800 h-auto flex justify-end bg-white w-full"
                >
                  ✕
                </Button>
              </div>
              <div className="p-2">
                <RangeCalendar
                  aria-label="Select Range"
                  value={selectedRange as any}
                  onChange={(range) => {
                    setSelectedRange(range as any);
                    setShowCalendar(false);
                  }}
                  isDateUnavailable={isDateUnavailable as any}
                />
              </div>
            </div>
          )}
        </div>

        <AvatarList
          users={users}
          selectedUserIds={selectedUserIds}
          setSelectedUserIds={(ids: string[]) => {
            setUserColors((prev) => {
              const updated = { ...prev };
              ids.forEach((id, idx) => {
                if (!updated[id])
                  updated[id] = generateColorForUser(
                    id,
                    Object.keys(updated).length + idx
                  );
              });
              return updated;
            });
            setSelectedUserIds(ids);
          }}
          fetchKanbonList={fetchPerformance}
        />
      </div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mt-6">
        <div className="w-full md:w-2/3 lg:w-full md:h-[600px] h-[400px]">
          <MyChart
            data={data}

          />
        </div>
      </div>
    </div>
  );
}
