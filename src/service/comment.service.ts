import { CreateCommentDto, IComment, ICommentResponse, UpdateCommentDto } from '@/types/comment.interface';
import { createAxiosClient } from '@/utils/createAxiosClient';

const axiosClient = createAxiosClient({ withCreds: false });
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const CommentService = {
  async createComment(data: CreateCommentDto): Promise<IComment> {
    const response = await axiosClient.post(`${API_URL}/comments`, data);
    return response.data;
  },

  async getAllComments(): Promise<IComment[]> {
    const response = await axiosClient.get(`${API_URL}/comments`);
    return response.data;
  },

  async getCommentById(id: string): Promise<IComment> {
    const response = await axiosClient.get(`${API_URL}/comments/${id}`);
    return response.data;
  },

  async getCommentsByTask(
    taskId: string,
    page = 1,
    limit = 5,
    sortField: string = "createdAt",
    sortOrder: "asc" | "desc" = "desc"
  ): Promise<ICommentResponse> {
    const response = await axiosClient.get(`${API_URL}/comments/task/${taskId}`,
      {
        params: {
          page,
          limit,
          sortField,
          sortOrder,
        },
      }
    );
    return response.data;
  },

  async getCommentsByParent(parentId: string): Promise<IComment[]> {
    const response = await axiosClient.get(`${API_URL}/comments/parent/${parentId}`);
    return response.data;
  },

  async getCommentsByUser(userId: string): Promise<IComment[]> {
    const response = await axiosClient.get(`${API_URL}/comments/user/${userId}`);
    return response.data;
  },

  async updateComment(id: string, data: UpdateCommentDto): Promise<IComment> {
    const response = await axiosClient.patch(`${API_URL}/comments/${id}`, data);
    return response.data;
  },

  async deleteComment(id: string): Promise<IComment> {
    const response = await axiosClient.delete(`${API_URL}/comments/${id}`);
    return response.data;
  },
};

export default CommentService;
