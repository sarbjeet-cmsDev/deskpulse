import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Taskactivitylog, TaskactivitylogDocument } from './taskactivitylog.schema';
import { CreateTaskActivityLogDto } from './taskactivitylog.dto';

@Injectable()
export class TaskactivitylogService {
    constructor(
        @InjectModel(Taskactivitylog.name)
        private readonly taskChecklistModel: Model<TaskactivitylogDocument>,
    ) { }
    async create(createTaskChecklistDto: CreateTaskActivityLogDto): Promise<Taskactivitylog> {
        const createdChecklist = new this.taskChecklistModel(createTaskChecklistDto);
        return createdChecklist.save();
    }

    
    async findAll(): Promise<TaskactivitylogDocument[]> {
        return this.taskChecklistModel.find().exec();
    }
}
