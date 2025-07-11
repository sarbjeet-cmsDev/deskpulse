import { z } from 'zod';

export const genderEnum = z.enum(['male', 'female', 'other']);
export const userRoleEnum = z.enum([
  'admin',
  'project_manager',
  'team_member',
  'client',
  'employee',
]);

// ✅ Regex patterns
const lettersAndSpacesRegex = /^[A-Za-z\s]+$/;
const numbersOnlyRegex = /^[0-9]+$/;

// ✅ Base Schema
export const userSchemaBase = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),

  firstName: z.string()
    .min(1, 'First name is required')
    .regex(lettersAndSpacesRegex, 'First name must contain only letters and spaces'),

  lastName: z.string()
    .min(1, 'Last name is required')
    .regex(lettersAndSpacesRegex, 'Last name must contain only letters and spaces'),

  phone: z.string()
    .min(1, 'Phone number is required')
    .regex(numbersOnlyRegex, 'Phone number must contain only digits'),

  gender: genderEnum,

  userRoles: z.array(userRoleEnum),

  isActive: z.boolean(),
  address: z.string()
  .min(1, 'Address is required')
  .regex(lettersAndSpacesRegex, 'Address must contain only letters and spaces'),
  
  city: z.string()
  .min(1, 'City is required')
    .regex(lettersAndSpacesRegex, 'City must contain only letters and spaces'),

  state: z.string()
  .min(1, 'State is required')
    .regex(lettersAndSpacesRegex, 'State must contain only letters and spaces'),

  country: z.string()
  .min(1, 'Country is required')
    .regex(lettersAndSpacesRegex, 'Country must contain only letters and spaces'),

  zipCode: z.string()
  .min(1, 'ZipCode is required'),

  dateOfBirth: z.union([z.string(), z.date()])
    .transform((val) => (typeof val === 'string' ? new Date(val) : val)),

  profileImage: z.string().url('Invalid image URL'),

  roles: z.array(z.string()),

  hobbies: z.array(z.string()),
  aboutUs: z.string(),
  jobTitle: z.string(),
  department: z.string(),
  managerId: z.string(),

  joinedDate: z.union([z.string(), z.date()])
    .transform((val) => (typeof val === 'string' ? new Date(val) : val)),

  lastLogin: z.union([z.string(), z.date()])
    .transform((val) => (typeof val === 'string' ? new Date(val) : val)),

  timezone: z.string(),
  languagePreference: z.string(),
  receiveEmailNotifications: z.boolean(),
});

// ✅ For Create (unchanged)
export const userCreateSchema = userSchemaBase.extend({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm Password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// ✅ For Update (all fields required + specific validations applied)
export const userUpdateSchema = userSchemaBase;

export const userResetPasswordSchema = z.object({
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm Password is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

  export const userLoginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .nonempty('Email is required')
    .email('Invalid email format'),

  password: z
    .string({ required_error: 'Password is required' })
    .nonempty('Password is required')
    // .min(6, 'Password must be at least 6 characters'),
});