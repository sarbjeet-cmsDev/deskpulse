import { INotification } from "@/types/notification.interface";
import { createAxiosClient } from "@/utils/createAxiosClient";

const axiosClient = createAxiosClient({ withCreds: true });
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const NotficationService = {
  async getNotificationByUserId(id: string): Promise<INotification> {
    const response = await axiosClient.get(
      `${API_URL}/notifications/user/${id}`
    );
    return response.data;
  },

  async updateNotificationStatus(id: string): Promise<INotification> {
    const response = await axiosClient.put(
      `${API_URL}/notifications/${id}/read`
    );
    return response.data;
  },
};

export default NotficationService;
