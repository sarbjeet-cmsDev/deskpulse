import { createAxiosClient } from "@/utils/createAxiosClient";

const axiosClient = createAxiosClient({ withCreds: false });
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface IProject {
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
}

const AdminProjectService = {
  //  Get all projects (paginated, searchable)
  async getAllProjects(params?: {
    page?: number;
    limit?: number;
    keyword?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<{ data: IProject[]; total: number }> {
    const res = await axiosClient.get(`${API_URL}/admin/project`, { params });
    return {
      data: res.data.data,
      total: res.data.total,
    };
  },

  //  Get single project by ID
  async getProjectById(id: string): Promise<IProject> {
    const res = await axiosClient.get(`${API_URL}/admin/project/${id}`);
    return res.data.data;
  },

  //  Create new project
  async createProject(
    data: Omit<IProject, "_id" | "createdAt" | "updatedAt">
  ): Promise<IProject> {
    const res = await axiosClient.post(`${API_URL}/admin/project`, data);
    return res.data;
  },

  //  Update project by ID
  async updateProject(id: string, data: Partial<IProject>): Promise<IProject> {
    const res = await axiosClient.put(`${API_URL}/admin/project/${id}`, data);
    return res.data;
  },

  //  Delete project by ID
  async deleteProject(id: string): Promise<void> {
    await axiosClient.delete(`${API_URL}/admin/project/${id}`);
  },
};

export default AdminProjectService;
