export declare function hashPassword(password: string): Promise<string>;
export declare function checkUserExists(userModel: any, email: string, username: string): Promise<void>;
export declare function comparePassword(password: string, hashedPassword: string): Promise<boolean>;
export default function fetched_by_user_email(userModel: any, email: string): Promise<any>;
