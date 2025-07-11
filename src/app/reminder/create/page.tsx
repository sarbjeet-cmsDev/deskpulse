"use client";

import Image from "next/image";
import leftarrow from "@/assets/images/back.png";
import { H3 } from "@/components/Heading/H3";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createReminderSchema, CreateReminderFormData } from "@/components/validation/reminder.schema";
import ReminderService from "@/service/reminder.service";
import { useState } from "react";
import Link from "next/link";

export default function CreateReminder() {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateReminderFormData>({
    resolver: zodResolver(createReminderSchema),
    defaultValues: {
      status: 'pending',
      alert: true,
      alert_before: 30,
      sort_order: 0,
    },
  });

  const onSubmit = async (data: CreateReminderFormData) => {
    try {
      setLoading(true);
      const response = await ReminderService.createReminder(data);
      console.log(response.message, response.reminder);
      reset()
    } catch (error) {
      console.error("Failed to create reminder:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-center items-center p-[24px] border-b border-[#31394f14]">
        <div className="w-[2%]">
          <Link href="/">
            <Image src={leftarrow} alt="Back" width={16} height={16} />
          </Link>
        </div>
        <H3 className="w-[98%] text-center">Create Reminder</H3>
      </div>

      {/* Form Section */}
      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto space-y-4">
          <div>
            <label className="block mb-1">Title</label>
            <input {...register("title")} className="border p-2 w-full rounded" placeholder="Enter title" />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block mb-1">Start Date & Time</label>
            <input type="datetime-local" {...register("start")} className="border p-2 w-full rounded" />
            {errors.start && <p className="text-red-500 text-sm">{errors.start.message}</p>}
          </div>

          <div>
            <label className="block mb-1">End Date & Time</label>
            <input type="datetime-local" {...register("end")} className="border p-2 w-full rounded" />
          </div>

          <div>
            <label className="block mb-1">Status</label>
            <select {...register("status")} className="border p-2 w-full rounded">
              <option value="pending">Pending</option>
              <option value="complete">Complete</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("alert")} id="alert" />
            <label htmlFor="alert">Enable Alert</label>
          </div>

          <div>
            <label className="block mb-1">Alert Before (minutes)</label>
            <input type="number" {...register("alert_before", { valueAsNumber: true })} className="border p-2 w-full rounded" />
            {errors.alert_before && <p className="text-red-500 text-sm">{errors.alert_before.message}</p>}
          </div>

          {/* <div>
            <label className="block mb-1">Sort Order</label>
            <input type="number" {...register("sort_order", { valueAsNumber: true })} className="border p-2 w-full rounded" />
          </div> */}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Create Reminder"}
          </button>
        </form>
      </div>
    </div>
  );
}
