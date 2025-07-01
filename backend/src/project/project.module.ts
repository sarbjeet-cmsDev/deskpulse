import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectSchema } from './project.schema';
import { AdminProjectController } from './admin.project.controller';
@Module({
  imports: [MongooseModule.forFeature([{ name: 'Project', schema: ProjectSchema }])],
  controllers: [ProjectController, AdminProjectController],
  providers: [ProjectService],
exports: [ProjectService], // ✅ EXPORT the service
})
export class ProjectModule {}


