import { createAxiosClient } from '@/utils/createAxiosClient';

const axiosClient = createAxiosClient({ withCreds: false });
const axiosPrivateClient = createAxiosClient({ withCreds: true });
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface ITask {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  project: string;   
  report_to: string;
  assigned_to: string;   
  
  // Add more fields as needed
}

export interface CreateTaskDto {
  title: string;
  project: string;   
  report_to: string; 
  assigned_to: string;   
}

export interface ITaskResponse {
  data: ITask[];
  total: number;
  page: number;
  limit: number;
}

export interface UpdateTaskDto {
  title?: string;
}

const TaskService = {
  // Create a new task
  async createTask(data: CreateTaskDto): Promise<ITask> {
    const res = await axiosClient.post(`${API_URL}/tasks`, data);
    return res.data.data;
  },

  // Get all tasks
  async getAllTasks(): Promise<ITask[]> {
    const res = await axiosClient.get(`${API_URL}/tasks`);
    return res.data;
  },

  // Get a task by ID
  async getTaskById(id: string): Promise<ITask> {
    const res = await axiosClient.get(`${API_URL}/tasks/fetch/${id}`);
    return res.data;
  },

  // Get tasks by project ID
  async getTasksByProject(
    projectId: string,
    page = 1,
    limit = 5,
    sortField: string = "createdAt",
    sortOrder: "asc" | "desc" = "desc"
  ): Promise<ITaskResponse> {
    const res = await axiosClient.get(`${API_URL}/tasks/project/${projectId}`,
      {
        params: {
          page,
          limit,
          sortField,
          sortOrder,
        },
      }
    );
    return res.data;
  },

  // Get tasks assigned to a user
  async getTasksByAssignedUser(userId: string): Promise<ITask[]> {
    const res = await axiosClient.get(`${API_URL}/tasks/assigned/${userId}`);
    return res.data;
  },

  // Get tasks where a user is report-to
  async getTasksByReportToUser(userId: string): Promise<ITask[]> {
    const res = await axiosClient.get(`${API_URL}/tasks/report-to/${userId}`);
    return res.data;
  },

  // Update task by ID
  async updateTask(id: string, data: UpdateTaskDto): Promise<ITask> {
    const res = await axiosClient.patch(`${API_URL}/tasks/${id}`, data);
    return res.data;
  },

  // Delete task by ID
  async deleteTask(id: string): Promise<ITask> {
    const res = await axiosClient.delete(`${API_URL}/tasks/${id}`);
    return res.data;
  },

  // Get logged-in user's tasks (JWT protected)
  async getMyTasks(page = 1, limit = 5): Promise<ITaskResponse> {
    const res = await axiosPrivateClient.get(`${API_URL}/tasks/me?page=${page}&limit=${limit}`);
    return res.data;
  },
};

export default TaskService;
