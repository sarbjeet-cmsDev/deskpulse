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
import TaskButton from "@/components/taskButton";
import { useRouter } from "next/navigation";
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes

dayjs.extend(isSameOrBefore);

export default function PerformancePreview() {
<<<<<<< Updated upstream
  const calendarRef = useRef<HTMLDivElement | null>(null);

=======
>>>>>>> Stashed changes
const router = useRouter();
  const [data, setData] = useState<{ labels: string[]; datasets: any[] }>({
    labels: [],
    datasets: [],
  });
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

  useEffect(() => {
    async function fetchPerformance() {
      if (!selectedRange.start || !selectedRange.end) return;

      const startDate = dayjs(selectedRange.start.toDate(getLocalTimeZone()));
      const endDate = dayjs(selectedRange.end.toDate(getLocalTimeZone()));

      try {
        const result = await PerformanceService.getPerformanceByUser({
          start: startDate.format("YYYY-MM-DD"),
          end: endDate.format("YYYY-MM-DD"),
        });

        const daysInRange: string[] = [];
        let current = startDate;
        while (current.isSameOrBefore(endDate)) {
          daysInRange.push(current.format("YYYY-MM-DD"));
          current = current.add(1, "day");
        }

        const performanceMap: Record<string, number> = {};
        result.forEach((item: any) => {
          const dateKey = dayjs(item.date).format("YYYY-MM-DD");
          performanceMap[dateKey] = item.performance;
        });
        const datasetData = daysInRange.map((day) => {
          const value = performanceMap[day] ?? 0;
          return value === 0 ? null : value;
        });

        const formattedLabels = daysInRange.map((day) =>
          dayjs(day).format("DD MMM")
        );

        setData({
          labels: formattedLabels,
          datasets: [
            {
              label: "Performance Score",
              data: datasetData,
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
              spanGaps: true,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching performance:", error);
      }
    }

    fetchPerformance();
  }, [selectedRange]);

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
  const isDateUnavailable = (date: CalendarDate) => {
    return date.compare(tomorrow) > 0;
  };
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center items-center pb-6 border-b border-[#31394f14]">
         <div className="w-10 cursor-pointer">
                <span onClick={() => router.back()} >
                  <Image src={leftarrow} alt="Back" width={16} height={16} />
                </span>
              </div>

        <H3 className=" text-center flex-1 text-base sm:text-lg md:text-xl">
          My Performance
        </H3>
      </div>
      <div className="flex justify-end mt-5">
        <div className="md:w-[250px] w-full" ref={calendarRef}>
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

          <div
            className={`transition-all absolute duration-300 ease-in-out overflow-hidden bg-white border shadow rounded mt-2 ${showCalendar
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
                value={selectedRange as any}
                onChange={(range) => {
                  setSelectedRange(range as any);
                  setShowCalendar(false);
                }}
                isDateUnavailable={isDateUnavailable as any}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-start py-6 gap-6">
        <div className="w-full md:h-[600px] h-[400px]">
          <MyChart data={data} />
        </div>
      </div>
    </div>
  );
}
