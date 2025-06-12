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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTimelineDto = exports.CreateTimelineDto = void 0;
const class_validator_1 = require("class-validator");
const mongoose_1 = require("mongoose");
class CreateTimelineDto {
}
exports.CreateTimelineDto = CreateTimelineDto;
__decorate([
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Task is required.' }),
    __metadata("design:type", mongoose_1.Schema.Types.ObjectId)
], CreateTimelineDto.prototype, "task", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Date is required.' }),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateTimelineDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'User is required.' }),
    __metadata("design:type", mongoose_1.Schema.Types.ObjectId)
], CreateTimelineDto.prototype, "user", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Time spent is required.' }),
    __metadata("design:type", String)
], CreateTimelineDto.prototype, "time_spent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: false }),
    __metadata("design:type", String)
], CreateTimelineDto.prototype, "comments", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTimelineDto.prototype, "is_active", void 0);
class UpdateTimelineDto {
}
exports.UpdateTimelineDto = UpdateTimelineDto;
__decorate([
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", mongoose_1.Schema.Types.ObjectId)
], UpdateTimelineDto.prototype, "task", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], UpdateTimelineDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", mongoose_1.Schema.Types.ObjectId)
], UpdateTimelineDto.prototype, "user", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTimelineDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateTimelineDto.prototype, "time_spent", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateTimelineDto.prototype, "is_active", void 0);
//# sourceMappingURL=timeline.dto.js.map