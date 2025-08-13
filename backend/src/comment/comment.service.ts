import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './comment.schema';
import { TaskService } from 'src/task/task.service';
import { validateTaskId } from './comment.helper';
import { UserService } from 'src/user/user.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { log } from 'console';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private readonly taskService: TaskService,
    private eventEmitter: EventEmitter2,
    private readonly userservices: UserService,
  ) { }

  async create(createCommentDto: Partial<Comment>): Promise<Comment> {

    let TaskData = await validateTaskId(this.taskService, createCommentDto.task.toString());
    createCommentDto.project = TaskData.project;
    const createdComment = new this.commentModel(createCommentDto);
    if (createCommentDto.mentioned) {
      this.eventEmitter.emit('comments.mention', {
        CommentObj: createdComment,
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

  async findAllComment(
    page: number,
    limit: number,
    keyword?: string,
    sortOrder: "asc" | "desc" = "asc"
  ): Promise<{ data: Comment[]; total: number; page: number; limit: number; totalPages: number; }> {
    let safePage = Math.max(Number(page) || 1, 1);
    let safeLimit = Math.max(Number(limit) || 10, 1);
    const MAX_LIMIT = 200;
    if (safeLimit > MAX_LIMIT) safeLimit = MAX_LIMIT;


    const filter: Record<string, any> = {};
    if (keyword && keyword.trim()) {
      filter.$or = [
        { content: { $regex: keyword.trim(), $options: 'i' } },
        // { code: { $regex: keyword.trim(), $options: 'i' } },
      ];
    }


    const total = await this.commentModel.countDocuments(filter).exec();
    const totalPages = total === 0 ? 0 : Math.ceil(total / safeLimit);


    if (totalPages > 0 && safePage > totalPages) {
      safePage = totalPages;
    }

    const skip = (safePage - 1) * safeLimit;

    const data = await this.commentModel
      .find(filter)
      .sort({ createdAt: sortOrder === 'desc' ? 1 : -1 })
      .skip(skip)
      .limit(safeLimit)
      .exec();


    return {
      data,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages,
    };
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
        const userDetails = await this.userservices.findOne(comment.created_by.toString());
        return {
          ...comment,
          created_by: userDetails?.username, // Replace ID with full user details
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
      const TaskData = await validateTaskId(this.taskService, updateCommentDto.task.toString());
      // Ensure project field is consistent with task's project
      // updateCommentDto.project = TaskData.project;
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

  async search(keyword: string, projectIds: string[]) { // Ensure projectIds is an array of strings
    const regex = new RegExp(keyword, "i");
    const filters: any = {
      $and: [
        {
          project: { $in: projectIds.map(id => new Types.ObjectId(id)) }
        },
        {
          $or: [
            { content: { $regex: regex } }, // Use regex for content search
          ],
        },
      ],
    };
    return this.commentModel
      .find(filters)
      .sort({ createdAt: -1, updatedAt: -1 }) // Sort by createdAt and updatedAt in descending order
      .limit(10) // Limit results to 10
      .exec();
  }
}
