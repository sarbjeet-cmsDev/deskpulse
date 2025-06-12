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
exports.FaqService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let FaqService = class FaqService {
    constructor(faqModel) {
        this.faqModel = faqModel;
    }
    async all(page = 1, limit = 10, keyword, sortOrder = 'asc') {
        const skip = (page - 1) * limit;
        let query = {};
        if (keyword) {
            query = {
                $or: [
                    { title: { $regex: keyword, $options: 'i' } },
                    { content: { $regex: keyword, $options: 'i' } },
                    { category: { $regex: keyword, $options: 'i' } }
                ]
            };
        }
        const total = await this.faqModel.countDocuments(query);
        const data = await this.faqModel
            .find(query)
            .sort({ sort_order: sortOrder === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limit)
            .exec();
        return {
            data,
            total
        };
    }
    async create(faqData) {
        const existingFaq = await this.faqModel.findOne({ sort_order: faqData.sort_order });
        if (existingFaq) {
            throw new common_1.ConflictException('Sort order already exists');
        }
        const createdFaq = new this.faqModel(faqData);
        return await createdFaq.save();
    }
    async update(id, faqData) {
        if (faqData.sort_order) {
            const existingFaq = await this.faqModel.findOne({
                sort_order: faqData.sort_order,
                _id: { $ne: id }
            });
            if (existingFaq) {
                throw new common_1.ConflictException('Sort order already exists');
            }
        }
        const updatedFaq = await this.faqModel
            .findByIdAndUpdate(id, faqData, { new: true })
            .exec();
        if (!updatedFaq) {
            throw new common_1.NotFoundException('FAQ not found');
        }
        return updatedFaq;
    }
    async delete(id) {
        const result = await this.faqModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException('FAQ not found');
        }
    }
    async findById(id) {
        const faq = await this.faqModel.findById(id).exec();
        if (!faq) {
            throw new common_1.NotFoundException('FAQ not found');
        }
        return faq;
    }
};
exports.FaqService = FaqService;
exports.FaqService = FaqService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Faq')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FaqService);
//# sourceMappingURL=faq.service.js.map