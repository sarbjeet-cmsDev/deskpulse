import { createAxiosClient } from "@/utils/createAxiosClient";

const axiosClient = createAxiosClient({ withCreds: false });
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export type UserRole =
  | "admin"
  | "project_manager"
  | "team_member"
  | "client"
  | "employee";

export interface IUser {
  userRoles?: UserRole[];
  gender: string;
  phone: string;
  _id: string;
  username: string;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  roles?: any;
  data?: any;
  profileImage?: any;
  id?: string;
  payload?: any;
}

const AdminUserService = {
  //  Get all users with pagination, search, and sort
  async getAllUsers(params?: {
    page?: number;
    limit?: number;
    keyword?: string;
    sortField?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<{ data?: IUser[]; total?: number }> {
    const res = await axiosClient.get(`${API_URL}/admin/user`, { params });

    return {
      data: res.data.data,
      total: res.data.total,
    };
  },

  //  Get user by ID
  async getUserById(id: string): Promise<IUser> {
    const res = await axiosClient.get(`${API_URL}/admin/user/view/${id}`);
    return res.data.data;
  },
  async searchUsers(keyword?: string): Promise<IUser[]> {
    const res = await axiosClient.get(`${API_URL}/admin/user/search`, {
      params: { keyword },
    });
    return res.data ?? [];
  },
  //  Create user
  async createUser(data: {
    username: string;
    email: string;
    password: string;
  }): Promise<IUser> {
    const res = await axiosClient.post(`${API_URL}/admin/user/create`, data);
    return res.data;
  },

  //  Update user by ID
  async updateUser(id: string, data: Partial<IUser>): Promise<IUser> {
    const res = await axiosClient.put(`${API_URL}/admin/user/${id}`, data);
    return res.data;
  },

  //  Delete user by ID
  async deleteUser(id: string): Promise<void> {
    await axiosClient.delete(`${API_URL}/admin/user/${id}`);
  },

  //  Reset password by admin
  async resetPassword(id: string, newPassword: string): Promise<IUser> {
    const res = await axiosClient.put(
      `${API_URL}/admin/user/${id}/reset-password`,
      {
        newPassword,
      }
    );
    return res.data;
  },

  //  Get logged-in user profile
  async getCurrentUser(): Promise<IUser> {
    const res = await axiosClient.get(`${API_URL}/admin/user/me`);
    return res.data;
  },

  //  Update logged-in user's own profile
  async updateCurrentUser(data: Partial<IUser>): Promise<IUser> {
    const res = await axiosClient.put(`${API_URL}/admin/user/me`, data);
    return res.data;
  },
};

export default AdminUserService;
