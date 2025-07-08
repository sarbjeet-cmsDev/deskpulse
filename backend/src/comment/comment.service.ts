import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './comment.schema';
import { TaskService } from 'src/task/task.service';
import { validateTaskId } from './comment.helper';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private readonly taskService: TaskService
  ) {}

  async create(createCommentDto: Partial<Comment>): Promise<Comment> {
    await validateTaskId(this.taskService, createCommentDto.task.toString());
    const createdComment = new this.commentModel(createCommentDto);
    return createdComment.save();
  }

  async findAll(): Promise<Comment[]> {
    return this.commentModel.find().exec();
  }

  async findOne(id: string): Promise<Comment> {
    return this.commentModel.findById(id).exec();
  }

  async findByTask(
    taskId: string,
    page: number,
    limit: number
  ): Promise<{ data: Comment[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.commentModel
        .find({ task: taskId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.commentModel.countDocuments({ task: taskId }),
    ]);
    return {
      data,
      total,
      page,
      limit,
    };
    // return this.commentModel.find({ task: taskId }).exec();
  }

  async findByParentComment(parentId: string): Promise<Comment[]> {
    return this.commentModel.find({ parent_comment: parentId }).exec();
  }

  async update(id: string, updateCommentDto: Partial<Comment>): Promise<Comment> {
    if (updateCommentDto.task) {
      await validateTaskId(this.taskService, updateCommentDto.task.toString());
    }
    return this.commentModel
      .findByIdAndUpdate(id, updateCommentDto, { new: true })
      .exec();
  }
  
  async remove(id: string): Promise<Comment> {
    return this.commentModel.findByIdAndDelete(id).exec();
  }

  async findByUser(userId: string): Promise<Comment[]> {
    return this.commentModel.find({ created_by: userId }).exec();
  }
}
