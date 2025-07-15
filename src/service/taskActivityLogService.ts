import { createAxiosClient } from '@/utils/createAxiosClient';
import { ITaskActivityLog } from '@/types/taskactivitylog.interface';

const axiosClient = createAxiosClient({ withCreds: true });
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const TaskActivityLogService = {
  async getAll(): Promise<{
    message: string;
    taskactivitylog: ITaskActivityLog[];
  }> {
    const res = await axiosClient.get(`${API_URL}/taskactivitylog`);
    return res.data;
  },

  async getByTaskId(
    taskId: string,
    page = 1,
    limit = 5
  ): Promise<{
    taskactivitylog: ITaskActivityLog[];
    total: number;
    page: number;
    limit: number;
  }> {
    const res = await axiosClient.get(
      `${API_URL}/taskactivitylog/task-activity/${taskId}`,
      {
        params: { page, limit },
      }
    );
    return res.data;
  },

  async create(
    data: Partial<Pick<ITaskActivityLog, 'task' | 'project' | 'description'>>
  ): Promise<{
    message: string;
    taskactivitylog: ITaskActivityLog;
  }> {
    const res = await axiosClient.post(`${API_URL}/taskactivitylog`, data);
    return res.data;
  },
};

export default TaskActivityLogService;
