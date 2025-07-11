import { z } from "zod";

export const projectCreateSchema = z.object({
  code: z.string().min(1, "Project code is required"),
  users: z.array(z.string(), {
    required_error: "Users are required",
    invalid_type_error: "Users must be an array of strings",
  }),

  sort_order: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), {
      message: "Sort order must be a valid number",
    }),

  is_active: z.literal(true, {
    errorMap: () => ({ message: "Active status is required" }),
  }),

  project_coordinator: z.string().optional(),
  team_leader: z.string().optional(),
  project_manager: z.string().optional(),
  avatar: z.string().optional(),
  notes: z.string().optional(),
  creds: z.string().optional(),
  additional_information: z.string().optional(),
  url_dev: z.string().optional(),
  url_live: z.string().optional(),
  url_staging: z.string().optional(),
  url_uat: z.string().optional(),
  title: z.string().min(1, "Title is required"),
});

export const projectUpdateSchema = projectCreateSchema.partial();
