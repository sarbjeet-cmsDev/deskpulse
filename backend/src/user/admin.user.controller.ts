import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { User } from './user.schema';

@Controller('api/admin/user')
export class AdminUserController {
  constructor(private readonly userService: UserService) {}

  // ✅ Create User
  @Post('create')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  // ✅ Get All Users with Pagination, Search, Sort
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('keyword') keyword?: string,
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc'
  ): Promise<{ data: User[]; total: number }> {
    return this.userService.findAllPaginated(page, limit, keyword, sortOrder);
  }

  // ✅ Get User by ID
  @Get('view/:id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    return this.userService.findOne(id);
  }

  // ✅ Update User by ID
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User | null> {
    return this.userService.UpdateMyDetails(id, updateUserDto); // reusing same method
  }

  // ✅ Delete User by ID
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<User | null> {
    return this.userService.remove(id);
  }

  // ✅ Get Logged-in User Profile
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: any): Promise<any> {
    return this.userService.getmeDetails(req.user.userId);
  }

  // ✅ Update Own Profile
  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateMyDetails(
    @Req() req: any,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User | null> {
    return this.userService.UpdateMyDetails(req.user.userId, updateUserDto);
  }

  @Put(':id/reset-password')
async resetPassword(
  @Param('id') id: string,
  @Body('newPassword') newPassword: string
): Promise<User | null> {
  return this.userService.resetPasswordByAdmin(id, newPassword);
}
}
