import { createAxiosClient } from '@/utils/createAxiosClient';

const axiosClient = createAxiosClient({ withCreds: true });
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;


const PerformanceService = {
async getPerformanceByUser(params?: { start?: string; end?: string }): Promise<any> {
  const res = await axiosClient.get(`${API_URL}/performance/task`, {
      params,
    }

  );
  console.log("res.data",res.data)
  return res.data;
},
}

export default PerformanceService;