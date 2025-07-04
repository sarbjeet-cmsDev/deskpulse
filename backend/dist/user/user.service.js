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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const user_helper_1 = require("./user.helper");
let UserService = class UserService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(createUserDto) {
        await (0, user_helper_1.checkUserExists)(this.userModel, createUserDto.email, createUserDto.username);
        if (createUserDto.password) {
            createUserDto.password = await (0, user_helper_1.hashPassword)(createUserDto.password);
        }
        const createdUser = new this.userModel(createUserDto);
        return createdUser.save();
    }
    async comparePassword(password, userId) {
        const user = await this.userModel.findById(userId).exec();
        if (!user)
            return false;
        return (0, user_helper_1.comparePassword)(password, user.password);
    }
    async findAll() {
        return this.userModel.find().exec();
    }
    async findOne(id) {
        return this.userModel.findById(id).exec();
    }
    async remove(id) {
        return this.userModel.findByIdAndDelete(id).exec();
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email }).exec();
    }
    async getmeDetails(userId) {
        const user = await this.userModel.findById(userId).exec();
        const _a = user.toObject(), { password: _, __v } = _a, safeUser = __rest(_a, ["password", "__v"]);
        return safeUser;
    }
    async searchUsers(keyword) {
        const regex = new RegExp(keyword, 'i');
        return this.userModel.find({
            $or: [
                { name: regex },
                { email: regex }
            ]
        });
    }
    async UpdateMyDetails(id, updateUserDto) {
        const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true, runValidators: true }).exec();
        if (!updatedUser) {
            throw new common_1.ConflictException('User not found');
        }
        return updatedUser;
    }
    async resetPasswordByAdmin(id, newPassword) {
        const hashedPassword = await (0, user_helper_1.hashPassword)(newPassword);
        return this.userModel.findByIdAndUpdate(id, { password: hashedPassword }, { new: true }).exec();
    }
    async findAllPaginated(page = 1, limit = 10, keyword, sortField = 'createdAt', sortOrder = 'asc') {
        const skip = (page - 1) * limit;
        const query = {};
        if (keyword) {
            query.$or = [
                { firstName: { $regex: keyword, $options: 'i' } },
                { lastName: { $regex: keyword, $options: 'i' } },
                { email: { $regex: keyword, $options: 'i' } },
            ];
        }
        const [users, total] = await Promise.all([
            this.userModel
                .find(query)
                .sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.userModel.countDocuments(query),
        ]);
        return { data: users, total };
    }
    async validateToken(user) {
        const foundUser = await this.userModel.findById(user.userId).lean();
        if (!foundUser) {
            throw new common_1.UnauthorizedException('User not found or token invalid');
        }
        return {
            valid: true,
            user
        };
    }
    async updateUserAvatar(userId, imageUrl) {
        const updated = await this.userModel.findByIdAndUpdate(userId, { profileImage: imageUrl }, { new: true });
        return updated;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_1.Model])
], UserService);
//# sourceMappingURL=user.service.js.map