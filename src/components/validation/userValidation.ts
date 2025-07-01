import { z } from 'zod';

export const genderEnum = z.enum(['male', 'female', 'other']);
export const userRoleEnum = z.enum([
  'admin',
  'project_manager',
  'team_member',
  'client',
  'employee',
]);

// ✅ Base Schema
export const userSchemaBase = z.object({
  username: z.string().min(3, 'Username is required'),
  email: z.string().email('Invalid email address'),

  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),

  gender: genderEnum.optional(),

  userRoles: z.array(userRoleEnum).optional(),

  isActive: z.boolean().optional(),

  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),

  dateOfBirth: z
    .union([z.string(), z.date()])
    .transform((val) => (typeof val === 'string' ? new Date(val) : val))
    .optional(),

  profileImage: z.string().url('Invalid image URL').optional(),

  roles: z.array(z.string()).optional(),

  hobbies: z.array(z.string()).optional(),
  aboutUs: z.string().optional(),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  managerId: z.string().optional(),

  joinedDate: z
    .union([z.string(), z.date()])
    .transform((val) => (typeof val === 'string' ? new Date(val) : val))
    .optional(),

  lastLogin: z
    .union([z.string(), z.date()])
    .transform((val) => (typeof val === 'string' ? new Date(val) : val))
    .optional(),

  timezone: z.string().optional(),
  languagePreference: z.string().optional(),
  receiveEmailNotifications: z.boolean().optional(),
});

export const userCreateSchema = userSchemaBase.extend({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm Password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const userUpdateSchema = userSchemaBase.partial();

export const userResetPasswordSchema = z.object({
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm Password is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
