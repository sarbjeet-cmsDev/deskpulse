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
  Put,
  Query
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto, UpdateProjectDto } from './project.dto';
import { Project } from './project.interface';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { CurrentUser } from 'src/shared/current-user.decorator';
import { UseInterceptors, UploadedFile } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerOptions } from "../shared/multer.config";

@Controller('api/projects')
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }



  @Get('me')
  async getMyProjects(
    @CurrentUser() user: any,
     @Query("page") page: string = "1",
     @Query("limit") limit: string = "4",
  ): Promise<{  data: Project[]; total: number; page: number; limit: number }> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return this.projectService.findProjectsByUserId(user.userId, pageNumber, limitNumber);
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
  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: any): Promise<{ message: string; data: boolean }> {
    const updatedProject = await this.projectService.remove(id);
    return {
      message: 'Project DELETED successfully!',
      data: updatedProject,
    };
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

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<any> {
    await this.projectService.update(id, updateProjectDto);
    return {
      message: 'Project updated successfully!',
    };
  }

  @Post('upload-avatar/:projectId')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadProjectAvatar(  
    @UploadedFile() file: Express.Multer.File,
    @Param('projectId') projectId: string
  ) {
    const fileUrl = `/uploads/${file.filename}`;
    return this.projectService.updateProjectAvatar(projectId, fileUrl);
  }

  }
