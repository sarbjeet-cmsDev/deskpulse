import { Document, Schema as MongooseSchema } from 'mongoose';

export interface User {
  username: string;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDocument extends User, Document { }
