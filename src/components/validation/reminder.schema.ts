import { z } from "zod";
const days = [
  { name: "Monday", value: "monday" },
  { name: "Tuesday", value: "tuesday" },
  { name: "Wednesday", value: "wednesday" },
  { name: "Thursday", value: "thursday" },
  { name: "Friday", value: "friday" },
  { name: "Saturday", value: "saturday" },
  { name: "Sunday", value: "sunday" },
];
export const createReminderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  start: z.string().min(1, "Start date is required"),
  end: z.string().min(1, "End date is required"),
  status: z.enum(["pending", "complete"]).optional(),
  alert: z.boolean().optional(),
  alert_before: z.number().min(0, "Alert before must be a positive number").optional(),
  sort_order: z.number().optional(),
  repeat: z.enum(["none", "daily", "weekly", "monthly"]).default("none"),
  days: z.array(z.enum([
    "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
  ])).optional(),

});

export type CreateReminderFormData = z.infer<typeof createReminderSchema>;