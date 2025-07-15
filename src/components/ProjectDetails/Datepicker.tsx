"use client";

import {DatePicker} from "@heroui/react";
import type { DateValue } from "@heroui/react";

interface DatePickerInputProps {
  onChange?: (date: Date | null) => void;
}



export default function DatePickerInput({ onChange }: DatePickerInputProps) {
  const placements = ["outside-left"];

  const handleChange = (value: DateValue | null) => {
  if (onChange) {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const jsDate = value ? value.toDate(timeZone) : null;
    onChange(jsDate);
  }
};

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex w-full flex-wrap items-end md:flex-nowrap mb-6 md:mb-0 gap-4">
          {placements.map((placement) => (
            <DatePicker
              key={placement}
              className="max-w-[284px]"
              classNames={{
                inputWrapper:"bg-transparent hover:!bg-transparent p-0 shadow-none",
              }}
              onChange={handleChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
