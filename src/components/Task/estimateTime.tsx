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
import { CopyIcon } from "../icons";
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
            <CopyIcon />
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