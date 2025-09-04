import { createAxiosClient } from "@/utils/createAxiosClient";

const axiosClient = createAxiosClient({ withCreds: true });
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface IProject {
  description: string;
  deploy_instruction?: string;
  critical_notes?: string;
  _id?: string;
  code?: string;
  users: string[];
  notes?: string;
  creds?: string;
  additional_information?: string;
  url_dev?: string;
  url_live?: string;
  url_staging?: string;
  url_uat?: string;
  is_active?: true;
  sort_order?: number;
  createdAt?: string;
  updatedAt?: string;
  project?: any;
  data?: any;
  formData?: any;
}

const AdminProjectService = {
  async getAllProjects(params?: {
    page?: number;
    limit?: number;
    keyword?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<{ data: IProject[]; total: number; limit: number; totalPages: number }> {
    const res = await axiosClient.get(`${API_URL}/admin/project`, { params });
    return {
      data: res.data.data,
      total: res.data.total,
      limit: res.data.limit,
      totalPages: res.data.totalPages,
    };
  },

  async getAllProjectListing(): Promise<{ data: IProject[]; total: number }> {
    const res = await axiosClient.get(`${API_URL}/admin/project/allProject`);
    return {
      data: res.data.data,
      total: res.data.total,
    };
  },
  async getProjectById(id: string): Promise<IProject> {
    const res = await axiosClient.get(`${API_URL}/admin/project/${id}`);
    return res.data.data;
  },
  async getProjectByCode(code: string): Promise<IProject> {
    const res = await axiosClient.get(`${API_URL}/admin/project/code/${code}`);
    return res.data.data;
  },
  async createProject(
    data: Omit<IProject, "_id" | "createdAt" | "updatedAt">
  ): Promise<IProject> {
    const res = await axiosClient.post(`${API_URL}/admin/project`, data);
    return res.data;
  },
  async updateProject(id: string, data: Partial<IProject>): Promise<IProject> {
    const res = await axiosClient.put(`${API_URL}/admin/project/${id}`, data);
    return res.data;
  },
  async deleteProject(id: string): Promise<void> {
    await axiosClient.delete(`${API_URL}/admin/project/${id}`);
  },
};

export default AdminProjectService;
