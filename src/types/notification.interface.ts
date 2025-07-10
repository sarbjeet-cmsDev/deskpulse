export interface INotification {
  notifications: INotificationItem[];
  id: string;
}

export interface CreateNotificationDto {
  content: string;
  user: string;
  redirect_url: string;
  is_read?: boolean;
}
export interface INotificationItem {
  _id: string;
  content: string;
  user: string;
  isRead: boolean;
  redirectUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

