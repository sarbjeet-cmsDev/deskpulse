"use client";

import { Modal, ModalContent, ModalBody, useDisclosure } from "@heroui/react";
import { Button } from "@/components/Form/Button";
import { Input } from "@/components/Form/Input";
import { H5 } from "@/components/Heading/H5";
import { useState, useCallback, useEffect } from "react";
import { debounce } from "lodash";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskCreateSchema } from "../validation/taskValidation";
import { Controller } from "react-hook-form";
import ReactSelect from "react-select";
import { IUser } from "@/service/adminUser.service";
import ProjectService from "@/service/project.service";
import DescriptionInputToolbar from "../common/Description/descriptionToolbar";

interface UserOption {
  label: string;
  value: string;
}

interface CreateTaskModalProps {
  onCreate: (
    title: string,
    description: string,
    due_date: string,
    estimated_time: number,
    assigned_to?: string
  ) => Promise<void>;

  projectId: string;
  users?: any[];
}

export default function CreateTaskModal({
  onCreate,
  projectId,
  users = [],
}: CreateTaskModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [userOptions, setUserOptions] = useState<UserOption[]>([]);
  const [inputValue, setInputValue] = useState("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      taskCreateSchema.pick({
        title: true,
        description: true,
        due_date: true,
        estimated_time: true,
        assigned_to: true,
      })
    ),
    defaultValues: {
      title: "",
      description: "",
      due_date: "",
      estimated_time: "",
      assigned_to: "",
    },
  });

  const fetchUsers = useCallback(
    debounce(async (input: string) => {
      try {
        const usersData = await ProjectService.getProjectUsers(
          projectId,
          input
        );
        const users = usersData.users || [];

        const newOptions = users.map((user: IUser) => ({
          label: `${user.firstName || ""} ${user.lastName || ""} (${user.email})`,
          value: user._id,
        }));

        setUserOptions(newOptions);
      } catch (err) {
        console.error("Error fetching users:", err);
        setUserOptions([]);
      }
    }, 300),
    [projectId]
  );

  const handleCreate = async (values: {
    title: string;
    description: string;
    due_date: string;
    estimated_time: any;
    assigned_to: string;
  }) => {
    setLoading(true);
    try {
      const estimatedTime = parseFloat(values.estimated_time);
      await onCreate(
        values.title,
        values.description,
        values.due_date,
        estimatedTime,
        values.assigned_to || undefined
      );
      reset();
      onOpenChange();
    } catch (error) {
      console.error("Task creation failed:", error);
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
      <Button
        onPress={onOpen}
        className="btn-primary text-white block w-full flex justify-center items-center gap-2 text-[14px] leading-[16px] font-bold py-[16px] rounded-[12px] px-[28px]"
      >
        Create Task
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="max-h-[85vh] overflow-y-auto pb-[env(safe-area-inset-bottom)] scrollbar-hide">
          {(onClose) => (
            <>
              <ModalBody className="p-0">
                <H5 className="text-center p-4 border-b border-[#31394f1a]">
                  Create New Task
                </H5>
                <form
                  onSubmit={handleSubmit(handleCreate)}
                  className="px-4 py-4 space-y-4"
                  noValidate
                >
                  <div className="px-4">
                    <Input
                      label="Title"
                      type="text"
                      placeholder="Enter task title"
                      {...register("title")}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.title.message as string}
                      </p>
                    )}
                  </div>
                  <div className="px-4">
                    <Controller
                      {...register("description")}
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

                  </div>

                  <div className="px-4">
                    <Input
                      label="Due date"
                      type="date"
                      placeholder=""
                      {...register("due_date")}
                    />
                  </div>
                  <div className="px-4">
                    <Input
                      label="Time estimate"
                      type="text"
                      placeholder="Enter Time estimate"
                      {...register("estimated_time")}
                    />
                    {errors.estimated_time && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.estimated_time.message as string}
                      </p>
                    )}
                  </div>

                  <div className="px-4">
                    <label className="block mb-1 font-medium text-sm">
                      Assign User
                    </label>
                    <Controller
                      name="assigned_to"
                      control={control}
                      render={({ field }) => {
                        const selectedOption = userOptions.find(
                          (option) => option.value === field.value
                        );

                        return (
                          <ReactSelect
                            options={userOptions}
                            placeholder="Select user"
                            value={selectedOption || null}
                            inputValue={inputValue}
                            onInputChange={(value) => {
                              setInputValue(value);
                              if (value.length >= 1) fetchUsers(value);
                            }}
                            onFocus={() => {
                              if (userOptions.length === 0) {
                                fetchUsers("");
                              }
                              fetchUsers("");
                            }}
                            onChange={(selected) => {
                              field.onChange(selected?.value || "");
                            }}
                            isClearable
                            classNamePrefix="react-select"
                            styles={{
                              menu: (provided) => ({
                                ...provided,
                                maxHeight: 100,
                                overflowY: "auto",
                                scrollBehavior: "smooth",
                              }),
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                              option: (provided) => ({
                                ...provided,
                                color: "black",
                              }),
                              singleValue: (provided) => ({
                                ...provided,
                                color: "black",
                              }),
                            }}
                          />
                        );
                      }}
                    />
                    {errors.assigned_to && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.assigned_to.message as string}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col divide-y border-t">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="p-4 bg-transparent text-theme-primary font-bold"
                    >
                      {loading ? "Creating..." : "Create"}
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
