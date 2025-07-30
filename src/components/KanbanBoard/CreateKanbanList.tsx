"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../Form/Button";
import { Input } from "../Form/Input";
import {
  CreateKanbanFormData,
  createKanbanSchema,
} from "../validation/kanban.schema";
import { useForm } from "react-hook-form";
import AdminProjectService from "@/service/adminProject.service";
import { useEffect, useState } from "react";
import { ProjectKanbon } from "@/service/projectKanbon.service";
import Link from "next/link";
import Image from "next/image";
import leftarrow from "@/assets/images/back.png";
import { H3 } from "@/components/Heading/H3";

type Project = {
  _id: string;
  code: string;
  notes?: string;
  avatar?: string;
};
export const CreateKanbanList = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateKanbanFormData>({
    resolver: zodResolver(createKanbanSchema),
    defaultValues: {
      title: "",
      sort_order: 1,
      project: "",
    },
  });

  const handlefetchProject = async () => {
    try {
      const res = await AdminProjectService.getAllProjects();
      setProjects(res.data as Project[]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handlefetchProject();
  }, []);
  const onSubmit = async (data: any) => {
    try {
      await ProjectKanbon.createKanbanList(data);
      reset();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container mx-auto max-w-3xl">
      <div className="flex justify-center items-center p-[24px] border-b border-[#31394f14]">
        <div className="w-[2%]">
          <Link href={`/admin/project`}>
            <Image src={leftarrow} alt="Back" width={16} height={16} />
          </Link>
        </div>
        <H3 className="w-[98%] text-center">Create Kanban</H3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="py-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
          Kanban Title
        </label>
          <Input
            type="text"
            placeholder="Kanban Title"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

         <label className="block text-sm font-medium text-gray-700 mb-1 mt-1">
          Sort Order
        </label>
        <Input
          type="number"
          placeholder="Sort Order"
          min={1}
          {...register("sort_order", {
            valueAsNumber: true,
            min: {
              value: 1,
              message: "Sort order must be at least 1",
            },
          })}
        />
        {errors.sort_order && (
          <p className="text-red-500 text-sm">{errors.sort_order.message}</p>
        )}

         <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">
          Select project
        </label>
        <select
          {...register("project")}
          className="w-full border border-gray-300 rounded px-3 py-2 "
        >
          <option value="">Select project</option>
          {projects?.map((item: any) => (
            <option key={item._id} value={item._id}>
              {item.title}
            </option>
          ))}
        </select>
        {errors.project && (
          <p className="text-red-500 text-sm">{errors.project.message}</p>
        )}
        <div className="flex justify-center">
          <Button
            type="submit"
            className="w-full btn-primary text-white font-semibold py-2 px-4 my-4 rounded"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};
