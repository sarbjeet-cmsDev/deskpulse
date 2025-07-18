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
    async handleTimelineCreatedEvent(payload: { timeLineObj: any }) {
        const timeLineObj = payload.timeLineObj;
        const TaskObj = await this.taskService.findOne(timeLineObj.task.toString())
        const oldestimated_time = TaskObj.totaltaskminutes;
        const totaltaskminutes = TaskObj?.totaltaskminutes;
        if (totaltaskminutes === undefined || totaltaskminutes === null) {
            throw new Error('Task object is missing `totaltaskminutes`');
        }
        const time_spent = parseInt(timeLineObj.time_spent);
        const new_estimation_time = oldestimated_time + time_spent;

        const updateTaskDto: UpdateTaskDto = {
            totaltaskminutes: new_estimation_time
        }
        try {
            await this.taskService.update(TaskObj._id.toString(), updateTaskDto);
            this.logger.log(`Event For timeline.created in the TaskListener`);
        } catch (error) {
            this.logger.error('Failed to create project assign log', error.stack);
        }
    }
}

