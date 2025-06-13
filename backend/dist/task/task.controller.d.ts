import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from './task.dto';
import { Task } from './task.interface';
export declare class TaskController {
    private readonly taskService;
    constructor(taskService: TaskService);
    create(createTaskDto: CreateTaskDto): Promise<Task>;
    findAll(): Promise<Task[]>;
    findOne(id: string): Promise<Task>;
    findByProject(projectId: string): Promise<Task[]>;
    findByAssignedUser(userId: string): Promise<Task[]>;
    findByReportToUser(userId: string): Promise<Task[]>;
    update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task>;
    remove(id: string): Promise<Task>;
    getMyTaskes(req: any): Promise<Task[]>;
}
