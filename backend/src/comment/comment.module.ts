// comment.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentSchema } from './comment.schema';
import { TaskModule } from 'src/task/task.module';
import { UserModule } from 'src/user/user.module'; // ✅ import the module

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
    TaskModule,
    UserModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
   exports: [CommentService],  // ← Needed so other modules (like SearchModule) can use it
})
export class CommentModule {}
