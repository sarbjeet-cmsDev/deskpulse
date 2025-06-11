import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto, UpdateCommentDto } from './comment.dto';
import { Comment } from './comment.interface';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async create(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentService.create(createCommentDto);
  }

  @Get()
  async findAll(): Promise<Comment[]> {
    return this.commentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Comment> {
    return this.commentService.findOne(id);
  }

  @Get('task/:taskId')
  async findByTask(@Param('taskId') taskId: string): Promise<Comment[]> {
    return this.commentService.findByTask(taskId);
  }

  @Get('parent/:parentId')
  async findByParentComment(@Param('parentId') parentId: string): Promise<Comment[]> {
    return this.commentService.findByParentComment(parentId);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string): Promise<Comment[]> {
    return this.commentService.findByUser(userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    return this.commentService.update(id, updateCommentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Comment> {
    return this.commentService.remove(id);
  }
}
