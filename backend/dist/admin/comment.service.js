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
exports.CommentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const comment_schema_1 = require("./comment.schema");
const task_service_1 = require("../task/task.service");
const comment_helper_1 = require("./comment.helper");
let CommentService = class CommentService {
    constructor(commentModel, taskService) {
        this.commentModel = commentModel;
        this.taskService = taskService;
    }
    async create(createCommentDto) {
        await (0, comment_helper_1.validateTaskId)(this.taskService, createCommentDto.task.toString());
        const createdComment = new this.commentModel(createCommentDto);
        return createdComment.save();
    }
    async findAll() {
        return this.commentModel.find().exec();
    }
    async findOne(id) {
        return this.commentModel.findById(id).exec();
    }
    async findByTask(taskId) {
        return this.commentModel.find({ task: taskId }).exec();
    }
    async findByParentComment(parentId) {
        return this.commentModel.find({ parent_comment: parentId }).exec();
    }
    async update(id, updateCommentDto) {
        if (updateCommentDto.task) {
            await (0, comment_helper_1.validateTaskId)(this.taskService, updateCommentDto.task.toString());
        }
        return this.commentModel
            .findByIdAndUpdate(id, updateCommentDto, { new: true })
            .exec();
    }
    async remove(id) {
        return this.commentModel.findByIdAndDelete(id).exec();
    }
    async findByUser(userId) {
        return this.commentModel.find({ created_by: userId }).exec();
    }
};
exports.CommentService = CommentService;
exports.CommentService = CommentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(comment_schema_1.Comment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        task_service_1.TaskService])
], CommentService);
//# sourceMappingURL=comment.service.js.map