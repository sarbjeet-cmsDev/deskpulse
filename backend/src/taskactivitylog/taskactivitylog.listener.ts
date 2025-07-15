import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TaskactivitylogService } from './taskactivitylog.service';
import { CreateTaskActivityLogDto } from './taskactivitylog.dto';
import { log } from 'console';
import { UserService } from 'src/user/user.service';
import { TaskService } from 'src/task/task.service';
import { extractTextFromHtml } from 'src/shared/commonhelper';

@Injectable()
export class TaskActivityLogListener {
  private readonly logger = new Logger(TaskActivityLogListener.name);

  constructor(
    private readonly taskactivitylogService: TaskactivitylogService,
    private readonly userservices: UserService,
    private readonly taskServices: TaskService,
  ) {
    this.logger.log('Listener initialized');
  }
  // On Project Assign 
  @OnEvent('project.assigned', { async: true })
  async handleProjectUpdatedEvent(payload: { projectObj: any; }) {
    const { projectObj } = payload;
    const projectUsers = projectObj.users
    const updateProjectActivityLogDto: CreateTaskActivityLogDto[] = [];
    for (const user of projectUsers) {
      const UserData = await this.userservices.findOne(user.toString())
      updateProjectActivityLogDto.push({
        project: projectObj._id,
        description: `The project "${projectObj.title}" was successfully assigned by ${UserData.username} on ${new Date(projectObj.createdAt).toLocaleString()}.`
      })
    }
    try {
      await Promise.all(
        updateProjectActivityLogDto.map((updateProjectActivity) =>
          this.taskactivitylogService.create(updateProjectActivity),
        ),
      );
      this.logger.log(`Project assignment logs created.`);
    } catch (error) {
      this.logger.error('Failed to create project assign log', error.stack);
    }
  }

  @OnEvent('task.created', { async: true })
  async handleTaskCreatedEvent(payload: { taskObj: any; }) {
    const { taskObj } = payload;
    const taskUsers = taskObj.assigned_to
    const UserData = await this.userservices.findOne(taskUsers.toString())
    const TaskAssignDto: CreateTaskActivityLogDto = {
      project: taskObj.project._id.toString(),
      task: taskObj._id.toString(),
      description: `Task "${taskObj.title}" has been created and assigned to ${UserData.username}. Due: ${taskObj.due_date ? new Date(taskObj.due_date).toLocaleString() : 'No due date'}, Priority: ${taskObj.priority}, Status: ${taskObj.status}.`,
    }
    try {
      await this.taskactivitylogService.create(TaskAssignDto);
      this.logger.log(`Task  Created logs created.`);
    } catch (error) {
      this.logger.error('Failed to create task status update log', error.stack);
    }
  }

  // On Task Assign 
  @OnEvent('task.assigned', { async: true })
  async handleTaskAsssignEvent(payload: { taskObj: any; }) {
    const { taskObj } = payload;
    const taskUsers = taskObj.assigned_to
    const UserData = await this.userservices.findOne(taskUsers.toString())
    const TaskAssignDto: CreateTaskActivityLogDto = {
      project: taskObj.project._id.toString(),
      task: taskObj._id.toString(),
      description: ` Task "${taskObj.title}" was assigned to ${UserData.username} — Due by ${taskObj.due_date ? new Date(taskObj.due_date).toLocaleString() : 'No due date'}, Priority: ${taskObj.priority}, Status: ${taskObj.status}`,
    }
    try {
      await this.taskactivitylogService.create(TaskAssignDto);
      this.logger.log(`Task  assignment logs created.`);
    } catch (error) {
      this.logger.error('Failed to create task status update log', error.stack);
    }
  }
  @OnEvent('task.status.updated', { async: true })
  async handleTaskStatusUpdatedEvent(payload: { taskObj: any; oldTaskStatus: string, updatedBy: any }) {
    const taskObj = payload.taskObj;
    const oldTaskStatus = payload.oldTaskStatus;
    const updatedBy = await this.userservices.findOne(payload.updatedBy.toString());
    const updateTaskActivityLogDto: CreateTaskActivityLogDto = {
      project: taskObj.project._id.toString(),
      task: taskObj._id.toString(),
      description: `Task status was updated from "${oldTaskStatus}" to "${taskObj.status}" by ${updatedBy.username} on ${new Date(taskObj.updatedAt).toLocaleString()}.`,
    };
    try {
      await this.taskactivitylogService.create(updateTaskActivityLogDto);
      this.logger.log(`Task Status Update  assignment logs created.`);
    } catch (error) {
      this.logger.error('Failed to create task status update log', error.stack);
    }
  }


  @OnEvent('timeline.created', { async: true })
  async handleTimelineCreatedEvent(payload: { timeLineObj: any }) {

    const timeLineObj = payload.timeLineObj;
    const timeLineCreatedBy = await this.userservices.findOne(timeLineObj.created_by.toString());
    const TaskObj = await this.taskServices.findOne(timeLineObj.task.toString())
    const updateTaskActivityLogDto: CreateTaskActivityLogDto = {
      task: timeLineObj._id.toString(),
      project: TaskObj.project.toString(),
      description: `Worked ${timeLineObj.time_spent} hour(s) on task "${TaskObj.title}" — general updates and review. Comment: ${timeLineObj.comment}. On ${new Date(timeLineObj.date).toLocaleString()} by "${timeLineCreatedBy.username}"`,
    };
    try {
      await this.taskactivitylogService.create(updateTaskActivityLogDto);
      this.logger.log(`timeline.created  assignment logs created.`);
    } catch (error) {
      this.logger.error('Failed to create timeline.created log', error.stack);
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
    const commentsMentionedLogDto: CreateTaskActivityLogDto[] = [];
    for (const user of mentionedUsers) {
      const UserData = await this.userservices.findOne(user.toString())
      commentsMentionedLogDto.push({
        task: CommentObj.task.toString(),
        project: TaskObj.project.toString(),
        description: `${UserData.username} commented "${commentContent}" — ${new Date(CommentObj.createdAt).toLocaleString()} : Created BY ${updatedBy.username}`,
      })
    }
    try {
      await Promise.all(
        commentsMentionedLogDto.map((commentsMentioned) =>
          this.taskactivitylogService.create(commentsMentioned),
        ),
      );
      this.logger.log(`Project assignment logs created.`);
    } catch (error) {
      this.logger.error('Failed to create project assign log', error.stack);
    }

  }

}

