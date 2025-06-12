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
exports.DayReportSchema = exports.DayReport = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let DayReport = class DayReport {
};
exports.DayReport = DayReport;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], DayReport.prototype, "user", void 0);
__decorate([
    (0, mongoose_1.Prop)([{
            task: { type: mongoose_2.Schema.Types.ObjectId, ref: 'Task', required: true },
            time_spent: { type: Number, required: true, min: 0 },
            comment: { type: String, required: false },
            blocker: { type: String, required: false }
        }]),
    __metadata("design:type", Array)
], DayReport.prototype, "tasks", void 0);
__decorate([
    (0, mongoose_1.Prop)([{
            task: { type: mongoose_2.Schema.Types.ObjectId, ref: 'Task', required: true },
            time_spent: { type: Number, required: true, min: 0 },
            comment: { type: String, required: false },
            blocker: { type: String, required: false }
        }]),
    __metadata("design:type", Array)
], DayReport.prototype, "next_tasks", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], DayReport.prototype, "comment", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], DayReport.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], DayReport.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], DayReport.prototype, "updatedAt", void 0);
exports.DayReport = DayReport = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], DayReport);
exports.DayReportSchema = mongoose_1.SchemaFactory.createForClass(DayReport);
//# sourceMappingURL=dayreport.schema.js.map