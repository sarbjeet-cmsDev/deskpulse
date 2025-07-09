import { Document, Types } from 'mongoose';

export type UserRole = 'admin' | 'project_manager' | 'team_member' | 'client' | 'employee';
export type Gender = 'male' | 'female' | 'other';

export interface User {
  username: string;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: Gender;
  userRoles?: UserRole[];
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDocument extends User, Document {}
