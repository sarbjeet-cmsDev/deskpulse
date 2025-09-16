import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto, UpdateCommentDto } from './comment.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { Comment } from './comment.interface';
import { CurrentUser } from 'src/shared/current-user.decorator';

@Controller('api/comments')
@UseGuards(JwtAuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async create(@Body() createCommentDto: CreateCommentDto,@CurrentUser() user: any): Promise<Comment> {
    createCommentDto.created_by = user.userId
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
  async findByTask(
    @Param('taskId') taskId: string,
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "5"
  ): Promise<{data: Comment[]; total: number; page: number; limit: number}> {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
    return this.commentService.findByTask(taskId, pageNumber, limitNumber);
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
