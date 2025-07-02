import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto, UpdateProjectDto } from './project.dto';
import { Project } from './project.interface';

@Controller('api/admin/project')
export class AdminProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // ✅ Create Project
  @Post()
  async create(@Body() createProjectDto: CreateProjectDto): Promise<any> {
    const project = await this.projectService.create(createProjectDto);
    return {
      message: 'Project created successfully!',
      data: project,
    };
  }

  // ✅ Get All Projects with Pagination, Search, Sort
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('keyword') keyword?: string,
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
  ): Promise<{ data: Project[]; total: number }> {
    return this.projectService.findAllPaginated(page, limit, keyword, sortOrder);
  }

  // ✅ Get Project by ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    const project = await this.projectService.findOne(id);
    return {
      message: 'Project fetched successfully!',
      data: project,
    };
  }

  // ✅ Update Project by ID
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<any> {
    const updated = await this.projectService.update(id, updateProjectDto);
    return {
      message: 'Project updated successfully!',
      data: updated,
    };
  }

  // ✅ Delete Project by ID
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    const deleted = await this.projectService.remove(id);
    return {
      message: 'Project deleted successfully!',
      data: deleted,
    };
  }
}
