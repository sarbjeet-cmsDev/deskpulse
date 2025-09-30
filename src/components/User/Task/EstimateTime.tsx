import { Button } from "@/components/Form/Button";
import { Input } from "@/components/Form/Input";
import { H5 } from "@/components/Heading/H5";
import { updateTaskTitleSchema } from "@/components/validation/userValidation";
import TaskService from "@/service/task.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CiEdit } from "react-icons/ci";
import { z } from "zod";

type TaskTitleInput = z.infer<typeof updateTaskTitleSchema>;

export const EstimateTime = ({ task, taskId, fetchTask, user }: any) => {
    const [editTaskTitle, setEditTaskTitle] = useState(false);
    const editTitleRef = useRef<HTMLDivElement>(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TaskTitleInput>({
        resolver: zodResolver(updateTaskTitleSchema),
        defaultValues: {
            title: task?.title,
        },
    });

    const onSubmit = async (data: any) => {
        await TaskService.updateTask(taskId, data);
        setEditTaskTitle(false);
        fetchTask(taskId);
    };
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                editTitleRef.current &&
                !editTitleRef.current.contains(e.target as Node)
            ) {
                setEditTaskTitle(false);
            }
        }
        if (editTaskTitle) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [editTaskTitle]);
    return (
        <div ref={editTitleRef} className="flex">
            {editTaskTitle ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex gap-2 my-7 md:w-[600px]">
                        <Input
                            {...register("title")}
                            className="w-full cursor-pointer"
                            defaultValue={task?.title}
                        />
                        <Button type="submit" className="bg-theme-primary text-white">
                            Update
                        </Button>
                    </div>

                    {errors.title && (
                        <p className="text-xs text-red-500 mt-2 ml-1">
                            {errors.title.message}
                        </p>
                    )}
                </form>
            ) : (
                <div className="flex items-center gap-2 break-all overflow-hidden">
                    <H5 className="text-left">{task?.title}</H5>

                    {!editTaskTitle && user?.role === "admin" && (
                        <CiEdit
                            size={20}
                            className="cursor-pointer"
                            onClick={() => setEditTaskTitle(true)}
                        />
                    )}
                </div>
            )}
        </div>
    );
};
