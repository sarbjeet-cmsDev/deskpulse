import { Model } from 'mongoose';
import { Timeline } from './timeline.interface';
import { TaskService } from 'src/task/task.service';
import { UpdateTimelineDto } from './timeline.dto';
export declare class TimelineService {
    private readonly timelineModel;
    private readonly taskService;
    constructor(timelineModel: Model<Timeline>, taskService: TaskService);
    create(createTimelineDto: any): Promise<Timeline>;
    findAll(): Promise<Timeline[]>;
    findOne(id: string): Promise<Timeline>;
    update(id: string, updateTaskDto: UpdateTimelineDto): Promise<Timeline>;
    remove(id: string): Promise<Timeline>;
    findByTaskId(taskId: string): Promise<Timeline[]>;
    findByUserId(userId: string): Promise<Timeline[]>;
    removeByTaskId(taskId: string): Promise<{
        deletedCount?: number;
    }>;
    findByProjectId(projectId: string, from?: string, to?: string): Promise<Timeline[]>;
}
