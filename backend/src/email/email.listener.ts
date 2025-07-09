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
        const projectLink = `${process.env.FRONTEND_URL}projects/${payload.projectDetails._id.toString()}`;
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
    const taskLink = `${process.env.FRONTEND_URL}/tasks/${taskDetails.id.toString()}`;
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
  async handleTimelineCreatedEvent(payload: { taskdetails: any, assigntask: any }) {
    const taskLink = `${process.env.FRONTEND_URL}/tasks/${payload.taskdetails._id.toString()}`;
    const assigntask = payload.assigntask;
    log({
        userName: assigntask.username,
        taskTitle: payload.taskdetails.title,
        taskDescription: payload.taskdetails.description,
        dueDate: new Date(payload.taskdetails.due_date).toLocaleString(),
        priority: payload.taskdetails.priority,
        status: payload.taskdetails.status,
        tasklink: taskLink,
      })
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
}

