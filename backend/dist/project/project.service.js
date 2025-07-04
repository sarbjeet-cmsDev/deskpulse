"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const project_schema_1 = require("./project.schema");
const project_kanban_service_1 = require("../project-kanban/project_kanban.service");
let ProjectService = class ProjectService {
    constructor(projectModel, kanbanService) {
        this.projectModel = projectModel;
        this.kanbanService = kanbanService;
    }
    async create(createProjectDto) {
        var _a;
        try {
            const createdProject = new this.projectModel(createProjectDto);
            const savedProject = await createdProject.save();
            await this.kanbanService.createDefaults(savedProject._id.toString());
            return savedProject;
        }
        catch (error) {
            if (error.code === 11000 && ((_a = error.keyPattern) === null || _a === void 0 ? void 0 : _a.code)) {
                throw new common_1.ConflictException('Project code must be unique.');
            }
            throw new common_1.InternalServerErrorException('Failed to create project.');
        }
    }
    async findAll() {
        return this.projectModel.find().exec();
    }
    async findOne(id) {
        const project = await this.projectModel.findById(id).exec();
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${id} not found.`);
        }
        return project;
    }
    async findByCode(code) {
        const project = await this.projectModel.findOne({ code }).exec();
        if (!project) {
            throw new common_1.NotFoundException(`Project with code ${code} not found.`);
        }
        return project;
    }
    async update(id, updateProjectDto) {
        const updatedProject = await this.projectModel
            .findByIdAndUpdate(id, updateProjectDto, { new: true })
            .exec();
        if (!updatedProject) {
            throw new common_1.NotFoundException(`Project with ID ${id} not found.`);
        }
        return updatedProject;
    }
    async remove(id) {
        return this.projectModel.findByIdAndDelete(id).exec();
    }
    async findActiveProjects() {
        return this.projectModel.find({ is_active: true }).exec();
    }
    async addUser(projectId, userId) {
        const updatedProject = await this.projectModel
            .findByIdAndUpdate(projectId, { $addToSet: { users: userId } }, { new: true })
            .exec();
        if (!updatedProject) {
            throw new common_1.NotFoundException(`Project with ID ${projectId} not found.`);
        }
        return updatedProject;
    }
    async removeUser(projectId, userId) {
        const updatedProject = await this.projectModel
            .findByIdAndUpdate(projectId, { $pull: { users: userId } }, { new: true })
            .exec();
        if (!updatedProject) {
            throw new common_1.NotFoundException(`Project with ID ${projectId} not found.`);
        }
        return updatedProject;
    }
    async getAssignedUsers(projectId) {
        const project = await this.projectModel.findById(projectId).exec();
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${projectId} not found.`);
        }
        return project;
    }
    async findProjectsByUserId(userId) {
        return this.projectModel.find({ users: userId }).exec();
    }
    async findAllPaginated(page, limit, keyword, sortOrder = 'asc') {
        const skip = (page - 1) * limit;
        const query = {};
        if (keyword) {
            query.$or = [
                { name: { $regex: keyword, $options: 'i' } },
                { code: { $regex: keyword, $options: 'i' } },
            ];
        }
        const [projects, total] = await Promise.all([
            this.projectModel
                .find(query)
                .sort({ createdAt: sortOrder === 'asc' ? 1 : -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.projectModel.countDocuments(query),
        ]);
        return {
            data: projects,
            total,
        };
    }
};
exports.ProjectService = ProjectService;
exports.ProjectService = ProjectService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(project_schema_1.Project.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        project_kanban_service_1.ProjectKanbanService])
], ProjectService);
//# sourceMappingURL=project.service.js.map