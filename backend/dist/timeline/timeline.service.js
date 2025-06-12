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
exports.TimelineService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const task_service_1 = require("../task/task.service");
const task_helpers_1 = require("./task.helpers");
let TimelineService = class TimelineService {
    constructor(timelineModel, taskService) {
        this.timelineModel = timelineModel;
        this.taskService = taskService;
    }
    async create(createTimelineDto) {
        await (0, task_helpers_1.validateTaskId)(this.taskService, createTimelineDto.task.toString());
        const createdTimeline = new this.timelineModel(createTimelineDto);
        return createdTimeline.save();
    }
    async findAll() {
        return this.timelineModel.find().exec();
    }
    async findOne(id) {
        const timeline = await this.timelineModel.findById(id).exec();
        if (!timeline) {
            throw new common_1.NotFoundException(`Timeline with ID ${id} not found.`);
        }
        return timeline;
    }
    async update(id, updateTaskDto) {
        if (updateTaskDto.task) {
            await (0, task_helpers_1.validateTaskId)(this.taskService, updateTaskDto.task.toString());
        }
        return this.timelineModel.findByIdAndUpdate(id, updateTaskDto, { new: true }).exec();
    }
    async remove(id) {
        const timeline = await this.timelineModel.findByIdAndDelete(id).exec();
        if (!timeline) {
            throw new common_1.NotFoundException(`Timeline with ID ${id} not found.`);
        }
        return timeline;
    }
    async findByTaskId(taskId) {
        await (0, task_helpers_1.validateTaskId)(this.taskService, taskId);
        return this.timelineModel.find({ task: taskId }).exec();
    }
    async findByUserId(userId) {
        return this.timelineModel.find({ user: userId }).exec();
    }
    async removeByTaskId(taskId) {
        return this.timelineModel.deleteMany({ task: taskId }).exec();
    }
};
exports.TimelineService = TimelineService;
exports.TimelineService = TimelineService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Timeline')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        task_service_1.TaskService])
], TimelineService);
//# sourceMappingURL=timeline.service.js.map