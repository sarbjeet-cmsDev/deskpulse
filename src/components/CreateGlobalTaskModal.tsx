"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ReactSelect from "react-select";
import { Modal, ModalContent, ModalBody } from "@heroui/react";
import { getSocket } from "@/utils/socket";
import { Button } from "@/components/Form/Button";
import { Input } from "@/components/Form/Input";
import { H5 } from "@/components/Heading/H5";
import TaskService, { ITask } from "@/service/task.service";
import ProjectService from "@/service/project.service";
import { IUser } from "@/service/adminUser.service";
import { taskGlobalSchema } from "./validation/taskValidation";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import AdminProjectService from "@/service/adminProject.service";
import DescriptionInputToolbar from "./common/Description/descriptionToolbar";
import { ProjectKanbon } from "@/service/projectKanbon.service";
import { useParams, usePathname, useSearchParams } from "next/navigation";

interface CreateGlobalTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (
    title: string,
    description: string,
    due_date: string,
    estimated_time: number,
    assigned_to?: string,
    projectId?: string,
    kanban?: string
  ) => Promise<void>;
}

export default function CreateGlobalTaskModal({
  isOpen,
  onClose,
  onCreate,
}: CreateGlobalTaskModalProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [projectOptions, setProjectOptions] = useState<ProjectOption[]>([]);
  const [userOptions, setUserOptions] = useState<ProjectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [kanbanList, setKanbanList] = useState<any>()
  const loginUser: any = useSelector((state: RootState) => state.user.data);
  const [getProjectId, setGetProjectId] = useState()
  const { projectId: code } = useParams()
  const { id } = useParams()
  const fetchProjectByCode = async () => {
    const result = await ProjectService.getProjectByCode(code as string);
    setGetProjectId(result?._id);
  };
  useEffect(() => {
    if (code) {

      fetchProjectByCode();
    }
  }, [code]);




  interface ProjectOption {
    label: string;
    value: string;
  }
  const socketRef = useRef(getSocket());

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      taskGlobalSchema.pick({
        title: true,
        description: true,
        due_date: true,
        estimated_time: true,
        assigned_to: true,
        projectId: true,
        status: true
      })
    ),
    defaultValues: {
      title: "",
      description: "",
      due_date: "",
      estimated_time: "",
      assigned_to: null,
      projectId: null,
      status: null
    },
  });

  const projectId = watch("projectId");
  // Fetch project list
  useEffect(() => {
    async function fetchProjects() {
      try {
        const getCookie = (name: string) => {
          const match = document.cookie
            .split("; ")
            .find((row) => row.startsWith(name + "="));
          return match ? decodeURIComponent(match.split("=")[1]) : null;
        };

        const role = getCookie("role");

        let res;

        if (role === "admin") {
          res = await AdminProjectService.getAllProjectListing();
        } else {
          res = await ProjectService.getProjectByUserId();
        }

        const options = (res?.data || []).map((p: any) => ({
          value: p._id,
          label: p.title,
        }));

        setProjectOptions(options);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    }

    fetchProjects();
  }, []);

  // Fetch users based on selected project
  useEffect(() => {
    async function fetchUsers() {
      if (!projectId) {
        setUserOptions([]);
        return;
      }

      try {
        const res = await ProjectService.getProjectUsers(projectId);
        const result = await ProjectKanbon.getProjectKanbonList(projectId || getProjectId);
        const KanbanListoptions = result.data?.map((kanban: any) => ({
          value: kanban.title,
          label: kanban.title,
        }));
        setKanbanList(KanbanListoptions)
        const users = res?.users || [];

        const options = users.map((user: IUser) => ({
          value: user._id,
          label: `${user.firstName} ${user.lastName} (${user.email})`,
        }));

        setUserOptions(options);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setUserOptions([]);
      }
    }

    fetchUsers();
  }, [projectId]);


  useEffect(() => {
    if (getProjectId || id) {
      reset((prev: any) => ({
        ...prev,
        projectId: getProjectId || id, // auto-select project
      }));
    }
  }, [getProjectId, id, reset]);



  const handleCreate = async (values: any) => {
    setLoading(true);
    // Destructure values from the form
    const {
      title,
      description,
      projectId,
      due_date,
      estimated_time,
      assigned_to,
      status
    } = values;

    try {
      let res = await TaskService.createTask({
        title,
        description,
        project: projectId || "",
        assigned_to: assigned_to || "",
        due_date,
        estimated_time: values.estimated_time,
        status
      });

      if (title) {
        if (!socketRef.current.connected) {
          socketRef.current.connect();
        }
        socketRef.current.on("connect", () => {
          socketRef.current.emit("register-user", loginUser.id);
        });

        socketRef.current.emit("task-updated", {
          taskId: "1111",
          sender: assigned_to
            ? loginUser.firstName + " " + loginUser.lastName
            : "This",
          receiverId: assigned_to || "",
          description: assigned_to
            ? `Assigned you a task : ${title}`
            : `${title} task is assigned by you.`,
        });

        console.log(
          "✅ socket event 'task-updated' hit while assigned user in project"
        );
      }
      reset();
      onClose();
    } catch (err) {
      console.error("Task creation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent>
        <ModalBody className="p-0">
          <H5 className="text-center p-4 border-b border-[#31394f1a]">
            Create New Task
          </H5>

          <form onSubmit={handleSubmit(handleCreate)} className="p-4 space-y-4">
            <Input label="Title" type="text" {...register("title")} />
            {errors.title && (
              <p className="text-red-500 text-xs">{errors.title.message}</p>
            )}

            {/* <Input
              label="Description"
              type="text"
              {...register("description")}
            /> */}
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
            {/* <textarea
              {...register("description")}
              rows={2}
              className="w-full rounded-lg border border-gray-100 bg-gray-100 p-2 focus:outline-none"
              placeholder="Write description..."
            />
            {errors.description && (
              <p className="text-red-500 text-xs">
                {errors.description.message}
              </p>
            )} */}

            <Input label="Due Date" type="date" {...register("due_date")} />
            {errors.due_date && (
              <p className="text-red-500 text-xs">{errors.due_date.message}</p>
            )}
            <Input
              label="Time Estimate"
              type="text"
              {...register("estimated_time")}
            />
            {errors.estimated_time && (
              <p className="text-red-500 text-xs">
                {errors.estimated_time.message}
              </p>
            )}

            {/* Project Selector */}
            <label className="block text-sm font-medium">Select Project</label>
            <Controller
              name="projectId"
              control={control}
              render={({ field }) => {
                const valueToUse = field.value || getProjectId || id || null;

                const selectedOption =
                  projectOptions.find((opt) => opt.value === valueToUse) ||
                  null;

                return (
                  <ReactSelect
                    options={projectOptions}
                    value={selectedOption}
                    onChange={(selected) => field.onChange(selected?.value ?? null)}

                    isClearable
                  />
                );
              }}
            />

            {errors.projectId && (
              <p className="text-red-500 text-xs">{errors.projectId.message}</p>
            )}
            <label className="block text-sm font-medium">Select Kanban</label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => {
                const selectedOption =
                  kanbanList?.find((opt: any) => opt.value === field.value) || null;

                return (
                  <ReactSelect
                    options={kanbanList}
                    value={selectedOption}
                    onChange={(selected) => field.onChange(selected?.value ?? null)}
                    isClearable
                  />
                );
              }}
            />


            {errors.status && (
              <p className="text-red-500 text-xs">{errors.status.message}</p>
            )}
            {/* Assigned To */}
            <label className="block text-sm font-medium">Assign User</label>
            <Controller
              name="assigned_to"
              control={control}
              render={({ field }) => {
                const selectedOption =
                  userOptions.find((opt) => opt.value === field.value) || null;
                return (
                  <ReactSelect
                    options={userOptions}
                    value={selectedOption}
                    onChange={(selected) =>
                      field.onChange(selected?.value ?? null)
                    }
                    isClearable
                  />
                );
              }}
            />

            {errors.assigned_to && (
              <p className="text-red-500 text-xs">
                {errors.assigned_to.message}
              </p>
            )}

            <div className="flex justify-end mt-4 space-x-2 ">
              <Button type="button" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button className="btn-primary" type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Task"}
              </Button>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
