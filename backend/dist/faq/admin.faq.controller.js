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
exports.AdminFaqController = void 0;
const common_1 = require("@nestjs/common");
const faq_service_1 = require("./faq.service");
let AdminFaqController = class AdminFaqController {
    constructor(faqService) {
        this.faqService = faqService;
    }
    async getAllFaqs(page = 1, limit = 10, keyword, sortOrder = 'asc') {
        return await this.faqService.all(page, limit, keyword, sortOrder);
    }
    async getFaq(id) {
        const faq = await this.faqService.findById(id);
        if (!faq) {
            throw new common_1.NotFoundException('FAQ not found');
        }
        return faq;
    }
    async createFaq(faqData) {
        try {
            return await this.faqService.create(faqData);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async updateFaq(id, faqData) {
        const faq = await this.faqService.findById(id);
        if (!faq) {
            throw new common_1.NotFoundException('FAQ not found');
        }
        try {
            return await this.faqService.update(id, faqData);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async deleteFaq(id) {
        const faq = await this.faqService.findById(id);
        if (!faq) {
            throw new common_1.NotFoundException('FAQ not found');
        }
        await this.faqService.delete(id);
    }
};
exports.AdminFaqController = AdminFaqController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('keyword')),
    __param(3, (0, common_1.Query)('sortOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], AdminFaqController.prototype, "getAllFaqs", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminFaqController.prototype, "getFaq", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminFaqController.prototype, "createFaq", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminFaqController.prototype, "updateFaq", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminFaqController.prototype, "deleteFaq", null);
exports.AdminFaqController = AdminFaqController = __decorate([
    (0, common_1.Controller)('api/admin/faq'),
    __metadata("design:paramtypes", [faq_service_1.FaqService])
], AdminFaqController);
//# sourceMappingURL=admin.faq.controller.js.map