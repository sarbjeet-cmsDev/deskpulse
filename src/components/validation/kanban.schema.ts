import { z } from "zod";

export const createKanbanSchema = z.object({
  title: z.string().min(1, "Title is required"),
  sort_order: z.number().min(1, "Sort Order is required"),
  project: z.string().min(1, "Project is required"),
  color: z.string().min(1, "Project is required")
});

export type CreateKanbanFormData = z.infer<typeof createKanbanSchema>;

export const updateKanbanSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export type updateKanbanFormData = z.infer<typeof updateKanbanSchema>;
