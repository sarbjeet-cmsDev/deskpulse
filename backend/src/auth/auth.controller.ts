import {
  Body,
  Controller,
  Post,
  Res,
} from '@nestjs/common';
import { LoginDto } from './auth.dto';
import { User } from 'src/user/user.schema';
import { AuthService } from './auth.service';




@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async LoginUser(@Body() loginDto: LoginDto): Promise<User> {
    const result = await this.authService.login(loginDto);
    return result;
  }
}
