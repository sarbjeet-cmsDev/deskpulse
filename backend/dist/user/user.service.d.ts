import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
export declare class UserService {
    private readonly userModel;
    constructor(userModel: Model<UserDocument>);
    create(createUserDto: Partial<User>): Promise<User>;
    comparePassword(password: string, userId: string): Promise<boolean>;
    findAll(): Promise<UserDocument[]>;
    findOne(id: string): Promise<UserDocument | null>;
    remove(id: string): Promise<UserDocument | null>;
    findByEmail(email: string): Promise<UserDocument | null>;
    getmeDetails(userId: string): Promise<any | null>;
    UpdateMyDetails(id: string, updateUserDto: Partial<User>): Promise<UserDocument | null>;
}
