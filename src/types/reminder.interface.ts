import { ReactNode } from "react";

export interface IReminder {
  alert_before: ReactNode;
  alert: any;
  // start: string | number | Date;
  start: string ;
  end?: string;
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: 'pending' | 'completed' | string;
  user: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateReminderDto {
  title: string;
  description?: string;
  dueDate?: string;
}

export interface UpdateReminderDto {
  title?: string;
  description?: string;
  dueDate?: string;
  status?: string;
}

export interface IReminderResponse {
  reminders?:any
  total: number;
  page: number;
  limit: number;
}
