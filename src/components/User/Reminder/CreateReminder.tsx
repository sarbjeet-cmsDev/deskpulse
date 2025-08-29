"use client";

import Image from "next/image";
import leftarrow from "@/assets/images/back.png";
import { H3 } from "@/components/Heading/H3";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createReminderSchema,
  CreateReminderFormData,
} from "@/components/validation/reminder.schema";
import ReminderService from "@/service/reminder.service";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/Form/Input";
import { Button } from "@/components/Form/Button";
import ReactSelect from "react-select";

export default function CreateReminder() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm<CreateReminderFormData>({
    resolver: zodResolver(createReminderSchema),
    defaultValues: {
      status: "pending",
      alert: true,
      alert_before: 30,
      sort_order: 0,
      repeat: "none",
      days: [],
    },
  });

  const onSubmit = async (data: CreateReminderFormData) => {
    try {
      setLoading(true);
      await ReminderService.createReminder(data);
      reset();
      window.location.href = "/reminder";
    } catch (error) {
      console.error("Failed to create reminder:", error);
    } finally {
      setLoading(false);
    }
  };

  const days = [
    { label: "Monday", value: "monday" },
    { label: "Tuesday", value: "tuesday" },
    { label: "Wednesday", value: "wednesday" },
    { label: "Thursday", value: "thursday" },
    { label: "Friday", value: "friday" },
    { label: "Saturday", value: "saturday" },
    { label: "Sunday", value: "sunday" },
  ];

  const repeat = watch("repeat");

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-center items-center md:p-[24px] p-2 border-b border-[#31394f14]">
        <div>
          <span className="cursor-pointer" onClick={() => router.back()}>
            <Image src={leftarrow} alt="Back" width={16} height={16} />
          </span>
        </div>

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
            <Input
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
            <Input
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
            <Input
              type="datetime-local"
              {...register("end")}
              className="border p-2 w-full rounded"
              min={new Date().toISOString().slice(0, 16)}
            />
            {errors.end && (
              <p className="text-red-500 text-sm">{errors.end.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Repeat</label>
            <select
              {...register("repeat")}
              className="border p-2 w-full rounded"
            >
              <option value="none">Does not repeat</option>
              <option value="daily">Every day</option>
              <option value="weekly">Every week</option>
              <option value="monthly">Every month</option>
            </select>
            {errors.repeat && (
              <p className="text-red-500 text-sm">{errors.repeat.message}</p>
            )}
          </div>
          {repeat === "weekly" && (
            <div>
              <label className="block mb-1">Choose Days</label>
              <Controller
                name="days"
                control={control}
                render={({ field }) => (
                  <ReactSelect
                    {...field}
                    options={days}
                    isMulti
                    closeMenuOnSelect={false}
                    value={days.filter((d: any) => field.value?.includes(d.value))}
                    onChange={(selected) =>
                      field.onChange(selected.map((s) => s.value))
                    }
                  />
                )}
              />
              {errors.days && (
                <p className="text-red-500 text-sm">{errors.days.message}</p>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("alert")} id="alert" />
            <label htmlFor="alert">Enable Alert</label>
          </div>

          <div>
            <label className="block mb-1">Alert Before (minutes)</label>
            <Input
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
