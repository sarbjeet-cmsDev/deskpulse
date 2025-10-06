"use client";

import { Modal, ModalContent, ModalBody, useDisclosure } from "@heroui/react";
import { Button } from "@/components/Form/Button";
import { Input } from "@/components/Form/Input";
import { H5 } from "@/components/Heading/H5";
import { useEffect, useState } from "react";
import { createTimelineSchema } from "@/components/validation/timelineValidaion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TextArea } from "../Form/TextArea";

interface TimelineModalProps {
  mode: "create" | "update";
  onSubmit: (data: {
    date: string;
    time_spent: string;
    comment: string;
  }) => Promise<void>;
  initialData?: { date: string; time_spent: string; comment: string };
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function CreateTimelineModal({
  mode,
  onSubmit,
  initialData,
  isOpen: externalOpen,
  onOpenChange: externalOnOpenChange,
}: TimelineModalProps) {
  const {
    isOpen: internalOpen,
    onOpen,
    onOpenChange: internalOnOpenChange,
  } = useDisclosure();
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const onOpenChange = externalOnOpenChange || internalOnOpenChange;

  const [loading, setLoading] = useState(false);
  const [weekStart, setWeekStart] = useState("");
  const [today, setToday] = useState("");

  useEffect(() => {
    const now = new Date();
    const pastWeek = new Date();
    pastWeek.setDate(now.getDate() - 6);

    setToday(now.toISOString().split("T")[0]);
    setWeekStart(pastWeek.toISOString().split("T")[0]);
  }, []);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      createTimelineSchema.pick({ date: true, time_spent: true, comment: true })
    ),
    defaultValues: initialData || {
      date: "",
      time_spent: "",
      comment: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (values: {
    date: string;
    time_spent: string;
    comment: string;
  }) => {
    setLoading(true);
    try {
      await onSubmit(values);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error(`${mode} timeline failed:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <>
      {mode === "create" ? (
        <Button
          onPress={onOpen}
          className="btn-primary text-white px-4 py-2 text-sm font-semibold"
        >
          + Log Time
        </Button>
      ) : (
        ""
      )}

      <Modal
        shouldBlockScroll={false}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{ wrapper: "items-start h-auto", base: "my-auto" }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="p-0">
                <H5 className="text-center p-4 border-b border-[#31394f1a]">
                  {mode === "create" ? "Log Time" : "Update Log Time"}
                </H5>

                <form
                  onSubmit={handleSubmit(handleFormSubmit)}
                  className="px-4 py-4 space-y-4"
                  noValidate
                >
                  <div>
                    <Input
                      type="date"
                      label="Date"
                      {...register("date")}
                      required={false}
                      min={weekStart}
                      max={today}
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
                    <TextArea
                      className="w-full rounded-lg border border-gray-100 bg-gray-100 p-3 focus:outline-none"
                      placeholder="Write your comment..."
                      {...register("comment")}
                      rows={3}
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
                      {loading
                        ? mode === "create"
                          ? "Logging..."
                          : "Updating..."
                        : mode === "create"
                          ? "Log Time"
                          : "Update"}
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
