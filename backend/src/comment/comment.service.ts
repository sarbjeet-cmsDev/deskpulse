import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './comment.schema';
import { TaskService } from 'src/task/task.service';
import { validateTaskId } from './comment.helper';
import { UserService } from 'src/user/user.service';
import { extractTextFromHtml, getUserDetailsById, getUserDetailsById1 } from 'src/shared/commonhelper';
import { log } from 'console';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private readonly taskService: TaskService,
    private eventEmitter: EventEmitter2,
    private readonly userservices: UserService,
  ) { }

  async create(createCommentDto: Partial<Comment>): Promise<Comment> {
    await validateTaskId(this.taskService, createCommentDto.task.toString());
    const createdComment = new this.commentModel(createCommentDto);
    if (createCommentDto.mentioned) {
      const assignmentionsuser = await Promise.all(
        createCommentDto.mentioned.map(async (userId) => {
          const userData = await getUserDetailsById(this.userservices, userId.toString());
          return userData;
        })
      );
    
      this.eventEmitter.emit('comments.mention', {
        CommentDetails: createdComment,
        commentContent: extractTextFromHtml(createdComment.content),
        assignmentionsuser: assignmentionsuser
      });
    }
    return createdComment.save();
  }


  async findAll(): Promise<any[]> {
    const comments = await this.commentModel.find().lean(); // lean returns plain JS objects
    const commentMap = new Map();
    // Index all comments by ID and remove parent_comment property
    comments.forEach(comment => {
      const { parent_comment, ...rest } = comment; // exclude parent_comment
      commentMap.set(comment._id.toString(), { ...rest, replies: [] });
    });
    const roots = [];
    // Build tree
    for (const comment of comments) {
      const parentId = comment.parent_comment?.toString();

      if (parentId && commentMap.has(parentId)) {
        commentMap.get(parentId).replies.push(commentMap.get(comment._id.toString()));
      } else {
        roots.push(commentMap.get(comment._id.toString())); // top-level comments
      }
    }
    return roots;
  }

  async findOne(id: string): Promise<Comment> {
    return this.commentModel.findById(id).exec();
  }

 async findByTask(
  taskId: string,
  page: number,
  limit: number
): Promise<{ data: any[]; total: number; page: number; limit: number }> {
  const skip = (page - 1) * limit;

  const [comments, total] = await Promise.all([
    this.commentModel
      .find({ task: new Types.ObjectId(taskId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec(),
    this.commentModel.countDocuments({ task: new Types.ObjectId(taskId) }),
  ]);

  const data = await Promise.all(
    comments.map(async (comment) => {
      const userDetails = await getUserDetailsById1(
        this.userservices,
        comment.created_by.toString()
      );

      return {
        ...comment,
        created_by: userDetails, // Replace ID with full user details
      };
    })
  );
  return { data, total, page, limit };
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
