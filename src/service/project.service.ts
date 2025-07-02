import { createAxiosClient } from '@/utils/createAxiosClient';
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const axiosClient = createAxiosClient({withCreds:true});

const ProjectService = {
  async getProjectByUserId() {
    try {
      const response = await axiosClient.get(`${API_URL}/projects/me` );
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch user videos');
    }
  },
  async getProjectById(projectId: string) {
    const response = await axios.get(`${API_URL}/projects/fetch/${projectId}`);
    return response.data;
  }
};

export default ProjectService;