
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentSchema } from './comment.schema';
import { TaskModule } from 'src/task/task.module';
import { UserModule } from 'src/user/user.module'; 
import { AdminCommentController } from './admin.comment.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
    TaskModule,
    UserModule,
  ],
  controllers: [CommentController, AdminCommentController],
  providers: [CommentService],
   exports: [CommentService],  
})
export class CommentModule {}
