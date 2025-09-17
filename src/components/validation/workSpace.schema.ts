import { z } from "zod";

export const workSpaceCreateSchema = z.object({

    title: z.string().nonempty("Title is required"),
});


export const inviteMemberSchema = z.object({
    email: z.string().email("Enter a valid email"),
    role: z.enum(["user", "admin"], { required_error: "Role is required" }),
});