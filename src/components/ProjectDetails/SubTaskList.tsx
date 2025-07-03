"use client";
import { Checkbox } from "@heroui/react";
import  { ITask } from "@/service/task.service";
import Link from "next/link";
import Image from "next/image";
import leftarrow from "@/assets/images/back.png";

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
            {task.title}

            <Link href={`/task/${task._id}`} className="ml-4">
            <Image
              src={leftarrow}
              alt="Details"
              width={20}
              height={20}
              className="cursor-pointer opacity-70 hover:opacity-100"
            />
          </Link>
            <Checkbox
            //   defaultSelected={task}
              color="success"
              className="flex flex-row-reverse justify-between items-center min-w-full"
            >
            </Checkbox>
          </li>
        ))}
      </ul>
    </div>
  );
}
