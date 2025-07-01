import { createAxiosClient } from '@/utils/createAxiosClient';
// import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const axiosClient = createAxiosClient({withCreds:false});
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
};

export default AuthService;