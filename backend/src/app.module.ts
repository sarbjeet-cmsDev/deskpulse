import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FaqModule } from './faq/faq.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { TimelineModule } from './timeline/timeline.module';
import { CommentModule } from './comment/comment.module';

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
    CommentModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
