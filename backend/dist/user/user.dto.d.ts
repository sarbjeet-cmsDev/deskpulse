export declare enum Gender {
    MALE = "male",
    FEMALE = "female",
    OTHER = "other"
}
export declare enum UserRole {
    ADMIN = "admin",
    PROJECT_MANAGER = "project_manager",
    TEAM_MEMBER = "team_member",
    CLIENT = "client"
}
export declare class CreateUserDto {
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
    readonly timezone?: string;
    readonly languagePreference?: string;
    receiveEmailNotifications?: boolean;
}
export declare class UpdateUserDto extends CreateUserDto {
}
