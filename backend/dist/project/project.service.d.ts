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
    addUser(projectId: string, userId: string): Promise<Project>;
    removeUser(projectId: string, userId: string): Promise<Project>;
    getAssignedUsers(projectId: string): Promise<Project>;
    findProjectsByUserId(userId: string): Promise<Project[]>;
}
