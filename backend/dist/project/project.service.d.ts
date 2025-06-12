import { Model } from 'mongoose';
import { Project, ProjectDocument } from './project.schema';
export declare class ProjectService {
    private projectModel;
    constructor(projectModel: Model<ProjectDocument>);
    create(createProjectDto: Partial<Project>): Promise<Project>;
    findAll(): Promise<Project[]>;
    findOne(id: string): Promise<Project>;
    findByCode(code: string): Promise<Project>;
    update(id: string, updateProjectDto: Partial<Project>): Promise<Project>;
    remove(id: string): Promise<Project>;
    findActiveProjects(): Promise<Project[]>;
    addMember(projectId: string, memberId: string): Promise<Project>;
    removeMember(projectId: string, memberId: string): Promise<Project>;
}
