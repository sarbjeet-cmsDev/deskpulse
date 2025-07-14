import { Injectable, Logger } from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { OnEvent } from '@nestjs/event-emitter';
import { log } from 'console';
import { CreatePerformanceDto } from './performance.dto';

@Injectable()
export class PerformanceListener {
  private readonly logger = new Logger(PerformanceListener.name);

  constructor(private readonly performanceService: PerformanceService) { }


  @OnEvent('task.status.updated', { async: true })
  async handleTaskStatusUpdatedEvent(payload: { taskdetails: any, oldTaskStatus: string, updatedBy: any, TaskDetailsObj: any }) {
        const taskdetails = payload.taskdetails
    try {
      await this.performanceService.createPerformance(taskdetails);

    } catch (error) {
      this.logger.error('Failed to create project assign log', error.stack);
    }
  }
}

