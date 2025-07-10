import { z } from 'zod';

export const taskChecklistStatusEnum = z.enum(['pending', 'complete']);

export const createChecklistSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  status: taskChecklistStatusEnum,
  task: z.string().min(1, 'Task ID is required'),
  created_by: z.string().min(1, 'Created by is required'),
  completed_by: z.string().min(1, 'Completed by is required'),
  visibility: z.boolean(),
  estimate_time: z.number().min(0, 'Estimate time must be zero or positive'),
});

export const updateChecklistSchema = z.object({
  title: z.string().optional(),
  status: taskChecklistStatusEnum.optional(),
  completed_by: z.string().optional(),
  visibility: z.boolean().optional(),
  estimate_time: z.number().min(0, 'Estimate time must be zero or positive').optional(),
});