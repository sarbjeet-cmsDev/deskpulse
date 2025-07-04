import { Document, Types } from 'mongoose';

export interface Notification {
  content: string;
  user: Types.ObjectId;          // Correct way to type ObjectId
  is_read: boolean;
  redirect_url: string;
  createdAt: Date;
  updatedAt: Date;
  sort_order?: number;
}

export type NotificationDocument = Notification & Document;
