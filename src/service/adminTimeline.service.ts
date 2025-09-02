import { createAxiosClient } from "@/utils/createAxiosClient";
import { ITask } from "./task.service";
import { ITimelineResponse } from "./timeline.service";

const axiosClient = createAxiosClient({ withCreds: true });
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;


const AdminTimelineService = {
  async getAllTimelineDetails(params?: {
    page?: number,
    limit?: number,
    keyword?: string,
    sortOrder?: "asc" | "desc",
    start?: string,
    end?: string,
    projectId?: string;
  }): Promise<{ data: ITask[]; total: number; limit: number; totalPages: number, totalTimeSpent: number }> {
    const res = await axiosClient.get(`${API_URL}/admin/timelines`, { params });
    return {
      data: res.data.data,
      total: res.data.total,
      limit: res.data.limit,
      totalPages: res.data.totalPages,
      totalTimeSpent: res.data.totalTimeSpent,
    };
  },

  async getTimelineByUserId(userIds: string, params?: { start?: string; end?: string, page?: number, projectId?: string, limit?: number, sortOrder?: "asc" | "desc", }): Promise<ITimelineResponse> {
    const res = await axiosClient.get(`${API_URL}/admin/timelines/user`, {
      params: { userIds, ...params },
    });
    return res.data;
  },

}
export default AdminTimelineService;
;