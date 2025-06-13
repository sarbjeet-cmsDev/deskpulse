import { Document } from 'mongoose';
export declare enum Gender {
    MALE = "male",
    FEMALE = "female",
    OTHER = "other"
}
export declare enum UserRole {
    ADMIN = "admin",
    PROJECT_MANAGER = "project_manager",
    TEAM_MEMBER = "team_member",
    CLIENT = "client",
    EMPLOYEE = "employee"
}
export type UserDocument = User & Document;
export declare class User {
    readonly username: string;
    email: string;
    password: string;
    isActive?: boolean;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
    dateOfBirth?: Date;
    gender?: Gender;
    profileImage?: string;
    roles?: string[];
    userRoles?: UserRole[];
    hobbies?: string[];
    aboutUs?: string;
    jobTitle?: string;
    department?: string;
    managerId?: string;
    joinedDate?: Date;
    lastLogin?: Date;
    timezone?: string;
    languagePreference?: string;
    receiveEmailNotifications?: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any> & User & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
