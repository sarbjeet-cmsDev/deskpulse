import { CreateReminderDto, IReminder, UpdateReminderDto } from "@/types/reminder.interface";
import { createAxiosClient } from "@/utils/createAxiosClient";

const axiosClient = createAxiosClient({ withCreds: true });
const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/reminders`;


const ReminderService = {
 
  async createReminder(data: CreateReminderDto): Promise<{ message: string; reminder: IReminder }> {
    const res = await axiosClient.post(`${API_URL}`, data);
    return res.data;
  },

 
  async getAllReminders(): Promise<{ message: string; reminders: IReminder[] }> {
    const res = await axiosClient.get(`${API_URL}`);
    console.log("res.data---",res.data)
    return res.data;
  },

  async getReminderById(id: string): Promise<{ message: string; reminder: IReminder | null }> {
    const res = await axiosClient.get(`${API_URL}/${id}`);
    return res.data;
  },


  async updateReminder(id: string, data: UpdateReminderDto): Promise<{ message: string; reminder: IReminder | null }> {
    const res = await axiosClient.put(`${API_URL}/${id}`, data);
    return res.data;
  },
};

export default ReminderService;
