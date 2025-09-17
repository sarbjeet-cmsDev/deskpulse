"use client";

import { Controller, Control, FieldValues } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Input } from '@/components/Form/Input';

interface PhoneInputFieldProps<T extends FieldValues> {
  name: any;
  control: Control<T>;
  label?: string;
  required?: boolean;
}

export function PhoneInputField<T extends FieldValues>({
  name,
  control,
  label,
  required,
}: PhoneInputFieldProps<T>) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium">{label}</label>}

      <Controller
        name={name}
        control={control}
        rules={{ required: required ? `${label || "Phone"} is required` : false }}
        render={({ field, fieldState }) => (
          <div>
            <PhoneInput
              country="in"
              value={field.value}
              countryCodeEditable={false}
              enableSearch={true}
              searchPlaceholder="search"
              autocompleteSearch={true}
              copyNumbersOnly={true}
              onChange={field.onChange}
              inputProps={{
                name,
                required,
              }}
              inputStyle={{
                width: "100%",
                backgroundColor: "#f7f7f7",
              }}
            />
            <Input type="text" className="hidden"/>
            {fieldState.error && (
              <p className="text-sm text-red-500">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />
    </div>
  );
}
