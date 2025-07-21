
"use client";

import { DatePicker } from "@heroui/react";
import type { DateValue } from "@heroui/react";
import {getLocalTimeZone, today, parseAbsolute} from "@internationalized/date";

interface DatePickerInputProps {
  task: { due_date?: string };
  onChange?: (date: Date | null) => void;
}

export default function DatePickerInput({ task, onChange }: DatePickerInputProps) {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  const handleChange = (value: DateValue | null) => {
    const jsDate = value ? value.toDate(timeZone) : null;
    onChange?.(jsDate);
  };

  let parsedDueDate: DateValue | null = null;
  
  try {
    parsedDueDate = task?.due_date
    ? (parseAbsolute(task.due_date, timeZone) as unknown as DateValue)
    : null;
  } catch (e) {
    console.error(" Invalid due date format:", task?.due_date);
  }
  
  return (
    <DatePicker
    className="max-w-[284px]"
      value={parsedDueDate}
      onChange={handleChange}
       granularity="day"
      //  minValue={today(getLocalTimeZone())}
      classNames={{
        inputWrapper: "bg-transparent hover:!bg-transparent p-0 shadow-none",
      }}
    />
  );
}
