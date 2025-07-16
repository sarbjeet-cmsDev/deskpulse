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

  estimated_time: z.number().optional(), // in hours
});

// ✅ Task Create Schema
export const taskCreateSchema = taskSchemaBase.extend({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  project: z.string().min(1, "Project is required"),
  report_to: z.string().min(1, "Report To is required"),
});

// ✅ Task Update Schema
export const taskUpdateSchema = taskSchemaBase.partial();
