import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateKanbanDto, UpdateKanbanDto } from './project_kanban.dto';
import { ProjectKanbanDocument } from './project_kanban.interface'; 
import { ProjectKanban } from './project_kanban.schema';

@Injectable()
export class ProjectKanbanService {
  constructor(
    @InjectModel(ProjectKanban.name)
    private readonly kanbanModel: Model<ProjectKanbanDocument>, 
  ) {}

  async create(dto: CreateKanbanDto): Promise<ProjectKanbanDocument> {
    return this.kanbanModel.create(dto);
  }

  async createDefaults(projectId: string): Promise<ProjectKanbanDocument[]> {
    const defaultStages = [
      'backlog',
      'todo',
      'progress',
      'code_review',
      'qa',
      'todeploy',
      'done',
    ];

    return Promise.all(
      defaultStages.map((title, index) =>
        this.kanbanModel.create({
          title,
          sort_order: index + 1,
          project: projectId,
        }),
      ),
    );
  }

  async findByProject(projectId: string): Promise<ProjectKanbanDocument[]> {
    return this.kanbanModel.find({ project: projectId }).sort({ sort_order: 1 });
  }

  async update(id: string, dto: UpdateKanbanDto): Promise<ProjectKanbanDocument> {
    const updated = await this.kanbanModel.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('Kanban column not found');
    return updated;
  }

  async delete(id: string): Promise<ProjectKanbanDocument> {
    const deleted = await this.kanbanModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Kanban column not found');
    return deleted;
  }
}
