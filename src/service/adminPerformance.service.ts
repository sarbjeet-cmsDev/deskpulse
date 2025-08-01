import { createAxiosClient } from '@/utils/createAxiosClient';

const axiosClient = createAxiosClient({ withCreds: true });
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface IUserPerformance {
  userId: string;
  name: string;
  performance: {
    completed: number;
    pending: number;
    inProgress: number;
    total: number;
  };
}


const AdminPerformanceService = {
 async getAllUsersPerformance(params?: {
    userId?: string;
    start?: string;
    end?: string;
  }): Promise<IUserPerformance[]> {
    const res = await axiosClient.get(`${API_URL}/admin/performance/users-performance`, { params });
    return res.data;
  },
}

export default AdminPerformanceService;