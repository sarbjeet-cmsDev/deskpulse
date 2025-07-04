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
exports.UpdateNotificationDto = exports.CreateNotificationDto = void 0;
const class_validator_1 = require("class-validator");
const mongoose_1 = require("mongoose");
class CreateNotificationDto {
}
exports.CreateNotificationDto = CreateNotificationDto;
__decorate([
    (0, class_validator_1.IsMongoId)({ message: 'User must be a valid Mongo ID' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'User is required' }),
    __metadata("design:type", mongoose_1.Schema.Types.ObjectId)
], CreateNotificationDto.prototype, "user", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Content must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Content is required' }),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'is_read must be a boolean' }),
    __metadata("design:type", Boolean)
], CreateNotificationDto.prototype, "is_read", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'redirect_url is required' }),
    (0, class_validator_1.IsUrl)({}, { message: 'redirect_url must be a valid URL' }),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "redirect_url", void 0);
class UpdateNotificationDto {
}
exports.UpdateNotificationDto = UpdateNotificationDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'is_read must be a boolean' }),
    __metadata("design:type", Boolean)
], UpdateNotificationDto.prototype, "is_read", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({}, { message: 'redirect_url must be a valid URL' }),
    __metadata("design:type", String)
], UpdateNotificationDto.prototype, "redirect_url", void 0);
//# sourceMappingURL=notification.dto.js.map