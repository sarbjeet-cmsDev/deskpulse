import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto, UpdateProjectDto } from './project.dto';
import { Project } from './project.interface';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';

@Controller('api/projects')

export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async create(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectService.create(createProjectDto);
  }

  @Get()
  async findAll(): Promise<Project[]> {
    return this.projectService.findAll();
  }

  @Get('active')
  async findActive(): Promise<Project[]> {
    return this.projectService.findActiveProjects();
  }
  @Get('/fetch/:id')
  async findOne(@Param('id') id: string): Promise<Project> {
    return this.projectService.findOne(id);
  }


  @Get('code/:code')
  async findByCode(@Param('code') code: string): Promise<Project> {
    return this.projectService.findByCode(code);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectService.update(id, updateProjectDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Project> {
    return this.projectService.remove(id);
  }

  @Post('/:id/users/:userId')
  async addUser(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ): Promise<Project> {
    return this.projectService.addUser(id, userId);
  }

  @Get('/assigned/:userId/')
  async getAssignedUsers(@Param('userId') userId: string): Promise<Project> {
    return this.projectService.getAssignedUsers(userId);
  }

  @Delete(':id/users/:userId')
  async removeUser(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ): Promise<Project> {
    return this.projectService.removeUser(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyProjects(@Req() req: any): Promise<Project[]> {
    return this.projectService.findProjectsByUserId(req.user.userId);
  }
}