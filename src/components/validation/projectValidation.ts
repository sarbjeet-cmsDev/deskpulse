// components/validation/projectValidation.ts
import { z } from 'zod';

export const projectSchemaBase = z.object({
  code: z.string().min(1, 'Project code is required'),

  users: z.array(z.string()).default([]), // required with default
  is_active: z.boolean().default(true),
  sort_order: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), {
      message: 'Sort order must be a valid number',
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
});

export const projectCreateSchema = projectSchemaBase;

export const projectUpdateSchema = projectSchemaBase.partial();
