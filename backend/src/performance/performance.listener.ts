import { Injectable, Logger } from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class PerformanceListener {
  private readonly logger = new Logger(PerformanceListener.name);
  constructor(private readonly performanceService: PerformanceService) { }
  @OnEvent('task.status.updated', { async: true })
  async handleTaskStatusUpdatedEvent(payload: { taskObj: any; oldTaskStatus: string, updatedBy: any }) {
    const taskObj = payload.taskObj;
    try {
      await this.performanceService.createPerformance(taskObj);
      this.logger.log(`performanceService Created`);
    } catch (error) {
      this.logger.error('Failed to create project assign log', error.stack);
    }
  }
}

