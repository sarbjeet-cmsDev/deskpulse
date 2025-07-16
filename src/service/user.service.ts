import { createAxiosClient } from "@/utils/createAxiosClient";

const axiosClient = createAxiosClient({ withCreds: true });
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export type UserRole =
  | "admin"
  | "project_manager"
  | "team_member"
  | "client"
  | "employee";
export interface IUser {
  _id: string;
  username: string;
  email: string;
  phone: string;
  gender: "male" | "female" | "other";
  userRoles?: UserRole[];
  isActive?: boolean;
  profileImage?: string;
  password?: string;
  firstName?: string;
  lastName?: string;

  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  dateOfBirth?: string;

  aboutUs?: string;
  jobTitle?: string;
  department?: string;
  managerId?: string;
  joinedDate?: string;
  lastLogin?: string;
  timezone?: string;
  languagePreference?: string;
  receiveEmailNotifications?: boolean;
  data?: any;
  createdAt: string;
  updatedAt: string;
}

const UserService = {
  async getUserById(): Promise<IUser> {
    const res = await axiosClient.get(`${API_URL}/user/me`);
    return res.data;
  },

   async getAssignedUser(): Promise<IUser> {
    const res = await axiosClient.get(`${API_URL}/user/me`);
    return res.data;
  },


  async updateUser(data: Partial<IUser>): Promise<IUser> {
    const res = await axiosClient.put(`${API_URL}/user/me`, data);
    return res.data;
  },

  async uploadAvatar(file: File): Promise<IUser> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axiosClient.post(
      `${API_URL}/user/upload-avatar`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    UserService.getUserById();
    return res.data;
  },
};

export default UserService;
