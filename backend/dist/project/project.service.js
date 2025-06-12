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
let ProjectService = class ProjectService {
    constructor(projectModel) {
        this.projectModel = projectModel;
    }
    async create(createProjectDto) {
        var _a;
        try {
            const createdProject = new this.projectModel(createProjectDto);
            return await createdProject.save();
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
    async addMember(projectId, memberId) {
        const updatedProject = await this.projectModel
            .findByIdAndUpdate(projectId, { $addToSet: { members: memberId } }, { new: true })
            .exec();
        if (!updatedProject) {
            throw new common_1.NotFoundException(`Project with ID ${projectId} not found.`);
        }
        return updatedProject;
    }
    async removeMember(projectId, memberId) {
        const updatedProject = await this.projectModel
            .findByIdAndUpdate(projectId, { $pull: { members: memberId } }, { new: true })
            .exec();
        if (!updatedProject) {
            throw new common_1.NotFoundException(`Project with ID ${projectId} not found.`);
        }
        return updatedProject;
    }
};
exports.ProjectService = ProjectService;
exports.ProjectService = ProjectService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(project_schema_1.Project.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProjectService);
//# sourceMappingURL=project.service.js.map