import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaskChecklistDto, UpdateTaskChecklistDto } from './taskchecklist.dto';
import { TaskChecklist, TaskChecklistDocument } from './taskchecklist.schema';
import { TaskService } from 'src/task/task.service';
import { UserService } from 'src/user/user.service';
import { validateFields, validateTaskId, validateUserId } from './taskchecklist.helpers';

@Injectable()
export class TaskChecklistService {
    constructor(
        @InjectModel(TaskChecklist.name)
        private readonly taskChecklistModel: Model<TaskChecklistDocument>,
        private readonly taskService: TaskService,
        private readonly userService: UserService
    ) { }

    async create(CreateTaskChecklistDto: CreateTaskChecklistDto): Promise<TaskChecklistDocument> {
        await validateFields(CreateTaskChecklistDto, {
            task: (value) => validateTaskId(this.taskService, value),
            created_by: (value, field) => validateUserId(this.userService, value, field),
            completed_by: (value, field) => validateUserId(this.userService, value, field),
        });
        return this.taskChecklistModel.create(CreateTaskChecklistDto);
    }
    async findAll(filter?: Partial<TaskChecklist>): Promise<TaskChecklistDocument[]> {
        return this.taskChecklistModel.find().exec();
    }


    async findOne(id: string): Promise<TaskChecklistDocument | null> {
        return this.taskChecklistModel.findById(id).exec();
    }

    async findByTaskId(taskId: string): Promise<TaskChecklistDocument[]> {
        return this.taskChecklistModel.find({ task: taskId }).sort({ createdAt: -1 }).exec();
    }

    async update(id: string, updateTaskChecklistDto: UpdateTaskChecklistDto): Promise<TaskChecklistDocument | null> {
        await validateFields(updateTaskChecklistDto, {
            task: (value) => validateTaskId(this.taskService, value),
            created_by: (value, field) => validateUserId(this.userService, value, field),
            completed_by: (value, field) => validateUserId(this.userService, value, field),
        });
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
