import { createAxiosClient } from '@/utils/createAxiosClient';
import { ITaskChecklist } from '@/types/taskchecklist.interface';

const axiosClient = createAxiosClient({ withCreds: true });
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const TaskChecklistService = {
  async createChecklist(data: Partial<ITaskChecklist>): Promise<{ message: string; checklist: ITaskChecklist }> {
    const res = await axiosClient.post(`${API_URL}/taskchecklist`, data);
    return res.data;
  },

  async getAllChecklists(): Promise<{ message: string; checklists: ITaskChecklist[] }> {
    const res = await axiosClient.get(`${API_URL}/taskchecklist`);
    return res.data;
  },

  async getChecklistById(id: string): Promise<{ message: string; checklist: ITaskChecklist }> {
    const res = await axiosClient.get(`${API_URL}/taskchecklist/${id}`);
    return res.data;
  },

  async getChecklistByTaskId(taskId: string): Promise<{ message: string; checklists: ITaskChecklist[] }> {
    const res = await axiosClient.get(`${API_URL}/taskchecklist/task/${taskId}`);
    console.log("res.data in task checklist service ----", res.data)
    return res.data;
  },

  async updateChecklist(id: string, data: Partial<ITaskChecklist>): Promise<{ message: string; checklist: ITaskChecklist }> {
    const res = await axiosClient.put(`${API_URL}/taskchecklist/${id}`, data);
    return res.data;
  },

  async deleteChecklist(id: string): Promise<{ message: string }> {
    const res = await axiosClient.delete(`${API_URL}/taskchecklist/${id}`);
    return res.data;
  },
};

export default TaskChecklistService;