import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from './email.service';
import { OnEvent } from '@nestjs/event-emitter';
import { TaskStatusUpdatedPayload } from 'src/taskactivitylog/taskactivitylog.interface';
import { log } from 'console';

@Injectable()
export class EmailListener {
  private readonly logger = new Logger(EmailListener.name);

  constructor(private readonly emailservice: EmailService) { }


  // When the Project Assign Notification is triggered 
  @OnEvent('project.assigned', { async: true })
  async handleProjectUpdatedEvent(payload: { projectDetails: any; assignproject: any; }) {
    const { projectDetails } = payload;
    const assignproject = payload.assignproject;
    if (assignproject) {
      for (const user of assignproject) {
        const projectLink = `${process.env.FRONTEND_URL}project/${payload.projectDetails._id.toString()}`;
        const templates = `The project "${payload.projectDetails.title}" was successfully assigned to ${user.username} on ${new Date(payload.projectDetails.updatedAt).toLocaleString()}.`;

        await this.emailservice.sendEmail({
          to: user.email,
          subject: 'Project Assign Notification',
          template: 'templates/project-template.mjml',
          variables: {
            project_template: templates,
            projectName: payload.projectDetails.title,
            userName: user.username,
            projectTitle: payload.projectDetails.title,
            projectLink,
          },
        });
      }
    }
    this.logger.log(`Project Assign Notification created successfully`);
  }

  @OnEvent('task.status.updated', { async: true })
  async handleTaskStatusUpdatedEvent({ taskDetails, userDetails, projectObj, oldTaskStatus, newTaskStatus }: TaskStatusUpdatedPayload) {
    const taskLink = `${process.env.FRONTEND_URL}/task/${taskDetails.id.toString()}`;
    this.emailservice.sendEmail({
      to: projectObj.teamLeader.email,
      subject: 'Task Status Updated',
      template: 'templates/task-status-updated.mjml',
      variables: {
        oldTaskStatus: oldTaskStatus,
        newTaskStatus: newTaskStatus,
        username: userDetails.username || 'Unknown User',
        updatedAt: new Date(taskDetails?.updatedAt).toLocaleString(),
        taskLink: taskLink
      }
    })
    this.emailservice.sendEmail({
      to: projectObj.projectCoordinator.email,
      subject: 'Task Status Updated',
      template: 'templates/task-status-updated.mjml',
      variables: {
        oldTaskStatus: oldTaskStatus,
        newTaskStatus: newTaskStatus,
        username: userDetails.username || 'Unknown User',
        updatedAt: new Date(taskDetails?.updatedAt).toLocaleString(),
        taskLink: taskLink
      }
    })
    this.emailservice.sendEmail({
      to: projectObj.projectManager.email,
      subject: 'Task Status Updated',
      template: 'templates/task-status-updated.mjml',
      variables: {
        oldTaskStatus: oldTaskStatus,
        newTaskStatus: newTaskStatus,
        username: userDetails.username || 'Unknown User',
        updatedAt: new Date(taskDetails?.updatedAt).toLocaleString(),
        taskLink: taskLink
      }
    })
    this.logger.log(`Task Status  Updation Email Notification `);
  }

  @OnEvent('task.assigned', { async: true })
  async handleTaskAssignEvent(payload: { taskdetails: any, assigntask: any }) {
    const taskLink = `${process.env.FRONTEND_URL}/task/${payload.taskdetails._id.toString()}`;
    const assigntask = payload.assigntask;
    this.emailservice.sendEmail({
      to: assigntask.email,
      subject: 'Task Assign Notification',
      template: 'templates/task/task-assign-email-template.mjml',
      variables: {
        userName: assigntask.username,
        taskTitle: payload.taskdetails.title,
        taskDescription: payload.taskdetails.description,
        dueDate: new Date(payload.taskdetails.due_date).toLocaleString(),
        priority: payload.taskdetails.priority,
        status: payload.taskdetails.status,
        tasklink: taskLink,
      },
    })
    this.logger.log(`Task Assign Notification created successfully`);
  }

  @OnEvent('comments.mention', { async: true })
  async handleCommentsMentionEvent(payload: { CommentDetails: any; assignmentionsuser: any; commentContent: string }) {
    const { CommentDetails, commentContent } = payload;
    const assignmentionUser = payload.assignmentionsuser;
    if (assignmentionUser) {
      for (const user of assignmentionUser) {
        const commentlink = `${process.env.FRONTEND_URL}comment/${payload.CommentDetails._id.toString()}`;
        await this.emailservice.sendEmail({
          to: user.email,
          subject: 'New Comment Notification',
          template: 'templates/commnets/comments.notify.mjml',
          variables: {
            userName: user.username,
            commentMessage: commentContent,
            commentDate: new Date(CommentDetails.createdAt).toLocaleString(),
            commentlink: commentlink
          },
        });
      }
    }
    this.logger.log(`comments Mentioned Notification created successfully`);
  }

  @OnEvent('timeline.created', { async: true })
  async handleTimelineCreatedEvent(payload: { taskdata: any, createdTimeline: any }) {
    const { taskdata, createdTimeline } = payload;
    const templates = `Worked ${createdTimeline.time_spent} hour(s) on task "${taskdata.task.title}" — general updates and review. Comment: ${createdTimeline.comment}. On ${new Date(createdTimeline.date).toLocaleString()} by "${taskdata.userData.username}"`;
    const timelineLink = `${process.env.FRONTEND_URL}timeline/${createdTimeline._id.toString()}`;
    const recipients = [
      taskdata.project.projectCoordinator,
      taskdata.project.teamLeader,
      taskdata.project.projectManager,
    ];
    for (const recipient of recipients) {
      await this.emailservice.sendEmail({
        to: recipient.email,
        subject: 'Timeline Notification',
        template: 'templates/timeline/timeline-notification.mjml',
        variables: {
          User: recipient.username,
          timeline_template:templates,
          timelineLink: timelineLink,
        },
      });
    }
    this.logger.log(`timeline.created Email Sent NOtification`);
  }
  

}

