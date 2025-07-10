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
    UserModule, // ✅ correct module import
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
