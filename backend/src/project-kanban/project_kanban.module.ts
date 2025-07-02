import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectKanban, ProjectKanbanSchema } from './project_kanban.schema';
import { ProjectKanbanService } from './project_kanban.service';
import { ProjectKanbanController } from './project_kanban.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProjectKanban.name, schema: ProjectKanbanSchema },
    ]),
  ],
  controllers: [ProjectKanbanController],
  providers: [ProjectKanbanService],
  exports: [ProjectKanbanService],
})
export class ProjectKanbanModule {}
