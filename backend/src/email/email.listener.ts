import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from './email.service';
import { OnEvent } from '@nestjs/event-emitter';
import { UserService } from 'src/user/user.service';
import { ProjectService } from 'src/project/project.service';
import { TaskService } from 'src/task/task.service';
import { extractTextFromHtml, formatMinutes } from 'src/shared/commonhelper';

@Injectable()
export class EmailListener {
  private readonly logger = new Logger(EmailListener.name);

  constructor(private readonly emailservice: EmailService
    , private readonly userservices: UserService,
    private readonly projectService: ProjectService,
    private readonly taskServices: TaskService,
  ) { }

  // When the Project Assign event is triggered
  @OnEvent('project.assigned', { async: true })
  async handleProjectAssignedEvent({ projectObj }: { projectObj: any }) {
    for (const userId of projectObj.users) {
      try {
        const user = await this.userservices.findOne(userId.toString());
        await this.emailservice.sendEmail({
          to: user.email,
          subject: 'Project Assigned',
          template: 'templates/project-template.mjml',
          variables: {
            project_template: `Project "${projectObj.title}" was assigned to ${user.username} on ${new Date(projectObj.updatedAt).toLocaleString()}.`,
            projectName: projectObj.title,
            userName: user.username,
            projectLink: `${process.env.FRONTEND_URL}project/${projectObj._id}`,
          },
        });
        this.logger.log(`Project assignment Email Notification sent.`);
      } catch (err) {
        this.logger.error(`Failed to send email to ${userId}: ${err.message}`);
      }
    }
    this.logger.log(`All project assignment emails processed.`);
  }

  // On Task Assign 
  @OnEvent('task.assigned', { async: true })
  async handleTaskAsssignEvent(payload: { taskObj: any; }) {
    const { taskObj } = payload;
    const taskUsers = taskObj.assigned_to
    const UserData = await this.userservices.findOne(taskUsers.toString())
    try {
      this.emailservice.sendEmail({
        to: UserData.email,
        subject: 'Task Assign Notification',
        template: 'templates/task/task-assign-email-template.mjml',
        variables: {
          userName: UserData.username,
          taskTitle: taskObj.title,
          taskDescription: taskObj.description ?? '',
          dueDate: taskObj.due_date ? new Date(taskObj.due_date).toLocaleString() : 'No due date',
          priority: taskObj.priority,
          status: taskObj.status,
          tasklink: `${process.env.FRONTEND_URL}/task/${taskObj._id.toString()}`,
        },
      })
      this.logger.log(`Task assignment Email Notification sent.`);
    } catch (err) {
      this.logger.error(`Failed to send email to ${UserData.username}: ${err.message}`);
    }
  }


  // When the Task Status Updated event is triggered
  @OnEvent('task.status.updated', { async: true })
  async handleTaskStatusUpdatedEvent(payload: { taskObj: any; oldTaskStatus: string, updatedBy: any }) {
    const taskObj = payload.taskObj;
    const oldTaskStatus = payload.oldTaskStatus;
    const ProjectObj = await this.projectService.findOne(taskObj.project.toString())
    const email = [];
    const roles = ['project_coordinator', 'team_leader', 'project_manager'];
    for (const role of roles) {
      if (ProjectObj[role]) {
        const userData = await this.userservices.findOne(ProjectObj[role].toString());
        email.push({
          to: userData.email,
          subject: 'Task Status Updated',
          template: 'templates/task-status-updated.mjml',
          variables: {
            userName: userData.username,
            taskTitle: taskObj.title,
            oldTaskStatus,
            newTaskStatus: taskObj.status,
            updatedAt: new Date(taskObj.updatedAt).toLocaleString(),
            tasklink: `${process.env.FRONTEND_URL}/task/${taskObj._id}`,
          },
        });
      }
    }
    try {
      await Promise.all(
        email.map((email) =>
          this.emailservice.sendEmail(email),
        ),
      );
      this.logger.log('All notification emails sent for task status update.');
    } catch (error) {
      this.logger.error(
        'Failed to create notifications or send emails',
        error.stack || error,
      );
    }
  }

  @OnEvent('timeline.created', { async: true })
  async handleTimelineCreatedEvent(payload: { timeLineObj: any }) {

    const timeLineObj = payload.timeLineObj;
    const timeLineCreatedBy = await this.userservices.findOne(timeLineObj.created_by.toString());
    const TaskObj = await this.taskServices.findOne(timeLineObj.task.toString())
    const ProjectObj = await this.projectService.findOne(TaskObj.project.toString())
    const rolesToNotify = ['project_coordinator', 'team_leader', 'project_manager'];
    const content = `Worked ${formatMinutes(timeLineObj.time_spent) } on task "${TaskObj.title}" — general updates and review. Comment: ${timeLineObj.comment}. On ${new Date(timeLineObj.date).toLocaleString()} by "${timeLineCreatedBy.username}"`;
    const timelineLInk = `${process.env.FRONTEND_URL}/task/${timeLineObj._id.toString()}`;
    const email = [];
    for (const role of rolesToNotify) {
      if (ProjectObj[role]) {
        const userData = await this.userservices.findOne(ProjectObj[role].toString());
        email.push({
          to: userData.email,
          subject: 'Timeline Notification',
          template: 'templates/timeline/timeline-notification.mjml',
          variables: {
            User: userData.username,
            timeline_template: content,
            timelineLink: timelineLInk,
          },
        });
      }
    }
    try {
      await Promise.all(
        email.map((email) =>
          this.emailservice.sendEmail(email),
        ),
      );
      this.logger.log('All notification emails sent for task status update.');
    } catch (error) {
      this.logger.error(
        'Failed to create notifications or send emails',
        error.stack || error,
      );
    }
  }
  @OnEvent('comments.mention', { async: true })
  async handleCommentsMentionEvent(payload: { CommentObj: any }) {
    try {
      const comment = payload.CommentObj;
      const commentText = extractTextFromHtml(comment.content);
      const mentionedUserIds = comment.mentioned;
      for (const userId of mentionedUserIds) {
        try {
          const mentionedUser = await this.userservices.findOne(userId.toString());

          if (!mentionedUser) {
            this.logger.warn(`Mentioned user with ID ${userId} not found.`);
            continue;
          }
          await this.emailservice.sendEmail({
            to: mentionedUser.email,
            subject: 'You were mentioned in a comment',
            template: 'templates/comments/comments.notify.mjml',
            variables: {
              userName: mentionedUser.username,
              commentMessage: commentText,
              commentDate: new Date(comment.createdAt).toLocaleString(),
              commentLink: `${process.env.FRONTEND_URL}comment/${comment._id.toString()}`,
            },
          });
          
          this.logger.log(`Notification sent to ${mentionedUser.email}`);
        } catch (innerError) {
          this.logger.error(`Failed to notify mentioned user ID ${userId}:`, innerError);
        }
      }
      

      this.logger.log('All notifications for mentioned users have been processed.');
    } catch (error) {
      this.logger.error('Error handling comment mention event:', error);
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
    const rolesToNotify = ['project_coordinator', 'team_leader', 'project_manager'];
    const email = [];
    for (const role of rolesToNotify) {
      if (ProjectObj[role]) {
        const userData = await this.userservices.findOne(ProjectObj[role].toString());
        email.push({
          to: userData.email,
          subject: 'Task Checklist Notification',
          template: 'templates/taskchecklist/taskchecklist.create.email-template.mjml',
          variables: {
            User: userData.username,
            taskchecklist_template: content,
            timelineLink: timelineLInk,
          },
        });
      }
    }
    try {
      await Promise.all(
        email.map((email) =>
          this.emailservice.sendEmail(email),
        ),
      );
      this.logger.log('All notification emails sent for task status update.');
    } catch (error) {
      this.logger.error(
        'Failed to create notifications or send emails',
        error.stack || error,
      );
    }
  }
}




