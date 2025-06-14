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
exports.TimelineController = void 0;
const common_1 = require("@nestjs/common");
const timeline_dto_1 = require("./timeline.dto");
const timeline_service_1 = require("./timeline.service");
let TimelineController = class TimelineController {
    constructor(timelineService) {
        this.timelineService = timelineService;
    }
    async create(createTimelineDto) {
        return this.timelineService.create(createTimelineDto);
    }
    async findAll(task, user, is_active) {
        return this.timelineService.findAll();
    }
    async findOne(id) {
        return this.timelineService.findOne(id);
    }
    async update(id, updateTimelineDto) {
        return this.timelineService.update(id, updateTimelineDto);
    }
    async remove(id) {
        return this.timelineService.remove(id);
    }
    async findByTaskId(taskId) {
        return this.timelineService.findByTaskId(taskId);
    }
    async findByUserId(userId) {
        return this.timelineService.findByUserId(userId);
    }
    async getByProject(projectId, from, to) {
        return this.timelineService.findByProjectId(projectId, from, to);
    }
};
exports.TimelineController = TimelineController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [timeline_dto_1.CreateTimelineDto]),
    __metadata("design:returntype", Promise)
], TimelineController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('task')),
    __param(1, (0, common_1.Query)('user')),
    __param(2, (0, common_1.Query)('is_active')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean]),
    __metadata("design:returntype", Promise)
], TimelineController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TimelineController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, timeline_dto_1.CreateTimelineDto]),
    __metadata("design:returntype", Promise)
], TimelineController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TimelineController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('task/:taskId'),
    __param(0, (0, common_1.Param)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TimelineController.prototype, "findByTaskId", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TimelineController.prototype, "findByUserId", null);
__decorate([
    (0, common_1.Get)('project/:projectId'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], TimelineController.prototype, "getByProject", null);
exports.TimelineController = TimelineController = __decorate([
    (0, common_1.Controller)('timelines'),
    __metadata("design:paramtypes", [timeline_service_1.TimelineService])
], TimelineController);
//# sourceMappingURL=timeline.controller.js.map