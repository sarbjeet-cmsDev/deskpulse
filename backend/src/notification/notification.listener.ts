import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CreateNotificationDto } from './notification.dto';
import { NotificationService } from './notification.service';
import { TaskStatusUpdatedPayload } from 'src/taskactivitylog/taskactivitylog.interface';
import { log } from 'console';
import { template } from 'lodash';

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
        redirect_url: `${process.env.FRONTEND_URL}project/${payload.projectDetails._id.toString()}`,
      }));
      await Promise.all(notifications.map(notification => this.notificationService.create(notification)));
    }
    this.logger.log(`Project Assign Notification created successfully`);
  }

  // When the Task Status Updated event is triggered
  @OnEvent('task.status.updated', { async: true })
  async handleTaskStatusUpdatedEvent(payload: { taskdetails: any, oldTaskStatus: string, updatedBy: any, TaskDetailsObj: any }) {
    const taskdetails = payload.taskdetails
    const oldTaskStatus = payload.oldTaskStatus
    const updatedBy = payload.updatedBy
    const TaskDetailsObj = payload.TaskDetailsObj
    const updatedAt = new Date(taskdetails.updatedAt).toLocaleString();
    // const taskId = data.taskdata.task._id.toString();
    const taskLink = `${process.env.FRONTEND_URL}/task/${taskdetails._id.toString()}`;
    const content = `Task status was updated from "${oldTaskStatus}" to "${taskdetails.status}" by ${updatedBy.username} on ${updatedAt}.`;
    const notifications: CreateNotificationDto[] = [];
    // TEAM LEADER
    if (TaskDetailsObj.team_leader?.id) {
      notifications.push({
        user: TaskDetailsObj.team_leader.id.toString(),
        content,
        redirect_url: taskLink,
      });
    }

    // PROJECT MANAGER
    if (TaskDetailsObj.project_manager?.id) {
      notifications.push({
        user: TaskDetailsObj.project_manager.id.toString(),
        content,
        redirect_url: taskLink,
      });
    }

    // PROJECT COORDINATOR
    if (TaskDetailsObj.project_coordinator?.id) {
      notifications.push({
        user: TaskDetailsObj.project_coordinator.id.toString(),
        content,
        redirect_url: taskLink,
      });
    }
    try {
      await Promise.all(
        notifications.map((notification) =>
          this.notificationService.create(notification),
        ),
      );
      this.logger.log(`Notifications created for task status update.`);
    } catch (error) {
      this.logger.error('Failed to create notifications', error.stack);
    }
  }


  @OnEvent('task.assigned', { async: true })
  async handleTaskAssignEvent(payload: { taskdetails: any, assigntask: any }) {
    const templates = ` Task "${payload.taskdetails.title}" was assigned to ${payload.assigntask.username} — Due by ${payload.taskdetails.due_date
      ? new Date(payload.taskdetails.due_date).toLocaleString()
      : 'No due date'}, Priority: ${payload.taskdetails.priority}, Status: ${payload.taskdetails.status}`;
    const taskLink = `${process.env.FRONTEND_URL}tasks/${payload.taskdetails._id}`;
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

  @OnEvent('comments.mention', { async: true })
  async handleCommentsMentionEvent(payload: { CommentDetails: any; assignmentionsuser: any; commentContent: string }) {
    const { CommentDetails, commentContent } = payload;
    const assignmentionUser = payload.assignmentionsuser;
    if (assignmentionUser) {
      for (const user of assignmentionUser) {
        const updateProjectActivityLogDto: CreateNotificationDto = {
          user: user.id.toString(),
          content: `${user.username} commented "${commentContent}" — ${new Date(CommentDetails.createdAt).toLocaleString()}`,
          redirect_url: `${process.env.FRONTEND_URL}comments/${payload.CommentDetails._id.toString()}`,
        };
        try {
          await this.notificationService.create(updateProjectActivityLogDto);

        } catch (error) {
          this.logger.error('Failed to create project assign log', error.stack);
        }
      }
      this.logger.log(`Task Activity Log created for project assign`);
    }
  }
  @OnEvent('timeline.created', { async: true })
  async handleTimelineCreatedEvent(payload: { taskdata: any, createdTimeline: any }) {
    const templates = `Worked ${payload.createdTimeline.time_spent} hour(s) on task "${payload.taskdata.task.title}" — general updates and review. Comment: ${payload.createdTimeline.comment}. On ${new Date(payload.createdTimeline.date).toLocaleString()} by "${payload.taskdata.userData.username}"`;
    const timelineLInk = `${process.env.FRONTEND_URL}/task/${payload.createdTimeline._id.toString()}`;
    const notifications: CreateNotificationDto[] = [
      { user: payload.taskdata.project.team_leader.toString(), content: templates, redirect_url: timelineLInk },
      { user: payload.taskdata.project.project_manager.toString(), content: templates, redirect_url: timelineLInk },
      { user: payload.taskdata.project.project_coordinator.toString(), content: templates, redirect_url: timelineLInk },
    ];
    try {
      await Promise.all(notifications.map(notification => this.notificationService.create(notification)));
      this.logger.log(`Event For timeline.created Notification`);
    } catch (error) {
      this.logger.error('Failed to create notification', error.stack);
    }
  }
}

