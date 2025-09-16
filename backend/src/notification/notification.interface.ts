import { Document, Types } from 'mongoose';

export interface INotification {
  content: string;
  user: Types.ObjectId;          
  is_read: boolean;
  redirect_url: string;
  createdAt: Date;
  updatedAt: Date;
  sort_order?: number;
}

export type NotificationDocument = Notification & Document;
