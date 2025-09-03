"use client"

import formatMinutes from "@/utils/formatMinutes"
import { useForm } from "react-hook-form";
import { CiEdit } from "react-icons/ci"
import { z } from "zod";
import { updateEstimateSchema } from "../validation/userValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import TaskService from "@/service/task.service";
import { useOutsideClick } from "@/utils/useOutsideClickHandler";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Input } from "../Form/Input";
import { Button } from "../Form/Button";
type EstimateInput = z.infer<typeof updateEstimateSchema>;


interface EstimateProps {
  task?: any;
  taskId?: any;
  fetchTask?: any
}


export const EstimateTime = ({ task, taskId, fetchTask }: EstimateProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [editEstimate, setEditEstimate] = useState(false);
  const user: any = useSelector((state: RootState) => state.auth.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EstimateInput>({
    resolver: zodResolver(updateEstimateSchema),
    defaultValues: {
      estimated_time: task?.estimated_time,
    },
  });


  const onSubmit = async (data: any) => {
    await TaskService.updateTask(taskId, data);
    setEditEstimate(false);
    fetchTask(taskId);
  };


  useOutsideClick(dropdownRef, editEstimate, () => setEditEstimate(false));
  return (
    <>
      <li className="mt-[13px]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-4 w-[35%]">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.9">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.257 1.66675C15.877 1.66675 17.637 3.46091 17.637 6.13091V13.7942C17.637 16.4876 15.9312 18.2392 13.2912 18.2559L6.88034 18.2584C4.26034 18.2584 2.49951 16.4642 2.49951 13.7942V6.13091C2.49951 3.43675 4.20535 1.68591 6.84535 1.67008L13.2562 1.66675H13.257ZM13.257 2.91675L6.84951 2.92008C4.90951 2.93175 3.74951 4.13175 3.74951 6.13091V13.7942C3.74951 15.8067 4.92035 17.0084 6.87951 17.0084L13.287 17.0059C15.227 16.9942 16.387 15.7926 16.387 13.7942V6.13091C16.387 4.11841 15.217 2.91675 13.257 2.91675ZM13.0963 12.8948C13.4413 12.8948 13.7213 13.1748 13.7213 13.5198C13.7213 13.8648 13.4413 14.1448 13.0963 14.1448H7.0796C6.73459 14.1448 6.45459 13.8648 6.45459 13.5198C6.45459 13.1748 6.73459 12.8948 7.0796 12.8948H13.0963ZM13.0963 9.40608C13.4413 9.40608 13.7213 9.68608 13.7213 10.0311C13.7213 10.3761 13.4413 10.6561 13.0963 10.6561H7.0796C6.73459 10.6561 6.45459 10.3761 6.45459 10.0311C6.45459 9.68608 6.73459 9.40608 7.0796 9.40608H13.0963ZM9.37518 5.92542C9.72018 5.92542 10.0002 6.20542 10.0002 6.55042C10.0002 6.89542 9.72018 7.17542 9.37518 7.17542H7.07934C6.73434 7.17542 6.45434 6.89542 6.45434 6.55042C6.45434 6.20542 6.73434 5.92542 7.07934 5.92542H9.37518Z"
                  fill="#31394F"
                />
              </g>
            </svg>
            <span className="text-[#31394f] text-[14px] leading-[16px]">
              Estimated Time
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="py-[2px] px-[8px]  rounded-[8px] text-[15px] leading-[16px] flex gap-4"
              ref={dropdownRef}
            >
              {editEstimate ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex gap-2">
                    <Input
                      {...register("estimated_time")}
                      type="text"
                      className="w-[100px] cursor-pointer"
                      defaultValue={task?.estimated_time}
                    />
                    <Button
                      type="submit"
                      className="bg-theme-primary text-white"
                    >
                      Update
                    </Button>
                  </div>

                  {errors.estimated_time && (
                    <p className="text-xs text-red-500 mt-2 ml-1">
                      {errors.estimated_time.message}
                    </p>
                  )}
                </form>
              ) : (
                <div>{formatMinutes(Number(task?.estimated_time) * 60)}</div>
              )}
              {!editEstimate && user?.role === "admin" && (
                <CiEdit
                  size={20}
                  className="cursor-pointer"
                  onClick={() => setEditEstimate(true)}
                />
              )}
            </div>
          </div>
        </div>
      </li>
    </>
  )
}