export interface INotification {
  notifications: INotificationItem[];
  id: string;
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

