"use client";
import  { ITask } from "@/service/task.service";
import Link from "next/link";
import Image from "next/image";
import info from "@/assets/images/info.png"

interface SubTasksProps {
  tasks: ITask[];
}

export default function SubTasks({ tasks }: SubTasksProps) {

   if (!tasks.length) return <div>No tasks available.</div>;

  return (
    <div>
    <ul className="mt-[24px]">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="inactive bg-[#f8fafc] w-full py-[15px] px-[20px] rounded-[8px] border-l-[8px] border-l-[#5fd788] mt-[16px]"
          >

            <Link href={`/task/${task._id}`} className="flex justify-between items-center">
             <span className="text-[#333] font-medium">{task.title}</span>
            <Image
              src={info}
              alt="Details"
              width={20}
              height={20}
              className="cursor-pointer opacity-70 hover:opacity-100"
              />
          </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
