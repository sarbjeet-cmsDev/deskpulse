import { createAxiosClient } from '@/utils/createAxiosClient';
import {IUser} from '@/service/adminUser.service'

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const axiosClient = createAxiosClient({ withCreds: false });
const axiosPrivate = createAxiosClient({ withCreds: true });

const AuthService = {
  async login(payload: { email: string; password: string }) {
    const res = await axiosClient.post(`${API_URL}/auth/login`, payload);
    return res.data;
  },
  async validateToken() {
    try {
      const res = await axiosPrivate.get(`${API_URL}/user/validate-token`);
      return res.data;
    } catch (error) {
      throw new Error("Failed to validate Token");
    }
  },
  
  async create(data: {
    username: string;
    email: string;
    password: string;
  }): Promise<IUser> {
    const res = await axiosClient.post(`${API_URL}/auth/create`, data);
    return res.data;
  },

   async verifyAccount(token:string) {
    const res = await axiosClient.get(`${API_URL}/auth/verify-account/${token}`,);
    return res;
  },

  async requestResetPassword(email: string) {
    const res = await axiosClient.post(`${API_URL}/auth/request-reset-password`, { email });
    return res.data;
  },

   async passwordReset(id:string, token:string, newPassword:string) {
    const res = await axiosClient.post(`${API_URL}/auth/reset-password/${id}/${token}`,{
     newPassword
    },);
    return res;
  },

  async resendVerify(email: string) {
    const res = await axiosClient.post(`${API_URL}/auth/resend-verify`, { email });
    return res.data;
  },

  
};
export default AuthService;