import {
  CreateReminderDto,
  IReminder,
  IReminderResponse,
  UpdateReminderDto,
} from "@/types/reminder.interface";
import { createAxiosClient } from "@/utils/createAxiosClient";

const axiosClient = createAxiosClient({ withCreds: true });
const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/reminders`;

const ReminderService = {
  async createReminder(
    data: CreateReminderDto
  ): Promise<{ message: string; reminder: IReminder }> {
    const res = await axiosClient.post(`${API_URL}`, data);
    return res.data;
  },

  async getAllReminders(
    page = 1,
    limit = 5,
    sortField: string = "createdAt",
    sortOrder: "asc" | "desc" = "desc"
  ): Promise<{ message: string; reminders: any; total: any; page: any }> {
    const res = await axiosClient.get(`${API_URL}`, {
      params: {
        page,
        limit,
        sortField,
        sortOrder,
      },
    });
    console.log("res.data 22222---", res.data);
    return res.data;
  },

  async getReminderById(
    id: string,
    page = 1,
    limit = 5,
    sortField: string = "createdAt",
    sortOrder: "asc" | "desc" = "desc"
  ): Promise<{
    message: string;
    reminder: IReminder | null;
    reminders?: any;
    total: any;
  }> {
    const res = await axiosClient.get(`${API_URL}/user/${id}`, {
      params: {
        page,
        limit,
        sortField,
        sortOrder,
      },
    });
    return res.data;
  },

  async getActiveReminderById(
    id: string,
    page = 1,
    limit = 5,
    sortField: string = "createdAt",
    sortOrder: "asc" | "desc" = "desc"
  ): Promise<{
    message: string;
    reminder: IReminder | null;
    reminders?: any;
    total: any;
  }> {
    const res = await axiosClient.get(`${API_URL}/active/${id}`, {
      params: {
        page,
        limit,
        sortField,
        sortOrder,
      },
    });
    return res.data;
  },


  async updateReminder(
    id: string,
    data: UpdateReminderDto
  ): Promise<{ message: string; reminder: IReminder | null }> {
    const res = await axiosClient.put(`${API_URL}/${id}`, data);
    return res.data;
  },
};

export default ReminderService;
