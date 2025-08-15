"use client";

import Image from "next/image";
import leftarrow from "@/assets/images/back.png";
import { H3 } from "@/components/Heading/H3";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createReminderSchema,
  CreateReminderFormData,
} from "@/components/validation/reminder.schema";
import ReminderService from "@/service/reminder.service";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";

export default function CreateReminder() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateReminderFormData>({
    resolver: zodResolver(createReminderSchema),
    defaultValues: {
      status: "pending",
      alert: true,
      alert_before: 30,
      sort_order: 0,
    },
  });

  const onSubmit = async (data: CreateReminderFormData) => {
    try {
      setLoading(true);
      const response = await ReminderService.createReminder(data);
      
      reset();
      router.push("/reminder");
    } catch (error) {
      console.error("Failed to create reminder:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-center items-center p-[24px] border-b border-[#31394f14]">
        <Link href="/">
          <Image src={leftarrow} alt="Back" width={16} height={16} />
        </Link>

        <H3 className="text-center flex-1 text-base sm:text-lg md:text-xl">
          Create Reminder
        </H3>
      </div>

      <div className="p-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-xl mx-auto bg-white p-6 rounded border border-gray-300 shadow space-y-4"
        >
          <div>
            <label className="block mb-1">Title</label>
            <input
              {...register("title")}
              className="border p-2 w-full rounded"
              placeholder="Enter title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Start Date & Time</label>
            <input
              type="datetime-local"
              {...register("start")}
              className="border p-2 w-full rounded"
              min={new Date().toISOString().slice(0, 16)}
            />
            {errors.start && (
              <p className="text-red-500 text-sm">{errors.start.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">End Date & Time</label>
            <input
              type="datetime-local"
              {...register("end")}
              className="border p-2 w-full rounded"
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("alert")} id="alert" />
            <label htmlFor="alert">Enable Alert</label>
          </div>

          <div>
            <label className="block mb-1">Alert Before (minutes)</label>
            <input
              type="number"
              {...register("alert_before", { valueAsNumber: true })}
              className="border p-2 w-full rounded"
            />
            {errors.alert_before && (
              <p className="text-red-500 text-sm">
                {errors.alert_before.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full btn-primary text-white px-4 py-2 rounded"
          >
            {loading ? "Saving..." : "Create Reminder"}
          </Button>
        </form>
      </div>
    </div>
  );
}
