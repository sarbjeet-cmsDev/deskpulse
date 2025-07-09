"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { debounce } from "lodash";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MultiValue, ActionMeta, Props as SelectProps } from "react-select";
import { useRouter } from "next/navigation";
import { z } from "zod";

import AdminUserService, { IUser } from "@/service/adminUser.service";
import AdminProjectService from "@/service/adminProject.service";
import { Input } from "@/components/Form/Input";
import { Button } from "@/components/Form/Button";
import { H1 } from "@/components/Heading/H1";
import { projectCreateSchema } from "@/components/validation/projectValidation";

type CreateProjectInput = z.infer<typeof projectCreateSchema>;
type UserOption = { label: string; value: string };

const ReactSelect = dynamic(() => import("react-select") as any, {
  ssr: false,
}) as React.ComponentType<SelectProps<UserOption, true>>;

const CreateProjectPage = () => {
  const router = useRouter();
  const [userOptions, setUserOptions] = useState<UserOption[]>([]);
  const [inputValue, setInputValue] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(projectCreateSchema),
    defaultValues: {
      code: "",
      users: [],
      is_active: true,
      sort_order: 0,
      project_coordinator: "",
      team_leader: "",
      project_manager: "",
      avatar: "",
      notes: "",
      creds: "",
      additional_information: "",
      url_dev: "",
      url_live: "",
      url_staging: "",
      url_uat: "",
    },
  });

  const fetchUsers = useCallback(
    debounce(async (input: string) => {
      try {
        const users = await AdminUserService.searchUsers(input || "");

        const newOptions = users.map((user: IUser) => ({
          label: `${user.firstName || ""} ${user.lastName || ""} (${user.email})`,
          value: user._id,
        }));

        setUserOptions((prevOptions) => {
          const existingMap = new Map(
            prevOptions.map((opt) => [opt.value, opt])
          );
          newOptions.forEach((opt) => existingMap.set(opt.value, opt)); // overwrite/add
          return Array.from(existingMap.values());
        });
      } catch (err) {
        console.error("❌ Error fetching users:", err);
        setUserOptions([]);
      }
    }, 300),
    []
  );

  const onSubmit = async (data: CreateProjectInput) => {
    try {
      await AdminProjectService.createProject(data);
      router.push("/admin/project");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center pt-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl bg-white p-6 rounded shadow space-y-4"
      >
        <H1 className="text-2xl font-semibold text-gray-900 mb-4">
          Create Project
        </H1>

        <Input placeholder="Project Code" {...register("code")} />
        {errors.code && (
          <p className="text-sm text-red-500">{errors.code.message}</p>
        )}

        <Controller
          name="users"
          control={control}
          render={({ field }) => {
            const selectedOptions = userOptions.filter((option) =>
              field.value?.includes(option.value)
            );

            return (
              <ReactSelect
                isMulti
                options={userOptions}
                placeholder="Assign Users"
                value={selectedOptions}
                inputValue={inputValue}
                blurInputOnSelect={false}
                onInputChange={(value) => {
                  setInputValue(value);
                  if (value.length >= 1) {
                    fetchUsers(value);
                  }
                }}
                onChange={(selected: MultiValue<UserOption>) => {
                  const ids = selected.map((opt) => opt.value);
                  field.onChange(ids);
                }}
                classNamePrefix="react-select"
                styles={{
                  option: (provided) => ({
                    ...provided,
                    color: "black",
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    color: "black",
                  }),
                  multiValueLabel: (provided) => ({
                    ...provided,
                    color: "black",
                  }),
                }}
              />
            );
          }}
        />

        <Input placeholder="Dev URL" {...register("url_dev")} />
        <Input placeholder="Live URL" {...register("url_live")} />
        <Input placeholder="Staging URL" {...register("url_staging")} />
        <Input placeholder="UAT URL" {...register("url_uat")} />

        <Input placeholder="Notes" {...register("notes")} />
        <Input placeholder="Creds" {...register("creds")} />
        <Input
          placeholder="Additional Information"
          {...register("additional_information")}
        />

        <Input
          type="text"
          placeholder="Project Coordinator ID"
          {...register("project_coordinator")}
        />
        <Input
          type="text"
          placeholder="Team Leader ID"
          {...register("team_leader")}
        />
        <Input
          type="text"
          placeholder="Project Manager ID"
          {...register("project_manager")}
        />

        <Input placeholder="Avatar URL" {...register("avatar")} />

        <Input
          type="number"
          placeholder="Sort Order"
          {...register("sort_order")}
        />
        {errors.sort_order && (
          <p className="text-sm text-red-500">{errors.sort_order.message}</p>
        )}

        <div>
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register("is_active")} />
            <span>Is Active</span>
          </label>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          {isSubmitting ? "Creating..." : "Create Project"}
        </Button>
      </form>
    </div>
  );
};

export default CreateProjectPage;
