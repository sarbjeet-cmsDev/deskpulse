import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ProjectService } from "./project.service";
import { CreateProjectDto, UpdateProjectDto, UpdateProjectKanbanOrderDto } from "./project.dto";
import { Project } from "./project.interface";
import { UseInterceptors, UploadedFile } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerOptions } from "../shared/multer.config";
import { JwtAuthGuard } from "src/guard/jwt-auth.guard";

@Controller("api/admin/project")

export class AdminProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // ✅ Create Project
  @Post()
  @UseInterceptors(FileInterceptor("avatar", multerOptions))
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<{ message: string }> {
    if (file) {
      const fileUrl = `/uploads/${file.filename}`;
      createProjectDto.avatar = fileUrl;
    }
    await this.projectService.create(createProjectDto);
    return {
      message: "Project created successfully!",
    };
  }

  // ✅ Get All Projects with Pagination, Search, Sort
  @Get()
  async findAll(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("keyword") keyword?: string,
    @Query("sortOrder") sortOrder: "asc" | "desc" = "asc"
  ): Promise<{ data: Project[]; total: number }> {
    return this.projectService.findAllPaginated(
      page,
      limit,
      keyword,
      sortOrder
    );
  }

  // ✅ Get Project by ID
  @Get(":id")
  async findOne(@Param("id") id: string): Promise<any> {
    const project = await this.projectService.findOne(id);
    return {
      // message: "Project fetched successfully!",
      data: project,
    };
  }

  @Get("code/:code")
  async findByCode(@Param("code") code: string): Promise<any> {
    const project = await this.projectService.findByCode(code);
    return {
      // message: "Project fetched successfully!",
      data: project,
    };
  }

  // ✅ Update Project by ID
  @Put(":id")
  @UseInterceptors(FileInterceptor("avatar", multerOptions)) 
  async update(
    @Param("id") id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @UploadedFile() file: Express.Multer.File 
  ): Promise<any> {

    if (file) {
    const fileUrl = `/uploads/${file.filename}`;
    updateProjectDto.avatar = fileUrl;
  }

    const updatedProject = await this.projectService.update(id, updateProjectDto);
    return {
      message: "Project updated successfully!",
       project: updatedProject
    };
  }

  // ✅ Delete Project by ID
  @Delete(":id")
  async remove(@Param("id") id: string): Promise<any> {
    await this.projectService.remove(id);
    return {
      message: "Project deleted successfully!",
    };
  }

  @Put("project/:projectId/kanban/order")
  @UseGuards(JwtAuthGuard)
  async updateKanbanOrder(
    @Param("projectId") projectId: string,
    @Body() updateProjectKanbanOrderDto: UpdateProjectKanbanOrderDto
  ): Promise<any> {
    await this.projectService.updateKanbanOrder(projectId, updateProjectKanbanOrderDto);
    return {
      message: "Project status updated successfully!",
    };
  }
}
