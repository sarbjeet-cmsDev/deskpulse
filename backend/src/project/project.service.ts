import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './project.schema';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>
  ) {}

  async create(createProjectDto: Partial<Project>): Promise<Project> {
    const createdProject = new this.projectModel(createProjectDto);
    return createdProject.save();
  }

  async findAll(): Promise<Project[]> {
    return this.projectModel.find().exec();
  }

  async findOne(id: string): Promise<Project> {
    return this.projectModel.findById(id).exec();
  }

  async findByCode(code: string): Promise<Project> {
    return this.projectModel.findOne({ code }).exec();
  }

  async update(id: string, updateProjectDto: Partial<Project>): Promise<Project> {
    return this.projectModel
      .findByIdAndUpdate(id, updateProjectDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Project> {
    return this.projectModel.findByIdAndDelete(id).exec();
  }

  async findActiveProjects(): Promise<Project[]> {
    return this.projectModel.find({ is_active: true }).exec();
  }

  async addMember(projectId: string, memberId: string): Promise<Project> {
    return this.projectModel
      .findByIdAndUpdate(
        projectId,
        { $addToSet: { members: memberId } },
        { new: true }
      )
      .exec();
  }

  async removeMember(projectId: string, memberId: string): Promise<Project> {
    return this.projectModel
      .findByIdAndUpdate(
        projectId,
        { $pull: { members: memberId } },
        { new: true }
      )
      .exec();
  }
}
