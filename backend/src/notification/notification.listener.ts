import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CreateNotificationDto } from './notification.dto';
import { NotificationService } from './notification.service';
import { TaskStatusUpdatedPayload } from 'src/taskactivitylog/taskactivitylog.interface';

@Injectable()
export class NotificationListener {
  private readonly logger = new Logger(NotificationListener.name);

  constructor(private readonly notificationService: NotificationService) { }

  @OnEvent('task.status.updated', { async: true })
  async handleTaskStatusUpdatedEvent({ taskDetails, userDetails, projectObj }: TaskStatusUpdatedPayload) {
    const { id } = taskDetails;
    const templates = `Task status was updated from "${taskDetails.oldTaskStatus}" to "${taskDetails.newTaskStatus}" by ${userDetails?.username || 'Unknown User'} on ${new Date(taskDetails?.updatedAt).toLocaleString()}.`;
    const taskLink = `${process.env.FRONTEND_URL}/tasks/${id.toString()}`;

    const notifications: CreateNotificationDto[] = [
      { user: projectObj.teamLeader.toString(), content: templates, redirect_url: taskLink },
      { user: projectObj.projectCoordinator.toString(), content: templates, redirect_url: taskLink },
      { user: projectObj.projectManager.toString(), content: templates, redirect_url: taskLink },
    ];

    try {
      await Promise.all(notifications.map(notification => this.notificationService.create(notification)));
      this.logger.log(`Notification created for the teamLeaderNotification `);
    } catch (error) {
      this.logger.error('Failed to create notification', error.stack);
    }
  }
}

