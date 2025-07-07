import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './notification.dto';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    create(createNotificationDto: CreateNotificationDto): Promise<{
        message: string;
        notification: import("./notification.schema").Notification;
    }>;
    findByUser(userId: string): Promise<{
        message: string;
        notifications: import("./notification.schema").Notification[];
    }>;
    markAsRead(id: string): Promise<import("./notification.schema").Notification>;
}
