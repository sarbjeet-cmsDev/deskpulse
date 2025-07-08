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

  @OnEvent('task.status.updated', { async: true })
  async handleTaskStatusUpdatedEvent(payload: TaskStatusUpdatedPayload) {
    const createtaskactivitylogDto: CreateTaskActivityLogDto = {
      task: payload.taskDetails._id,
      description: `Task status was updated from "${payload.oldTaskStatus}" to "${payload.newTaskStatus}" by ${payload.userDetails.username} on ${new Date(payload.taskDetails.updatedAt).toLocaleString()}.`
    };
    try {
      await this.taskactivitylogService.create(createtaskactivitylogDto);
      this.logger.log(`Notification created`);
    } catch (error) {
      this.logger.error('Failed to create notification', error.stack);
    }
  }
}
