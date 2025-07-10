import { CreateNotificationDto, INotification, INotificationItem } from "@/types/notification.interface";
import { createAxiosClient } from "@/utils/createAxiosClient";

const axiosClient = createAxiosClient({ withCreds: true });
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const NotificationService = {
  async createNotification(data: CreateNotificationDto) {
    const res = await axiosClient.post(`${API_URL}/notifications`, data);
    return res.data;
  },

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
