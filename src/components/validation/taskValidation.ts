import { z } from "zod";

// Priority Enum
export const taskPriorityEnum = z.enum(["low", "medium", "high"]);

// ✅ Base Schema for Task (common for create and update)
export const taskSchemaBase = z.object({
  title: z.string().min(1, "Title is required"),

  description: z.string().optional(),

  project: z.string().min(1, "Project is required"),

  sort_order: z.number().optional(),

  assigned_to: z.string().optional(),

  report_to: z.string().min(1, "Report To is required"),

  due_date: z
    .union([z.string(), z.date()])
    .transform((val) => (typeof val === "string" ? new Date(val) : val))
    .optional(),

  is_active: z.boolean().optional(),

  priority: taskPriorityEnum.optional(),

  estimated_time: z.number().optional(),
});

// ✅ Task Create Schema
export const taskCreateSchema = taskSchemaBase.extend({
  title: z.string().min(1, "Title is required"),
  project: z.string().min(1, "Project is required"),
  report_to: z.string().min(1, "Report To is required"),
  estimated_time: z
  .union([z.string(), z.number()])
  .transform((val) => {
    if (typeof val === "string") {
      return val.trim() === "" ? undefined : parseFloat(val);
    }
    return val;
  })
  .refine((val) => val === undefined || (!isNaN(val) && val > 0), {
    message: "Estimated time must be a number and greater than 0.",
  })
  .optional(),
});

// ✅ Task Update Schema
export const taskUpdateSchema = taskSchemaBase.partial();
