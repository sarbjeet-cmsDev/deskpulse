import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CreateNotificationDto } from './notification.dto';
import { NotificationService } from './notification.service';
import { TaskStatusUpdatedPayload } from 'src/taskactivitylog/taskactivitylog.interface';
import { log } from 'console';
import { template } from 'lodash';
import { UserService } from 'src/user/user.service';
import { ProjectService } from 'src/project/project.service';
import { TaskService } from 'src/task/task.service';
import { extractTextFromHtml, formatMinutes } from 'src/shared/commonhelper';

@Injectable()
export class NotificationListener {
  private readonly logger = new Logger(NotificationListener.name);

  constructor(private readonly notificationService: NotificationService
    , private readonly userservices: UserService,
    private readonly projectService: ProjectService,
    private readonly taskServices: TaskService,
  ) { }

  // When the Project Assign event is triggered
  @OnEvent('project.assigned', { async: true })
  async handleProjectAssignedEvent(payload: { projectObj: any }) {
    const { projectObj } = payload;
    const assignedUserIds = projectObj.users;
    const notifications: CreateNotificationDto[] = [];
    for (const user of assignedUserIds) {
      const UserData = await this.userservices.findOne(user.toString())
      notifications.push({
        user: user._id.toString(),
        content: `The project "${projectObj.title}" was successfully assigned by ${UserData.username} on ${new Date(projectObj.updatedAt).toLocaleString()}.`,
        redirect_url: `${process.env.FRONTEND_URL}project/${projectObj._id.toString()}`,
      })
    }
    try {
      await Promise.all(notifications.map(notification => this.notificationService.create(notification)));
      this.logger.log(`Project assignment notification created.`);
    } catch (error) {
      this.logger.error('Failed to create project assign log', error.stack);
    }
  }


  // On Task Assign 
  @OnEvent('task.assigned', { async: true })
  async handleTaskAsssignEvent(payload: { taskObj: any; }) {
    const { taskObj } = payload;
    const taskUsers = taskObj.assigned_to
    const UserData = await this.userservices.findOne(taskUsers.toString())
    const TaskAssignDto: CreateNotificationDto = {
      user: UserData.id.toString(),
      content: `Task "${taskObj.title}" was assigned to ${UserData.username} — Due by ${taskObj.due_date ? new Date(taskObj.due_date).toLocaleString() : 'No due date'}, Priority: ${taskObj.priority}, Status: ${taskObj.status}`,
      redirect_url: `${process.env.FRONTEND_URL}task/${taskObj._id.toString()}`
    }
    try {
      await this.notificationService.create(TaskAssignDto);
      this.logger.log(`Task assignment Notification created.`);
    } catch (error) {
      this.logger.error('Failed to create project assign log', error.stack);
    }
  }

  // When the Task Status Updated event is triggered
  @OnEvent('task.status.updated', { async: true })
  async handleTaskStatusUpdatedEvent(payload: { taskObj: any; oldTaskStatus: string, updatedBy: any }) {
    const taskObj = payload.taskObj;
    const oldTaskStatus = payload.oldTaskStatus;
    const ProjectObj = await this.projectService.findOne(taskObj.project.toString())
    const UserData = await this.userservices.findOne(payload.updatedBy.toString())
    const taskLink = `${process.env.FRONTEND_URL}/task/${taskObj._id.toString()}`;
    const content = `Task status was updated from "${oldTaskStatus}" to "${taskObj.status}" by ${UserData.username} on ${new Date(taskObj.updatedAt).toLocaleString()}.`;
    const notifications: CreateNotificationDto[] = [];
    if (ProjectObj.project_coordinator) {
      // PROJECT COORDINATOR
      notifications.push({
        user: ProjectObj.project_coordinator,
        content,
        redirect_url: taskLink,
      });
    }
    if (ProjectObj.team_leader) {
      // PROJECT COORDINATOR
      notifications.push({
        user: ProjectObj.team_leader,
        content,
        redirect_url: taskLink,
      });
    }

    if (ProjectObj.project_manager) {
      // PROJECT COORDINATOR
      notifications.push({
        user: ProjectObj.project_manager,
        content,
        redirect_url: taskLink,
      });
    }
    try {
      await Promise.all(notifications.map(notification => this.notificationService.create(notification)));
      this.logger.log(`task.status.updated Notification Trigger.`);
    } catch (error) {
      this.logger.error('Failed to create notifications', error.stack);
    }
  }



  @OnEvent('timeline.created', { async: true })
  async handleTimelineCreatedEvent(payload: { timeLineObj: any }) {

    const timeLineObj = payload.timeLineObj;
    const timeLineCreatedBy = await this.userservices.findOne(timeLineObj.created_by.toString());
    const TaskObj = await this.taskServices.findOne(timeLineObj.task.toString())

    const ProjectObj = await this.projectService.findOne(TaskObj.project.toString())
    const content = `Worked ${formatMinutes(timeLineObj.time_spent) } on task "${TaskObj.title}" — general updates and review. Comment: ${timeLineObj.comment}. On ${new Date(timeLineObj.date).toLocaleString()} by "${timeLineCreatedBy.username}"`;
    const timelineLInk = `${process.env.FRONTEND_URL}/task/${TaskObj._id.toString()}`;
    const timelineCreatednotifications: CreateNotificationDto[] = [];
    if (ProjectObj.project_coordinator) {
      // PROJECT COORDINATOR
      timelineCreatednotifications.push({
        user: ProjectObj.project_coordinator,
        content,
        redirect_url: timelineLInk,
      });
    }

    if (ProjectObj.team_leader) {
      // PROJECT COORDINATOR
      timelineCreatednotifications.push({
        user: ProjectObj.team_leader,
        content,
        redirect_url: timelineLInk,
      });
    }

    if (ProjectObj.project_manager) {
      // PROJECT COORDINATOR
      timelineCreatednotifications.push({
        user: ProjectObj.project_manager,
        content,
        redirect_url: timelineLInk,
      });
    }

    try {
      await Promise.all(timelineCreatednotifications.map(notification => this.notificationService.create(notification)));
      this.logger.log(`timeline.created Notification Trigger.`);
    } catch (error) {
      this.logger.error('Failed to create notifications', error.stack);
    }
  }

  @OnEvent('comments.mention', { async: true })
  async handleCommentsMentionEvent(payload: { CommentObj: any; }) {
    const CommentObj = payload.CommentObj;
    // const oldTaskStatus = payload.oldTaskStatus;
    const updatedBy = await this.userservices.findOne(CommentObj.created_by.toString());
    const TaskObj = await this.taskServices.findOne(CommentObj.task.toString())
    const commentContent = extractTextFromHtml(CommentObj.content);
    const mentionedUsers = CommentObj.mentioned
    const notificationDtoForComments: CreateNotificationDto[] = [];
    for (const user of mentionedUsers) {
      const UserData = await this.userservices.findOne(user.toString())
      notificationDtoForComments.push({
        user: user.toString(),
        content: `${UserData.username} commented "${commentContent}" — ${new Date(CommentObj.createdAt).toLocaleString()} : Created BY ${updatedBy.username}`,
        redirect_url: `${process.env.FRONTEND_URL}comment/${payload.CommentObj._id.toString()}`,
      })
    }

    try {
      await Promise.all(notificationDtoForComments.map(notification => this.notificationService.create(notification)));
      this.logger.log(`comments .mentioned  Notification Trigger.`);
    } catch (error) {
      this.logger.error('Failed to create notifications', error.stack);
    }
  }

  @OnEvent('taskchecklist.created', { async: true })
  async handleTaskCheckListCreatedEvent(payload: { taskChecklistObj: any }) {
    const taskChecklistObj = payload.taskChecklistObj;
    const timeLineCreatedBy = await this.userservices.findOne(taskChecklistObj.created_by.toString());
    const TaskObj = await this.taskServices.findOne(taskChecklistObj.task.toString())
    const ProjectObj = await this.projectService.findOne(TaskObj.project.toString())
    const content = `Checklist item "${taskChecklistObj.title}" was created for task "${TaskObj.title}" with status "${taskChecklistObj.status}". Created by "${timeLineCreatedBy.username}".`
    const timelineLInk = `${process.env.FRONTEND_URL}/task/${TaskObj._id.toString()}`;
    const taskchecklistCreatednotifications: CreateNotificationDto[] = [];
    if (ProjectObj.project_coordinator) {
      // PROJECT COORDINATOR
      taskchecklistCreatednotifications.push({
        user: ProjectObj.project_coordinator,
        content,
        redirect_url: timelineLInk,
      });
    }

    if (ProjectObj.team_leader) {
      // PROJECT Team Leader 
      taskchecklistCreatednotifications.push({
        user: ProjectObj.team_leader,
        content,
        redirect_url: timelineLInk,
      });
    }

    if (ProjectObj.project_manager) {
      // PROJECT Manager 
      taskchecklistCreatednotifications.push({
        user: ProjectObj.project_manager,
        content,
        redirect_url: timelineLInk,
      });
    }
    try {
      await Promise.all(taskchecklistCreatednotifications.map(notification => this.notificationService.create(notification)));
      this.logger.log(`task.status.updated Notification Trigger.`);
    } catch (error) {
      this.logger.error('Failed to create notifications', error.stack);
    }

  }

}

