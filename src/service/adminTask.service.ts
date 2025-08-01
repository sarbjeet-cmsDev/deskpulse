import { createAxiosClient } from "@/utils/createAxiosClient";
import { ITask } from "./task.service";

const axiosClient = createAxiosClient({ withCreds: false });
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;


const AdminTaskService = {
  
  async getAllTasks(params?: {
    page?: number;
    limit?: number;
    keyword?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<{ data: ITask[]; total: number; limit:number; totalPages:number }> {
    const res = await axiosClient.get(`${API_URL}/admin/task`, { params });
    return {
      data: res.data.data,
      total: res.data.total,
      limit: res.data.limit,
      totalPages: res.data.totalPages,
    };
  },

  
  async deleteTask(id: string): Promise<void> {
    await axiosClient.delete(`${API_URL}/admin/task/${id}`);
  },
};

export default AdminTaskService;
