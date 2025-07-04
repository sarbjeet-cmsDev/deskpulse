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
    searchUsers(keyword: string): Promise<UserDocument[]>;
    UpdateMyDetails(id: string, updateUserDto: Partial<User>): Promise<UserDocument | null>;
    resetPasswordByAdmin(id: string, newPassword: string): Promise<UserDocument | null>;
    findAllPaginated(page?: number, limit?: number, keyword?: string, sortField?: string, sortOrder?: 'asc' | 'desc'): Promise<{
        data: UserDocument[];
        total: number;
    }>;
    validateToken(user: {
        userId: string;
        email: string;
    }): Promise<{
        valid: boolean;
        user: {
            userId: string;
            email: string;
        };
    }>;
    updateUserAvatar(userId: string, imageUrl: string): Promise<UserDocument | null>;
}
