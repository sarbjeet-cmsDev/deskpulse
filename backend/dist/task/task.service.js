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
exports.TaskService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const project_service_1 = require("../project/project.service");
const task_helpers_1 = require("./task.helpers");
let TaskService = class TaskService {
    constructor(taskModel, projectService) {
        this.taskModel = taskModel;
        this.projectService = projectService;
    }
    async create(createTaskDto) {
        await (0, task_helpers_1.validateProjectId)(this.projectService, createTaskDto.project.toString());
        const createdTask = new this.taskModel(createTaskDto);
        return createdTask.save();
    }
    async findAll() {
        return this.taskModel.find().exec();
    }
    async findOne(id) {
        const task = await this.taskModel.findById(id).exec();
        if (!task) {
            throw new common_1.NotFoundException(`Task with ID ${id} not found.`);
        }
        return task;
    }
    async findByProject(projectId) {
        await (0, task_helpers_1.validateProjectId)(this.projectService, projectId.toString());
        return this.taskModel.find({ project: projectId }).exec();
    }
    async findByAssignedUser(userId) {
        return this.taskModel.find({ assigned_to: userId }).exec();
    }
    async findByReportToUser(userId) {
        return this.taskModel.find({ report_to: userId }).exec();
    }
    async update(id, updateTaskDto) {
        if (updateTaskDto.project) {
            await (0, task_helpers_1.validateProjectId)(this.projectService, updateTaskDto.project.toString());
        }
        const task = await this.taskModel
            .findByIdAndUpdate(id, updateTaskDto, { new: true })
            .exec();
        if (!task) {
            throw new common_1.NotFoundException(`Task with ID ${id} not found.`);
        }
        return task;
    }
    async remove(id) {
        const task = await this.taskModel.findByIdAndDelete(id).exec();
        if (!task) {
            throw new common_1.NotFoundException(`Task with ID ${id} not found.`);
        }
        return task;
    }
};
exports.TaskService = TaskService;
exports.TaskService = TaskService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Task')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        project_service_1.ProjectService])
], TaskService);
//# sourceMappingURL=task.service.js.map