import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    findByUser(userId: string): Promise<import("./notification.schema").Notification[]>;
    markAsRead(id: string): Promise<import("./notification.schema").Notification>;
}
