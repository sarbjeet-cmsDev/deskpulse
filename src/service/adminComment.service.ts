import { createAxiosClient } from "@/utils/createAxiosClient";
import { IComment } from "@/types/comment.interface";

const axiosClient = createAxiosClient({ withCreds: false });
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;


const AdminCommentService = {
  
  async getAllComments(params?: {
    page?: number;
    limit?: number;
    keyword?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<{
    content: string; data: IComment[]; total: number; limit:number; totalPages:number 
}> {
    const res = await axiosClient.get(`${API_URL}/admin/comment`, { params });
    return {
      data: res.data.data,
      total: res.data.total,
      limit: res.data.limit,
      totalPages: res.data.totalPages,
      content:res.data.data.content,
    };
  },

  
  async deleteComment(id: string): Promise<void> {
    await axiosClient.delete(`${API_URL}/admin/comment/${id}`);
  },
};

export default AdminCommentService;
