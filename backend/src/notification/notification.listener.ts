import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CreateNotificationDto } from './notification.dto';
import { NotificationService } from './notification.service';
import { TaskStatusUpdatedPayload } from 'src/taskactivitylog/taskactivitylog.interface';
import { log } from 'console';

@Injectable()
export class NotificationListener {
  private readonly logger = new Logger(NotificationListener.name);

  constructor(private readonly notificationService: NotificationService) { }

  // When the PRoject Assign event is triggered
  @OnEvent('project.assigned', { async: true })
  async handleProjectUpdatedEvent(payload: { projectDetails: any; assignproject: any; }) {
    const { projectDetails } = payload;
    const assignproject = payload.assignproject;
    if (assignproject) {
      const notifications = assignproject.map(user => ({
        user: user.id.toString(),
        content: `The project "${projectDetails.title}" was successfully assigned by ${user.username} on ${new Date(projectDetails.updatedAt).toLocaleString()}.`,
        redirect_url: `${process.env.FRONTEND_URL}projects/${payload.projectDetails._id.toString()}`,
      }));
      await Promise.all(notifications.map(notification => this.notificationService.create(notification)));
    }
    this.logger.log(`Project Assign Notification created successfully`);
  }

// When the Task Status Updated event is triggered
  @OnEvent('task.status.updated', { async: true })
  async handleTaskStatusUpdatedEvent({ taskDetails, userDetails, projectObj, oldTaskStatus, newTaskStatus }: TaskStatusUpdatedPayload) {
    const { id } = taskDetails;
    const templates = `Task status was updated from "${oldTaskStatus}" to "${newTaskStatus}" by ${userDetails?.username || 'Unknown User'} on ${new Date(taskDetails?.updatedAt).toLocaleString()}.`;
    const taskLink = `${process.env.FRONTEND_URL}/tasks/${id.toString()}`;
    const notifications: CreateNotificationDto[] = [
      { user: projectObj.teamLeader.id.toString(), content: templates, redirect_url: taskLink },
      { user: projectObj.projectCoordinator.id.toString(), content: templates, redirect_url: taskLink },
      { user: projectObj.projectManager.id.toString(), content: templates, redirect_url: taskLink },
    ];
    try {
      await Promise.all(notifications.map(notification => this.notificationService.create(notification)));
      this.logger.log(`Notification created for the teamLeaderNotification `);
    } catch (error) {
      this.logger.error('Failed to create notification', error.stack);
    }
  }

    @OnEvent('task.assigned', { async: true })
  async handleTimelineCreatedEvent(payload: { taskdetails: any, assigntask: any }) {
    const templates = ` Task "${payload.taskdetails.title}" was assigned to ${payload.assigntask.username} — Due by ${new Date(payload.taskdetails.due_date).toLocaleString()}, Priority: ${payload.taskdetails.priority}, Status: ${payload.taskdetails.status}`;
    const taskLink = `${process.env.FRONTEND_URL}tasks/${payload.taskdetails._id.toString()}`;
    const assigntask = payload.assigntask;
    const notifications: CreateNotificationDto[] = [
      { user: assigntask.id.toString(), content: templates, redirect_url: taskLink },
    ]
    try {
      await Promise.all(notifications.map(notification => this.notificationService.create(notification)));
      this.logger.log(`Notification created for the teamLeaderNotification `);
    } catch (error) {
      this.logger.error('Failed to create notification', error.stack);
    }
  }
  
}

