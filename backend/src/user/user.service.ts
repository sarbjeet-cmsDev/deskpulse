import { Injectable, ConflictException } from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {  checkUserExists, comparePassword, hashPassword } from './user.helper';
import { Types } from 'mongoose';
@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<UserDocument>,
    ) { }
    async create(createUserDto: Partial<User>): Promise<User> {
        await checkUserExists(this.userModel, createUserDto.email, createUserDto.username);
        if (createUserDto.password) {
            createUserDto.password = await hashPassword(createUserDto.password);
        }
        const createdUser = new this.userModel(createUserDto);
        return createdUser.save();
    }

    

    async comparePassword(password: string, userId: string): Promise<boolean> {
        const user = await this.userModel.findById(userId).exec();
        if (!user) return false;
        return comparePassword(password, user.password);
    }

    async findAll(): Promise<UserDocument[]> {
        return this.userModel.find().exec();
    }
    async findOne(id: string): Promise<UserDocument | null> {
        return this.userModel.findById(id).exec();
    }

    async remove(id: string): Promise<UserDocument | null> {
        return this.userModel.findByIdAndDelete(id).exec();
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async getmeDetails(userId: string): Promise<any | null> {
        const user = await this.userModel.findById(userId).exec();
        const { password: _, __v,  ...safeUser } = user.toObject();
        return safeUser;
    }


    async UpdateMyDetails(id: string, updateUserDto: Partial<User>): Promise<UserDocument | null> {
        const updatedUser = await this.userModel.findByIdAndUpdate(
            id,
            updateUserDto,
            { new: true, runValidators: true },
        ).exec();
        if (!updatedUser) {
            throw new ConflictException('User not found');
        }
        return updatedUser;
    }

}

