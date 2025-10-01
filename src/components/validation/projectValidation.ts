import { z } from "zod";

const lettersAndSpacesRegex = /^[A-Za-z\s]+$/;

export const projectCreateSchema = z.object({
  users: z.array(z.string(), {
    required_error: "Users are required",
    invalid_type_error: "Users must be an array of strings",
  }),

  is_active: z.literal(true, {
    errorMap: () => ({ message: "Active status is required" }),
  }),

  project_coordinator: z.string().optional(),
  team_leader: z.string().optional(),
  project_manager: z.string().optional(),
  avatar: z.string().optional(),
  notes: z.string().optional(),
  description: z
    .string()
    .refine(
      (val) => {
        const hasText = val.replace(/<[^>]*>/g, "").trim() !== "";
        const hasImage = /<img\s+[^>]*src=["'][^"']+["']/i.test(val);
        return hasText || hasImage;
      },
      { message: "Description is required" }
    ),

  deploy_instruction: z.string().optional(),
  critical_notes: z.string().optional(),
  creds: z.string().optional(),
  additional_information: z.string().optional(),
  url_dev: z.string().optional(),
  url_live: z.string().optional(),
  url_staging: z.string().optional(),
  url_uat: z.string().optional(),
  // created_by:z.string().optional(),
  // updated_by:z.string().optional(),
  title: z.string().nonempty("Title is required").regex(
      lettersAndSpacesRegex,
      "Title must contain only letters and spaces"
    ),
  // workSpace: z.string().nonempty("WorkSpace is required")
});

export const projectUpdateSchema = projectCreateSchema.partial();

export const projectDescriptionUpdateSchema = z.object({
  description: z.string().nonempty("Description is required"),
});
