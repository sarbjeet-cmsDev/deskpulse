import { LoginDto } from './auth.dto';
import { User } from 'src/user/user.schema';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    LoginUser(loginDto: LoginDto): Promise<User>;
}
