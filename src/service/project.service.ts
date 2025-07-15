import { IProject, IProjectResponse } from '@/types/project.interface';
import { createAxiosClient } from '@/utils/createAxiosClient';
import axios from 'axios'
import { log } from 'console';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const axiosClient = createAxiosClient({withCreds:true});

const ProjectService = {
  async getProjectByUserId(page = 1, limit = 4): Promise<IProjectResponse>  {
    try {
      const response = await axiosClient.get(`${API_URL}/projects/me?page=${page}&limit=${limit}` );
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch user videos');
    }
  },
  async getProjectById(projectId: string) {
    const response = await axiosClient.get(`${API_URL}/projects/fetch/${projectId}`);
    return response.data;
  },

  async updateProject(id: string, data: Partial<IProject>): Promise<IProject> {
      const res = await axiosClient.put(`${API_URL}/projects/${id}`, data);
      return res.data;
    },
};

export default ProjectService;