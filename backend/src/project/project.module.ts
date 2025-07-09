import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectSchema } from './project.schema';
import { AdminProjectController } from './admin.project.controller';
import { ProjectKanbanModule } from '../project-kanban/project_kanban.module';
import { UserModule } from 'src/user/user.module';
@Module({
  imports: [MongooseModule.forFeature([{ name: 'Project', schema: ProjectSchema }]),ProjectKanbanModule,UserModule],
  controllers: [ProjectController, AdminProjectController],
  providers: [ProjectService],
exports: [ProjectService], 
})
export class ProjectModule {}


