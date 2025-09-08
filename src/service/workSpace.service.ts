import { createAxiosClient } from "@/utils/createAxiosClient";

const axiosClient = createAxiosClient({ withCreds: true });
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface IWorkSpace {
    title: String,
    page: Number
    id?: string
}


export const WorkSpaceService = {
    async createWorkSpace(params?: {
        title: string;
    }): Promise<{ data: IWorkSpace[]; }> {
        const res = await axiosClient.post(`${API_URL}/workspace`, params);
        return {
            data: res.data.data,
        };
    },

    async getWorkSpaceByUserdID(id: string): Promise<{ data: IWorkSpace[]; }> {
        const res = await axiosClient.get(`${API_URL}/workspace/user/${id}`);
        return {
            data: res.data?.workspaces,
        };
    },

    async deleteWorkSpace(id: string): Promise<{ data: IWorkSpace[]; }> {
        const res = await axiosClient.delete(`${API_URL}/workspace/${id}`);
        return {
            data: res.data?.workspaces,
        };
    },

    async updateWorkSpace(id: string, params?: {
        title: string;

    }): Promise<{ data: IWorkSpace[]; }> {
        const res = await axiosClient.put(`${API_URL}/workspace/${id}`, params);
        return {
            data: res.data?.workspaces,
        };
    },
    async getWorkSpaceByID(id: string,): Promise<{ data: IWorkSpace[]; }> {
        const res = await axiosClient.get(`${API_URL}/workspace/${id}`);
        return {
            data: res.data,
        };
    },

    async shareWorkSpace(id: string, params?: {
        email: string;
        userRole: string
    }): Promise<{ data: IWorkSpace[]; }> {
        const res = await axiosClient.post(`${API_URL}/workspace/invite-member/${id}`, params);
        return {
            data: res.data,
        };
    },

    async acceptInvite(
        workspaceId: string,
        dto: { email: string; workspaceId: string, role?: string }
    ): Promise<{ message: string }> {
        const res = await axiosClient.post(
            `${API_URL}/workspace/accept-invite/${workspaceId}`,
            dto
        );

        return res.data;
    }


}