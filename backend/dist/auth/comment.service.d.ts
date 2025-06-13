import { Model } from 'mongoose';
import { Comment, CommentDocument } from './comment.schema';
import { TaskService } from 'src/task/task.service';
export declare class CommentService {
    private commentModel;
    private readonly taskService;
    constructor(commentModel: Model<CommentDocument>, taskService: TaskService);
    create(createCommentDto: Partial<Comment>): Promise<Comment>;
    findAll(): Promise<Comment[]>;
    findOne(id: string): Promise<Comment>;
    findByTask(taskId: string): Promise<Comment[]>;
    findByParentComment(parentId: string): Promise<Comment[]>;
    update(id: string, updateCommentDto: Partial<Comment>): Promise<Comment>;
    remove(id: string): Promise<Comment>;
    findByUser(userId: string): Promise<Comment[]>;
}
