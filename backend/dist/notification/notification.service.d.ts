import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './notification.schema';
import { CreateNotificationDto } from './notification.dto';
import { UpdateNotificationDto } from './notification.dto';
export declare class NotificationService {
    private notificationModel;
    constructor(notificationModel: Model<NotificationDocument>);
    create(createNotificationDto: CreateNotificationDto): Promise<Notification>;
    findAll(): Promise<Notification[]>;
    findOne(id: string): Promise<Notification>;
    findByUser(userId: string): Promise<Notification[]>;
    update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification>;
    remove(id: string): Promise<Notification>;
}
