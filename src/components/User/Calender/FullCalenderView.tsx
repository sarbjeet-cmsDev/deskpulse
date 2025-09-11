"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import TaskService, { ITask } from "@/service/task.service";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TimelineService from "@/service/timeline.service";

export default function FullCalendarView() {
  const router = useRouter();
  const [tasks, setTasks] = useState<ITask[]>([]);

  const fetchTasks = async () => {
    const res = await TaskService.getMyTasks();
    console.log("res", res);
    setTasks(res.data);
  };
  useEffect(() => {
    fetchTasks();
  }, []);

  const formatTime = (time: any) => {
    const totalTime = time || 0;
    const hours = Math.floor(totalTime / 60);
    const minutes = totalTime % 60;
    const totalUpdatedTime =
      hours > 0
        ? minutes > 0
          ? `${hours}h ${minutes}min`
          : `${hours}h`
        : `${minutes}min`;
    return totalUpdatedTime;
  };

  const colors = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

  function getColor(index: number) {
    return colors[index % colors.length];
  }

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={tasks
        .filter((t) => t.status === "done" || t.status === "progress")
        .map((item, index) => ({
          title: `${item?.code} (${formatTime(item?.totaltaskminutes)}) (${item?.status})`,
          date: `${item?.createdAt}`,
          id: item?.code,
          backgroundColor: getColor(index),
          textColor: "#fff",
          // duration: "02:00",
          start: item?.startDate,
          end: item.status === 'progress' ? new Date() : item?.endDate,
          // end: item?.endDate,
        }))}
      eventClick={(info) => {
        info.jsEvent.preventDefault();
        router.push(`/task/${info.event.id}`);
      }}
      eventClassNames={() => "cursor-pointer"}
      dayMaxEventRows={6}
      moreLinkClick="popover"
      fixedWeekCount={true}
      expandRows={false}
    />
  );
}
