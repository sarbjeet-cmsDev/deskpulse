import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FaqModule } from './faq/faq.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { TimelineModule } from './timeline/timeline.module';
import { CommentModule } from './comment/comment.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProjectKanbanModule } from './project-kanban/project_kanban.module';
import { RemindersModule } from './reminders/reminders.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    FaqModule,
    ProjectModule,
    TaskModule,
    TimelineModule,
    CommentModule,
    UserModule,
    ProjectKanbanModule,
    AuthModule,
    RemindersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
