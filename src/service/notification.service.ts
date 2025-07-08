import { INotification, INotificationItem } from "@/types/notification.interface";
import { createAxiosClient } from "@/utils/createAxiosClient";

const axiosClient = createAxiosClient({ withCreds: true });
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const NotificationService = {
  async getNotificationByUserId(id: string): Promise<INotification> {
    const response = await axiosClient.get(
      `${API_URL}/notifications/user/${id}`
    );
    return response.data as INotification;
  },

  async updateNotificationStatus(id: string): Promise<INotificationItem> {
    const response = await axiosClient.put(
      `${API_URL}/notifications/${id}/read`
    );
    return response.data as INotificationItem;
  },
};

export default NotificationService;
