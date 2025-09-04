import { z } from "zod";

export const createTimelineSchema = z.object({
  task: z.string().min(1, { message: "Task is required." }),

  date: z
    .preprocess(
      (arg) => {
        if (typeof arg === "string" || arg instanceof Date) {
          const date = new Date(arg);
          return isNaN(date.getTime()) ? undefined : date;
        }
        return arg;
      },
      z.date({ required_error: "Date is required." })
    )
    .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
      message: "Date must be a valid date.",
    }),

  user: z.string().min(1, { message: "User is required." }),

  time_spent: z
    .string()
    .min(1, { message: "Duration is required." })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Duration must be a number it's value is greater than 0.",
    }),

  comment: z.string().nonempty("Comment is required"),

  is_active: z.boolean().optional(),
});

export const updateTimelineSchema = z.object({
  task: z.string().min(1, { message: "Task is required." }),

  date: z.preprocess(
    (arg) =>
      typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
    z.date().optional()
  ),

  user: z.string().optional(),

  description: z.string().optional(),

  time_spent: z.string().min(1, { message: "Time spent is required." }),

  is_active: z.boolean().optional(),
});
