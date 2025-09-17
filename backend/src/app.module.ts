import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { TimelineModule } from './timeline/timeline.module';
import { CommentModule } from './comment/comment.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProjectKanbanModule } from './project-kanban/project_kanban.module';
import { RemindersModule } from './reminders/reminders.module';
import { TaskChecklistModule } from './taskchecklist/taskchecklist.module';
import { NotificationModule } from './notification/notification.module';
import { TaskactivitylogModule } from './taskactivitylog/taskactivitylog.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';
import { EmailModule } from './email/email.module';
import { PerformanceModule } from './performance/performance.module';
import { FaqModule } from './faq/faq.module';
import { SearchModule } from './search/search.module';
import { UploadModule } from './upload/upload.module';
import { ImageModule } from './image/image.module';
import { WorkSpaceModule } from './workspace/workSpace.module';
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
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        redis: {
          host: config.get('REDIS_HOST') || 'localhost',
          port: parseInt(config.get('REDIS_PORT') || '6379', 10),
          maxRetriesPerRequest: null,
          enableReadyCheck: false
        },
      }),
    }),
    FaqModule,
    EventEmitterModule.forRoot(),
    AuthModule,
    UserModule,
    ProjectModule,
    TaskModule,
    TimelineModule,
    CommentModule,
    ProjectKanbanModule,
    RemindersModule,
    TaskChecklistModule,
    NotificationModule,
    TaskactivitylogModule,
    EmailModule,
    PerformanceModule,
    SearchModule,
    UploadModule,
    ImageModule,
    WorkSpaceModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
