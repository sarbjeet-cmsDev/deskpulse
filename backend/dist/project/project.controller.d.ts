import { ProjectService } from './project.service';
import { CreateProjectDto, UpdateProjectDto } from './project.dto';
import { Project } from './project.interface';
export declare class ProjectController {
    private readonly projectService;
    constructor(projectService: ProjectService);
    create(createProjectDto: CreateProjectDto): Promise<Project>;
    findAll(): Promise<Project[]>;
    findActive(): Promise<Project[]>;
    findOne(id: string): Promise<Project>;
    findByCode(code: string): Promise<Project>;
    update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project>;
    remove(id: string): Promise<Project>;
    addUser(id: string, userId: string): Promise<Project>;
    getAssignedUsers(userId: string): Promise<Project>;
    removeUser(id: string, userId: string): Promise<Project>;
    getMyProjects(req: any): Promise<Project[]>;
}
