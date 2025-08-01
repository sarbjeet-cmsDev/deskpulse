"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import { MultiValue, Props as SelectProps } from "react-select";
import ProjectAvtar from "@/assets/images/projectimage.png";
import { Input } from "@/components/Form/Input";
import { Button } from "@/components/Form/Button";
import { H1 } from "@/components/Heading/H1";
import AdminUserService, { IUser } from "@/service/adminUser.service";
import AdminProjectService from "@/service/adminProject.service";
import { projectUpdateSchema } from "@/components/validation/projectValidation";
import { UpdateKanbanList } from "@/components/KanbanBoard/UpdateKanbanList";
import Link from "next/link";
import Image from "next/image";
import leftarrow from "@/assets/images/back.png";
import { H3 } from "@/components/Heading/H3";
import DescriptionInputToolbar from "@/components/common/Description/descriptionToolbar";

interface Props {
  id: string;
}

type UpdateProjectInput = z.infer<typeof projectUpdateSchema>;
type UserOption = { label: string; value: string };

const ReactSelect = dynamic(() => import("react-select") as any, {
  ssr: false,
}) as React.ComponentType<SelectProps<UserOption, true>>;

// function stripHtml(html: string): string {
//   return html.replace(/<[^>]*>/g, "").trim();
// }

const UpdateProjectPage = ({ id }: Props) => {
  const router = useRouter();
//   const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [userOptions, setUserOptions] = useState<UserOption[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [project, setProject] = useState<any>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [version, setVersion] = useState<number>(Date.now());
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProjectInput>({
    resolver: zodResolver(projectUpdateSchema),
  });

  const fetchUsers = useCallback(
    debounce(async (input: string) => {
      try {
        const users = await AdminUserService.searchUsers(input || "");
        const options = users.map((user: IUser) => ({
          label: `${user.firstName || ""} ${user.lastName || ""} (${user.email})`,
          value: user._id,
        }));
        setUserOptions(options);
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
        const project = await AdminProjectService.getProjectById(id);
        // project.description = stripHtml(project.description || "");
        setProject(project);
        const users = await AdminUserService.searchUsers("");
        const options = users.map((user: IUser) => ({
          label: `${user.firstName || ""} ${user.lastName || ""} (${user.email})`,
          value: user._id,
        }));
        setUserOptions(options);

        reset(project);
      } catch (error) {
        console.error("Failed to fetch project", error);
        router.push("/admin/project");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, reset, router]);

  const onSubmit = async (data: UpdateProjectInput) => {
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
      await AdminProjectService.updateProject(id, formData);
      router.push("/admin/project");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading project...</div>;
  }

   const avatarUrl = project?.avatar
          ? `${process.env.NEXT_PUBLIC_BACKEND_HOST}${project?.avatar}?v=${version}`
          : ProjectAvtar.src;


  return (
    <div className="min-h-screen flex flex-col lg:flex-row justify-center items-start gap-6 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full lg:max-w-2xl bg-white p-6 rounded shadow border border-gray-300 space-y-4"
      >
        <div className="flex justify-center items-center pb-5 border-b border-[#31394f14]">
       
          <Link href="/admin/project">
            <Image src={leftarrow} alt="Back" width={16} height={16} />
          </Link>
       
        <H3 className="text-center flex-1">Update Project</H3>
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
            const selectedOptions = userOptions.filter((opt) =>
              field.value?.includes(opt.value)
            );

            return (
              <ReactSelect
                isMulti
                options={userOptions}
                placeholder="Assign Users"
                value={selectedOptions}
                inputValue={inputValue}
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
                styles={{
                  option: (base) => ({ ...base, color: "black" }),
                  singleValue: (base) => ({ ...base, color: "black" }),
                  multiValueLabel: (base) => ({ ...base, color: "black" }),
                }}
                classNamePrefix="react-select"
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

        <div className="flex flex-col items-left gap-5">
          <label>Select Avatar</label>
        <Input
          type="file"
          accept="image/*"
          placeholder="choose Avatar"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
        />
         <label>Avatar</label>
          <Image
            src={avatarUrl}
            alt="project-avatar"
            className="rounded-[8px] object-contain w-[150px] h-[100px]"
            width={1200}
            height={50}
          />
        </div>
        {/* 
        <Input type="number" placeholder="Sort Order" {...register('sort_order')} />
        {errors.sort_order && (
          <p className="text-sm text-red-500">{errors.sort_order.message}</p>
        )} */}

        <div>
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register("is_active")} />
            <span>Is Active</span>
          </label>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary text-white py-2 px-4 rounded"
        >
          {isSubmitting ? "Updating..." : "Update Project"}
        </Button>
      </form>
      <UpdateKanbanList key={project._id} projectId={id} project={project} />
    </div>
  );
};

export default UpdateProjectPage;
