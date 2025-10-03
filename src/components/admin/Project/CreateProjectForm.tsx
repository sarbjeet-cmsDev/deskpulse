"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState, useRef } from "react";
import { debounce } from "lodash";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MultiValue, Props as SelectProps } from "react-select";
import { useRouter } from "next/navigation";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import leftarrow from "@/assets/images/back.png";
import { H3 } from "@/components/Heading/H3";
import AdminUserService, { IUser } from "@/service/adminUser.service";
import AdminProjectService from "@/service/adminProject.service";
import { Input } from "@/components/Form/Input";
import { Button } from "@/components/Form/Button";
import { projectCreateSchema } from "@/components/validation/projectValidation";
import DescriptionInputToolbar from "@/components/common/Description/descriptionToolbar";
import { getSocket } from "@/utils/socket";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";


type CreateProjectInput = z.infer<typeof projectCreateSchema>;
type UserOption = { label: string; value: string };

const ReactSelect = dynamic(() => import("react-select") as any, {
  ssr: false,
}) as React.ComponentType<SelectProps<UserOption, true>>;

const CreateProjectForm = () => {
  const router = useRouter();
  const [userOptions, setUserOptions] = useState<UserOption[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error,setError] = useState("");
  const user: any = useSelector((state: RootState) => state.user.data);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(projectCreateSchema),
    defaultValues: {
      users: [],
      is_active: true,
      project_coordinator: "",
      team_leader: "",
      project_manager: "",
      avatar: "",
      notes: "",
      description: "",
      creds: "",
      additional_information: "",
      url_dev: "",
      url_live: "",
      url_staging: "",
      url_uat: "",
      deploy_instruction: "",
      critical_notes: "",
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
          newOptions.forEach((opt) => existingMap.set(opt.value, opt));
          return Array.from(existingMap.values());
        });
      } catch (err) {
        console.error("Error fetching users:", err);
        setUserOptions([]);
      }
    }, 300),
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await AdminUserService.searchUsers("");
        const options = users.map((user: IUser) => ({
          label: `${user.firstName || ""} ${user.lastName || ""} (${user.email})`,
          value: user._id,
        }));
        setUserOptions(options);
      } catch (error) {
        console.error("Failed to fetch project", error);
        router.push("/admin/project");
      } finally {
      }
    };

    fetchData();
  }, [reset, router]);

  const socketRef = useRef(getSocket());

  const onSubmit = async (data: CreateProjectInput) => {
    setError("");
    try {
      const formData: any = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (Array.isArray(value)) {
          value.forEach((v, i) => formData.append(`${key}[${i}]`, v));
        } else {
          formData.append(key, value as any);
        }
      });

      if (selectedFile) {
        formData.append("avatar", selectedFile);
      }

      if (user) {
        formData.append("created_by", user?._id);
      }

      await AdminProjectService.createProject(formData);

      if (data?.users?.length) {
        if (!socketRef.current.connected) {
          socketRef.current.connect();
        }
        socketRef.current.on("connect", () => {
          socketRef.current.emit("register-user", user.id);
        });
        data.users.forEach((id) => {
          socketRef.current.emit("task-updated", {
            taskId: "1111",
            sender: user.firstName + " " + user.lastName,
            receiverId: id,
            description: "Assigned You a Project",
          });
        });
      }

      reset();
      setSelectedFile(null);
      router.push("/admin/project");
    } catch (error) {
      console.error(error);
    }
  };


  const sizeLimit = Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE);
  const handleFileChange = (e:any) => {
  const file = e.target.files[0];
  const maxAllowedSize = sizeLimit * 1024 * 1024; 
  if (file && file.size > maxAllowedSize) {
    setError(`File is too large. Please select an image smaller than ${sizeLimit}MB.`)
    e.target.value = '';

  } else {
    setSelectedFile(e.target.files?.[0] || null)
    setError("")
  }
};

const disable = error ? true : false;

  return (
    <div className="min-h-screen flex justify-center md:pt-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl bg-white md:p-6 p-4 rounded md:border border-gray-300 shadow space-y-4"
      >
        <div className="flex justify-center items-center md:p-[20px] p-2 border-b border-[#31394f14]">
          <div className="w-[5%]">
            <Link href="/admin/project">
              <Image src={leftarrow} alt="Back" width={16} height={16} />
            </Link>
          </div>
          <H3 className="w-[95%] text-center">Create Project</H3>
        </div>

        <Input placeholder="Title" {...register("title")} />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <DescriptionInputToolbar
              title="Description"
              isButton={false}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}

        <Controller
          name="deploy_instruction"
          control={control}
          render={({ field }) => (
            <DescriptionInputToolbar
              title="Deploy Instruction"
              isButton={false}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <Controller
          name="critical_notes"
          control={control}
          render={({ field }) => (
            <DescriptionInputToolbar
              title="Critical Notes"
              isButton={false}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

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
                closeMenuOnSelect={false}
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
        {errors.url_dev && (
          <p className="text-sm text-red-500">{errors.url_dev.message}</p>
        )}

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

        <Input
          type="file"
          required
          accept="image/*"
          onChange={handleFileChange}
        />
        {errors.avatar && (
          <p className="text-sm text-red-500">{errors.avatar.message}</p>
        )}
         {error&& (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <div>
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register("is_active")} />
            <span>Is Active</span>
          </label>
        </div>
        {errors.is_active && (
          <p className="text-sm text-red-500">{errors.is_active.message}</p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting || disable}
          className={`w-full btn-primary text-white py-2 px-4 rounded cursor-pointer`}
        >
          {isSubmitting ? "Creating..." : "Create Project"}
        </Button>
      </form>
    </div>
  );
};

export default CreateProjectForm;
