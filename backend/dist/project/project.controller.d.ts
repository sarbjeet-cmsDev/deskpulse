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
    addMember(id: string, memberId: string): Promise<Project>;
    removeMember(id: string, memberId: string): Promise<Project>;
}
