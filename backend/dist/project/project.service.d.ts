import { Model } from 'mongoose';
import { Project, ProjectDocument } from './project.schema';
import { ProjectKanbanService } from '../project-kanban/project_kanban.service';
export declare class ProjectService {
    private projectModel;
    private readonly kanbanService;
    constructor(projectModel: Model<ProjectDocument>, kanbanService: ProjectKanbanService);
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
    findAllPaginated(page: number, limit: number, keyword?: string, sortOrder?: 'asc' | 'desc'): Promise<{
        data: Project[];
        total: number;
    }>;
}
