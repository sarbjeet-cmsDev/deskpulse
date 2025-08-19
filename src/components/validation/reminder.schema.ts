import { z } from "zod";

export const createReminderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  start: z.string().min(1, "Start date is required"),
  end: z.string().min(1, "End date is required"),
  status: z.enum(["pending", "complete"]).optional(),
  alert: z.boolean().optional(),
  alert_before: z.number().min(0, "Alert before must be a positive number").optional(),
  sort_order: z.number().optional(),
});

export type CreateReminderFormData = z.infer<typeof createReminderSchema>;