import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './notification.schema';
import { CreateNotificationDto } from './notification.dto';
import { UpdateNotificationDto } from './notification.dto';
import { INotification } from "./notification.interface";

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,


  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const createdNotification = new this.notificationModel(createNotificationDto);
    return createdNotification.save();
  }

 async findAll(
      page: number,
     limit: number,
     keyword?: string,
     sortOrder: "asc" | "desc" = "asc"
   ): Promise<{data: INotification[]; total: number; page: number; limit: number;totalPages: number;}> {
      let safePage = Math.max(Number(page) || 1, 1);
     let safeLimit = Math.max(Number(limit) || 10, 1);
     const MAX_LIMIT = 1000;
     if (safeLimit > MAX_LIMIT) safeLimit = MAX_LIMIT;
 
  
     const filter: Record<string, any> = {};
     if (keyword && keyword.trim()) {
       filter.$or = [
         { content: { $regex: keyword.trim(), $options: 'i' } },
        //  { code: { $regex: keyword.trim(), $options: 'i' } },
       ];
     }
 
 
     const total = await this.notificationModel.countDocuments(filter).exec();
     const totalPages = total === 0 ? 0 : Math.ceil(total / safeLimit);
 
 
     if (totalPages > 0 && safePage > totalPages) {
       safePage = totalPages;
     }
 
     const skip = (safePage - 1) * safeLimit;
 
      const data = await this.notificationModel
       .find(filter)
       .sort({ createdAt: sortOrder === 'desc' ? 1 : -1 })
       .skip(skip)
       .limit(safeLimit)
       .lean()
       .exec();
 
     
     return {
       data: data as unknown as INotification[],
       total,
       page: safePage,
       limit: safeLimit,
       totalPages,
     };
   }

  async findOne(id: string): Promise<Notification> {
    return this.notificationModel.findById(id).exec();
  }

  async findByUser(userId: string): Promise<Notification[]> {
    return this.notificationModel.find({
      user: userId,
      is_read: false, 
    }).sort({ createdAt: -1 }).exec();
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    return this.notificationModel
      .findByIdAndUpdate(id, updateNotificationDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Notification> {
    return this.notificationModel.findByIdAndDelete(id).exec();
  }
}
