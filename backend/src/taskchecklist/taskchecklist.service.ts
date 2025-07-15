import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaskChecklistDto, UpdateTaskChecklistDto } from './taskchecklist.dto';
import { TaskChecklist, TaskChecklistDocument } from './taskchecklist.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class TaskChecklistService {
    constructor(
        @InjectModel(TaskChecklist.name)
        private readonly taskChecklistModel: Model<TaskChecklistDocument>,
        private eventEmitter: EventEmitter2
    ) { }

    async create(CreateTaskChecklistDto: CreateTaskChecklistDto): Promise<TaskChecklistDocument> {

        const taskChecklistObj =  await this.taskChecklistModel.create(CreateTaskChecklistDto);
        this.eventEmitter.emit("taskchecklist.created", {
            taskChecklistObj: taskChecklistObj,
        });
        return taskChecklistObj;
    }
    async findAll(): Promise<TaskChecklistDocument[]> {
        return this.taskChecklistModel.find().exec();
    }


    async findOne(id: string): Promise<TaskChecklistDocument | null> {
        return this.taskChecklistModel.findById(id).exec();
    }

    async findByTaskId(taskId: string): Promise<TaskChecklistDocument[]> {
        return this.taskChecklistModel.find({ task: taskId }).sort({ createdAt: -1 }).exec();
    }

    async update(id: string, updateTaskChecklistDto: UpdateTaskChecklistDto): Promise<TaskChecklistDocument | null> {
        return this.taskChecklistModel.findByIdAndUpdate(id, updateTaskChecklistDto, { new: true }).exec();
    }

    async remove(id: string): Promise<TaskChecklistDocument> {
        const checklist = await this.taskChecklistModel.findByIdAndDelete(id).exec();
        if (!checklist) {
            throw new NotFoundException(`Task checklist with ID ${id} not found.`);
        }
        return checklist;
    }
}
