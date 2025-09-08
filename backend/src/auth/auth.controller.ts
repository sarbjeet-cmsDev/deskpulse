import {
  Body,
  Controller,
  Post,
  Res,
  Get,
  Param,
  BadRequestException
} from '@nestjs/common';
import { CreateDto, LoginDto } from './auth.dto';
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

   @Post("create")
    async create(@Body() createDto: CreateDto): Promise<any> {
      const user = await this.authService.create(createDto);
      return {
        message: "A verification link has been sent to your email. Please check your inbox and verify your account.",
        data: user,
      };
    }

  @Get('verify-account/:token')
  async verify(
    @Param('token') token: string
  ) {
    try {
      return await this.authService.verifyAccount(token);
    } catch (err) {
      throw new BadRequestException((err as Error).message);
    }
  }

  @Post('request-reset-password')
  async requestReset(@Body('email') email: string) {
    try {
      const message = await this.authService.requestPasswordReset(email);
      return { message };
    } catch (err) {
      throw new BadRequestException((err as Error).message);
    }
  }

  @Post('reset-password/:id/:token')
  async resetPassword(
    @Param('id') id: string,
    @Param('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    try {
      const message = await this.authService.resetPassword(id, token, newPassword);
      return { message };
    } catch (err) {
      throw new BadRequestException((err as Error).message);
    }
  }

  @Post('resend-verify')
  async resendVerify(@Body('email') email: string) {
    try {
      const message = await this.authService.resendVerifyUser(email);
      return { message };

    } catch (err) {
      throw new BadRequestException((err as Error).message);
    }
  }
}
