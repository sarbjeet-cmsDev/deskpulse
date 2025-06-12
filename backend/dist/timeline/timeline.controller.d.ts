import { CreateTimelineDto } from './timeline.dto';
import { Timeline } from './timeline.interface';
import { TimelineService } from './timeline.service';
export declare class TimelineController {
    private readonly timelineService;
    constructor(timelineService: TimelineService);
    create(createTimelineDto: CreateTimelineDto): Promise<Timeline>;
    findAll(task?: string, user?: string, is_active?: boolean): Promise<Timeline[]>;
    findOne(id: string): Promise<Timeline>;
    update(id: string, updateTimelineDto: CreateTimelineDto): Promise<Timeline>;
    remove(id: string): Promise<Timeline>;
    findByTaskId(taskId: string): Promise<Timeline[]>;
    findByUserId(userId: string): Promise<Timeline[]>;
}
