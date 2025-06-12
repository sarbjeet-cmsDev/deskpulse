import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentSchema } from './comment.schema';
import { TaskModule } from 'src/task/task.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),TaskModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}


