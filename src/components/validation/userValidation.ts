import { z } from "zod";

export const genderEnum = z.enum(["male", "female", "other"]);
export const userRoleEnum = z.enum([
  "admin",
  "project_manager",
  "team_member",
  "client",
  "employee",
  "user",
]);

// ✅ Regex patterns
const lettersAndSpacesRegex = /^[A-Za-z\s]+$/;
const numbersOnlyRegex = /^[0-9]+$/;

// ✅ Base Schema
export const userSchemaBase = z.object({
  username: z.string().nonempty("Username is required"),

  email: z.string().email("Invalid email address"),

  firstName: z
    .string()
    .nonempty("First name is required")
    .regex(
      lettersAndSpacesRegex,
      "First name must contain only letters and spaces"
    ),

  lastName: z
    .string()
    .nonempty("Last name is required")
    .regex(
      lettersAndSpacesRegex,
      "Last name must contain only letters and spaces"
    ),

  phone: z
    .string()
    .nonempty("Phone number is required")
    .regex(numbersOnlyRegex, "Phone number must contain only digits")
    .length(10, "Phone number must be 10 digits"),

  gender: genderEnum.optional(),

  roles: z.array(userRoleEnum).nonempty("At least one user role is required"),

  isActive: z.boolean().optional(),

  // address: z.string()
  //   .nonempty('Address is required')
  //   .regex(lettersAndSpacesRegex, 'Address must contain only letters and spaces'),

  // city: z.string()
  //   .nonempty('City is required')
  //   .regex(lettersAndSpacesRegex, 'City must contain only letters and spaces'),

  // state: z.string()
  //   .nonempty('State is required')
  //   .regex(lettersAndSpacesRegex, 'State must contain only letters and spaces'),

  // country: z.string()
  //   .nonempty('Country is required')
  //   .regex(lettersAndSpacesRegex, 'Country must contain only letters and spaces'),

  // zipCode: z.string()
  //   .nonempty('Zip code is required')
  //   .regex(numbersOnlyRegex, 'Zip code must contain only digits'),

  dateOfBirth: z
    .union([z.string(), z.date()])
    .transform((val) => (typeof val === "string" ? new Date(val) : val))
    .optional(),

  profileImage: z.string().url("Invalid image URL").optional(),

  // roles: z.array(z.string()).optional(),

  hobbies: z.array(z.string()).optional(),
  aboutUs: z.string().optional(),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  managerId: z.string().optional(),

  joinedDate: z
    .union([z.string(), z.date()])
    .transform((val) => (typeof val === "string" ? new Date(val) : val))
    .optional(),

  lastLogin: z
    .union([z.string(), z.date()])
    .transform((val) => (typeof val === "string" ? new Date(val) : val))
    .optional(),

  timezone: z.string().optional(),
  languagePreference: z.string().optional(),
  receiveEmailNotifications: z.boolean().optional(),
});

export const userSchemaBaseUpdate = z.object({
  username: z.string().nonempty("Username is required"),

  email: z.string().email("Invalid email address"),

  firstName: z
    .string()
    .nonempty("First name is required")
    .regex(
      lettersAndSpacesRegex,
      "First name must contain only letters and spaces"
    ),

  lastName: z
    .string()
    .nonempty("Last name is required")
    .regex(
      lettersAndSpacesRegex,
      "Last name must contain only letters and spaces"
    ),

  phone: z
    .string()
    .nonempty("Phone number is required")
    .regex(numbersOnlyRegex, "Phone number must contain only digits")
    .min(10, "Phone number must be at least 10 digit"),

  gender: genderEnum.optional(),

  roles: z.array(userRoleEnum).nonempty("At least one user role is required"),

  isActive: z.boolean().optional(),

  address: z.string().nonempty("Address is required"),
  city: z
    .string()
    .nonempty("City is required")
    .regex(lettersAndSpacesRegex, "City must contain only letters and spaces"),

  state: z
    .string()
    .nonempty("State is required")
    .regex(lettersAndSpacesRegex, "State must contain only letters and spaces"),

  country: z
    .string()
    .nonempty("Country is required")
    .regex(
      lettersAndSpacesRegex,
      "Country must contain only letters and spaces"
    ),

  zipCode: z
    .string()
    .nonempty("Zip code is required")
    .regex(numbersOnlyRegex, "Zip code must contain only digits"),

  dateOfBirth: z
    .union([z.string(), z.date()])
    .transform(
      (val) =>
        val instanceof Date
          ? val.toISOString().split("T")[0] // convert Date to "YYYY-MM-DD"
          : val // assume string already in "YYYY-MM-DD"
    )
    .optional(),

  profileImage: z.string().url("Invalid image URL").optional(),

  // roles: z.array(z.string()).optional(),

  hobbies: z.array(z.string()).optional(),
  aboutUs: z.string().optional(),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  managerId: z.string().optional(),

  joinedDate: z
    .union([z.string(), z.date()])
    .transform((val) => (typeof val === "string" ? new Date(val) : val))
    .optional(),

  lastLogin: z
    .union([z.string(), z.date()])
    .transform((val) => (typeof val === "string" ? new Date(val) : val))
    .optional(),

  timezone: z.string().optional(),
  languagePreference: z.string().optional(),
  receiveEmailNotifications: z.boolean().optional(),
});
// Create Schema
export const userCreateSchema = userSchemaBase
  .extend({
    password: z
      .string()
      .nonempty("Password is required")
      .min(6, "Password must be at least 6 characters"),

    confirmPassword: z
      .string()
      .nonempty("Confirm password is required")
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// For Update (all fields required + specific validations applied)
export const userUpdateSchema = userSchemaBase.partial();

export const userResetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .nonempty("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .nonempty("Confirm password is required")
      .min(6, "Confirm Password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const userLoginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .nonempty("Email is required")
    .email("Invalid email format"),

  password: z
    .string({ required_error: "Password is required" })
    .nonempty("Password is required"),
  // .min(6, 'Password must be at least 6 characters'),
});
