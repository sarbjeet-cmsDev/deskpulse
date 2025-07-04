import { CreateUserDto, UpdateUserDto } from "./user.dto";
import { User } from "./user.schema";
import { UserService } from "./user.service";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    getMe(req: any): Promise<User>;
    UpdateMyDetails(req: any, updateUserDto: UpdateUserDto): Promise<User>;
    validateToken(req: any): Promise<{
        valid: boolean;
        user: {
            userId: string;
            email: string;
        };
    }>;
    uploadAvatar(file: Express.Multer.File, req: any): Promise<import("./user.schema").UserDocument>;
}
