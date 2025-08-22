import { createAxiosClient } from "@/utils/createAxiosClient";

const axiosClient = createAxiosClient({ withCreds: true });
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface ITimeline {
  _id: string;
  task: {
    _id: string;
    title: string;
  };
  user: string;
  date: string;
  time_spent: string;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateTimeline {
  task: string;
  user: string;
  date: string;
  time_spent: string;
  comment?: string;
  is_active?: boolean;
}

export interface ITimelineResponse {
  data: ITimeline[];
  total: number;
  page: number;
  limit: number;
}

const TimelineService = {
  async createTimeline(payload: ICreateTimeline): Promise<ITimeline> {
    const response = await axiosClient.post(`${API_URL}/timelines`, payload);
    return response.data;
  },

  async getAllTimelines(params?: {
    task?: string;
    user?: string;
    is_active?: boolean;
  }): Promise<ITimeline[]> {
    const response = await axiosClient.get(`${API_URL}/timelines`, { params });
    return response.data;
  },

  async getTimelineById(id: string): Promise<ITimeline> {
    const response = await axiosClient.get(`${API_URL}/timelines/${id}`);
    return response.data;
  },

  async updateTimeline(
    id: string,
    payload: ICreateTimeline
  ): Promise<ITimeline> {
    const response = await axiosClient.patch(
      `${API_URL}/timelines/${id}`,
      payload
    );
    return response.data;
  },

  async deleteTimeline(id: string): Promise<ITimeline> {
    const response = await axiosClient.delete(`${API_URL}/timelines/${id}`);
    return response.data;
  },

  async getTimelinesByTask(
    taskId: string,
    page = 1,
    limit = 5,
    sortField: string = "createdAt",
    sortOrder: "asc" | "desc" = "desc"
  ): Promise<ITimelineResponse> {
    const response = await axiosClient.get(
      `${API_URL}/timelines/task/${taskId}`,
      {
        params: {
          page,
          limit,
          sortField,
          sortOrder,
        },
      }
    );

    return response.data;
  },

  async getTimelinesByUser(userId: string): Promise<ITimeline[]> {
    const response = await axiosClient.get(
      `${API_URL}/timelines/user/${userId}`
    );
    return response.data;
  },

  async getTimeLineList(
    userId: string,
    page: number = 1,
    limit: number = 10,
    startDate?: string,
    endDate?: string
  ): Promise<ITimelineResponse> {
   
    const response = await axiosClient.get(
      `${API_URL}/timelines/user/timeline/${userId}`,
      {
        params: {
          page,
          limit,
          startDate,
          endDate,
        },
      }
    );

    return response.data;
  },

  async getTimelinesByProject(
    projectId: string,
    from?: string,
    to?: string
  ): Promise<ITimeline[]> {
    const response = await axiosClient.get(
      `${API_URL}/timelines/project/${projectId}`,
      {
        params: { from, to },
      }
    );
    return response.data;
  },
};

export default TimelineService;
