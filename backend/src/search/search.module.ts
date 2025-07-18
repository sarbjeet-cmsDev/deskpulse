import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { ProjectKanbanModule } from 'src/project-kanban/project_kanban.module';
import { ProjectModule } from 'src/project/project.module';
import { CommentModule } from 'src/comment/comment.module';
import { TaskModule } from 'src/task/task.module';
import { RemindersModule } from 'src/reminders/reminders.module';

@Module({
  imports: [
    ProjectKanbanModule,
    ProjectModule,
    CommentModule,
    TaskModule,
    RemindersModule,
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
