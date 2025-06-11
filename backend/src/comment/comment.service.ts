import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './comment.schema';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>
  ) {}

  async create(createCommentDto: Partial<Comment>): Promise<Comment> {
    const createdComment = new this.commentModel(createCommentDto);
    return createdComment.save();
  }

  async findAll(): Promise<Comment[]> {
    return this.commentModel.find().exec();
  }

  async findOne(id: string): Promise<Comment> {
    return this.commentModel.findById(id).exec();
  }

  async findByTask(taskId: string): Promise<Comment[]> {
    return this.commentModel.find({ task: taskId }).exec();
  }

  async findByParentComment(parentId: string): Promise<Comment[]> {
    return this.commentModel.find({ parent_comment: parentId }).exec();
  }

  async update(id: string, updateCommentDto: Partial<Comment>): Promise<Comment> {
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
