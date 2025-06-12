import { NotFoundException } from '@nestjs/common';
import { ProjectService } from '../project/project.service';

export async function validateProjectId(projectService: ProjectService, projectId: string) {
  const project = await projectService.findOne(projectId.toString());
  if (!project) {
    throw new NotFoundException(`Project with ID ${projectId} not found.`);
  }
  return project;
}
