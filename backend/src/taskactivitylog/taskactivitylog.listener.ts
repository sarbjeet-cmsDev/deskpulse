import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TaskactivitylogService } from './taskactivitylog.service';
import { CreateTaskActivityLogDto } from './taskactivitylog.dto';
import { log } from 'console';
import { TaskStatusUpdatedPayload } from './taskactivitylog.interface';

@Injectable()
export class TaskActivityLogListener {
  private readonly logger = new Logger(TaskActivityLogListener.name);

  constructor(private readonly taskactivitylogService: TaskactivitylogService) {
    this.logger.log('Listener initialized');
  }
  @OnEvent('project.assigned', { async: true })
  async handleProjectUpdatedEvent(payload: { projectDetails: any; assignproject: any; }) {
    const { projectDetails } = payload;
    const assignproject = payload.assignproject;
    if (assignproject) {
      for (const user of assignproject) {
        const updateProjectActivityLogDto: CreateTaskActivityLogDto = {
          project: projectDetails._id,
          description: `The project "${projectDetails.title}" was successfully assigned by ${user.username} on ${new Date(projectDetails.updatedAt).toLocaleString()}.`,
        };
        try {
          await this.taskactivitylogService.create(updateProjectActivityLogDto);

        } catch (error) {
          this.logger.error('Failed to create project assign log', error.stack);
        }
      }
      this.logger.log(`Task Activity Log created for project assign`);
    }
  }

  @OnEvent('task.status.updated', { async: true })
  async handleTaskStatusUpdatedEvent(payload: { new_data: any }) {
    // log(payload.new_data[0]);    
    const updateTaskActivityLogDto: CreateTaskActivityLogDto = {
      project: payload.new_data[0].taskdata.project._id.toString(),
      task: payload.new_data[0].taskdata.task._id.toString(),
      description: `Task status was updated from "${payload.new_data[0].oldTaskStatus}" to "${payload.new_data[0].updateTaskStatus}" by ${payload.new_data[0].userData.username} on ${new Date(payload.new_data[0].taskdata.task.updatedAt).toLocaleString()}.`,
    };
    try {
      await this.taskactivitylogService.create(updateTaskActivityLogDto);
      this.logger.log(`Task Activity Log created for task status update`);
    } catch (error) {
      this.logger.error('Failed to create task status update log', error.stack);
    }

  }
  @OnEvent('task.assigned', { async: true })
  async handleTaskAsssignEvent(payload: { taskdetails: any, assigntask: any }) {
    const updateTaskActivityLogDto: CreateTaskActivityLogDto = {
      project: payload.taskdetails.project,
      task: payload.taskdetails._id.toString(),
      description: ` Task "${payload.taskdetails.title}" was assigned to ${payload.assigntask.username} — Due by ${payload.taskdetails.due_date 
   ? new Date(payload.taskdetails.due_date).toLocaleString()
   : 'No due date'}, Priority: ${payload.taskdetails.priority}, Status: ${payload.taskdetails.status}`,
    };
    try {
      await this.taskactivitylogService.create(updateTaskActivityLogDto);
      this.logger.log(`Task Activity Log created for task assigned`);
    } catch (error) {
      this.logger.error('Failed to create task status update log', error.stack);
    }
  }


  @OnEvent('comments.mention', { async: true })
  async handleCommentsMentionEvent(payload: { CommentDetails: any; assignmentionsuser: any; commentContent: string }) {
    const { CommentDetails, commentContent } = payload;
    const assignmentionUser = payload.assignmentionsuser;
    if (assignmentionUser) {
      for (const user of assignmentionUser) {
        const updateProjectActivityLogDto: CreateTaskActivityLogDto = {
          project: CommentDetails._id,
          description: `${user.username} commented "${commentContent}" — ${new Date(CommentDetails.createdAt).toLocaleString()}`,
        };
        try {
          await this.taskactivitylogService.create(updateProjectActivityLogDto);

        } catch (error) {
          this.logger.error('Failed to create project assign log', error.stack);
        }
      }
      this.logger.log(`Task Activity Log created for project assign`);
    }
  }

  @OnEvent('timeline.created', { async: true })
  async handleTimelineCreatedEvent(payload: { taskdata: any, createdTimeline: any }) {
    const updateTaskActivityLogDto: CreateTaskActivityLogDto = {
      project: payload.taskdata.project._id.toString(),
      task: payload.taskdata.task._id.toString(),
      description: `Worked ${payload.createdTimeline.time_spent} hour(s) on task "${payload.taskdata.task.title}" — general updates and review. Comment: ${payload.createdTimeline.comment}. On ${new Date(payload.createdTimeline.date).toLocaleString()} by "${payload.taskdata.userData.username}"`,
    };
    try {
      await this.taskactivitylogService.create(updateTaskActivityLogDto);
      this.logger.log(`Task Activity Log created for Event :-> timeline created`);
    } catch (error) {
      this.logger.error('Failed to create project assign log', error.stack);
    }
  }

}

