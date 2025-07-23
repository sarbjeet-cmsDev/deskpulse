import { createAxiosClient } from "@/utils/createAxiosClient";
import { INotification } from "@/types/notification.interface";

const axiosClient = createAxiosClient({ withCreds: false });
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;


const AdminNotificationService = {
  
  async getAllNotification(params?: {
    page?: number;
    limit?: number;
    keyword?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<{ data: INotification[]; total: number; limit:number; totalPages:number }> {
    const res = await axiosClient.get(`${API_URL}/admin/notification`, { params });
    return {
      data: res.data.data,
      total: res.data.total,
      limit: res.data.limit,
      totalPages: res.data.totalPages,
    };
  },

  
  async deleteNotification(id: string): Promise<void> {
    await axiosClient.delete(`${API_URL}/admin/notification/${id}`);
  },
};

export default AdminNotificationService;