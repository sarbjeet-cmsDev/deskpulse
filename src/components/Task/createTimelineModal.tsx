"use client";

import { Modal, ModalContent, ModalBody, useDisclosure } from "@heroui/react";
import { Button } from "@/components/Form/Button";
import { Input } from "@/components/Form/Input";
import { H5 } from "@/components/Heading/H5";
import { useEffect, useState } from "react";
import { z } from "zod";
import { createTimelineSchema } from "@/components/validation/timelineValidaion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface CreateTimelineModalProps {
  onCreate: (data: {
    date: string;
    time_spent: string;
    comment: string;
  }) => Promise<void>;
}

export default function CreateTimelineModal({
  onCreate,
}: CreateTimelineModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [weekStart, setWeekStart] = useState("");
  const [today, setToday] = useState("");

  useEffect(() => {
    const now = new Date();
    const pastWeek = new Date();
    pastWeek.setDate(now.getDate() - 6);

    setToday(now.toISOString().split("T")[0]);
    setWeekStart(pastWeek.toISOString().split("T")[0]);
  }, []);
  // const today = new Date().toISOString().split("T")[0];

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      createTimelineSchema.pick({ date: true, time_spent: true, comment: true })
    ),
    defaultValues: {
      date: "",
      time_spent: "",
      comment: "",
    },
  });

  const handleCreate = async (values: {
    date: string;
    time_spent: string;
    comment: string;
  }) => {
    setLoading(true);
    try {
      await onCreate(values);
      reset();
      onOpenChange();
    } catch (error) {
      console.error("Timeline creation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onPress={onOpen}
        className="btn-primary text-white px-4 py-2 text-sm font-semibold"
      >
        + Log Time
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="p-0">
                <H5 className="text-center p-4 border-b border-[#31394f1a]">
                  Log Time
                </H5>

                <form
                  onSubmit={handleSubmit(handleCreate)}
                  className="px-4 py-4 space-y-4"
                  noValidate
                >
                  <div>
                    <Input
                      type="date"
                      label="Date"
                      {...register("date")}
                      required={false}
                      onChange={handleDateChange}
                      min={weekStart}
                      max={today}
                      // className="w-64"
                    />
                    {errors.date && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.date.message as string}
                      </p>
                    )}
                  </div>

                  <div>
                    <Input
                      type="text"
                      label="Duration (in hour)"
                      {...register("time_spent")}
                    />
                    {errors.time_spent && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.time_spent.message as string}
                      </p>
                    )}
                  </div>

                  <div>
                    <textarea
                      {...register("comment")}
                      rows={3}
                      className="w-full rounded-lg border border-gray-100 bg-gray-100 p-3 focus:outline-none"
                      placeholder="Write your comment..."
                    />
                    {errors.comment && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.comment.message as string}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col divide-y border-t">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="p-4 bg-transparent text-theme-primary font-bold"
                    >
                      {loading ? "Logging..." : "Log Time"}
                    </Button>
                    <Button
                      type="button"
                      variant="light"
                      onPress={onClose}
                      className="p-4 bg-transparent text-[#31394f99] font-bold data-[hover=true]:bg-transparent"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
