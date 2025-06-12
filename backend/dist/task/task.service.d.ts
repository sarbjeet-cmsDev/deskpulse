import { Model } from 'mongoose';
import { Task } from './task.interface';
import { CreateTaskDto, UpdateTaskDto } from './task.dto';
import { ProjectService } from '../project/project.service';
export declare class TaskService {
    private readonly taskModel;
    private readonly projectService;
    constructor(taskModel: Model<Task>, projectService: ProjectService);
    create(createTaskDto: CreateTaskDto): Promise<Task>;
    findAll(): Promise<Task[]>;
    findOne(id: string): Promise<Task>;
    findByProject(projectId: string): Promise<Task[]>;
    findByAssignedUser(userId: string): Promise<Task[]>;
    findByReportToUser(userId: string): Promise<Task[]>;
    update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task>;
    remove(id: string): Promise<Task>;
}
