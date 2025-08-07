import { createAxiosClient } from "@/utils/createAxiosClient";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const axiosClient = createAxiosClient({ withCreds: true });
export const ProjectKanbon = {
  async getProjectKanbonList(projectId: string) {
    try {
      const response = await axiosClient.get(
        `${API_URL}/project-kanban/${projectId}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch user videos");
    }
  },

  async createKanbanList(data: any) {
    try {
      const response = await axiosClient.post(
        `${API_URL}/project-kanban`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error("Error creating Kanban list:", error);
      throw new Error(
        error?.response?.data?.message || "Failed to create Kanban list"
      );
    }
  },

  async updateKanbanList(data: any, id: any) {
    try {
      const response = await axiosClient.patch(
        `${API_URL}/project-kanban/${id}`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error("Error creating Kanban list:", error);
      throw new Error(
        error?.response?.data?.message || "Failed to create Kanban list"
      );
    }
  },

  async deleteKanbanList(id: any) {
    try {
      const response = await axiosClient.delete(
        `${API_URL}/project-kanban/${id}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Failed to create Kanban list"
      );
    }
  },

  // async UpdateKanbanList(data: any, id: string) {
  //   const res = await axiosClient.patch(`/api/project-kanban/${id}`, data);
  //   return res.data;
  // },
};
