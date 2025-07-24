import { createAxiosClient } from '@/utils/createAxiosClient';

const axiosClient = createAxiosClient({ withCreds: true });
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;


const PerformanceService = {
async getPerformanceByUser(): Promise<any> {
  const res = await axiosClient.get(`${API_URL}/performance/task`);
  console.log("res.data",res.data)
  return res.data;
},
}

export default PerformanceService;