import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TaskService } from './task.service';
import { log } from 'console';
import { UpdateTaskDto } from './task.dto';

@Injectable()
export class TaskListener {
    private readonly logger = new Logger(TaskListener.name);

    constructor(private readonly taskService: TaskService) { }


    @OnEvent('timeline.created', { async: true })
    async handleTimelineCreatedEvent(payload: { taskdata: any, createdTimeline: any }) {
        const oldestimated_time = payload.taskdata.task.totaltaskminuts ;
        const time_spent = parseInt(payload.createdTimeline.time_spent);
        const new_estimation_time = oldestimated_time + time_spent;
        const updateTaskDto: UpdateTaskDto = {
            totaltaskminuts: new_estimation_time
        }
        try {
            await this.taskService.update(payload.taskdata.task._id.toString(), updateTaskDto);
              this.logger.log(`Event For timeline.created in the TaskListener`);
        } catch (error) {
            this.logger.error('Failed to create project assign log', error.stack);
        }
        // this.taskService.update(payload.taskdata._id.toString(), updateTaskDto);
    }
}

