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
};
