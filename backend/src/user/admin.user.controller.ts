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
  async create(@Body() createUserDto: CreateUserDto): Promise<any> {
    const user = await this.userService.create(createUserDto);
    return {
      message: 'User created successfully!',
      data: user,
    };
  }

  // ✅ Get All Users with Pagination, Search, Sort
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('keyword') keyword?: string,
     @Query('sortField') sortField: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc'
  ): Promise<{ data: User[]; total: number }> {
    return this.userService.findAllPaginated(page, limit, keyword, sortOrder);
  }

  // ✅ Get User by ID
  @Get('view/:id')
  async findOne(@Param('id') id: string): Promise<any> {
    const user = await this.userService.findOne(id);
    return {
      message: 'User fetched successfully!',
      data: user,
    };
  }

  // ✅ Update User by ID
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<any> {
    const updatedUser = await this.userService.UpdateMyDetails(id, updateUserDto);
    return {
      message: 'User updated successfully!',
      data: updatedUser,
    };
  }

  // ✅ Delete User by ID
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<any> {
    const deletedUser = await this.userService.remove(id);
    return {
      message: 'User deleted successfully!',
      data: deletedUser,
    };
  }

  // ✅ Get Logged-in User Profile
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: any): Promise<any> {
    const profile = await this.userService.getmeDetails(req.user.userId);
    return {
      message: 'User profile fetched!',
      data: profile,
    };
  }

  // ✅ Update Own Profile
  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateMyDetails(
    @Req() req: any,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<any> {
    const updated = await this.userService.UpdateMyDetails(req.user.userId, updateUserDto);
    return {
      message: 'Profile updated successfully!',
      data: updated,
    };
  }

  // ✅ Reset Password by Admin
  @Put(':id/reset-password')
  async resetPassword(
    @Param('id') id: string,
    @Body('newPassword') newPassword: string
  ): Promise<any> {
    const user = await this.userService.resetPasswordByAdmin(id, newPassword);
    return {
      message: 'Password reset successfully!',
      data: user,
    };
  }

  @Get('search')
async search(@Query('q') query: string) {
  return this.userService.searchUsers(query);
}
}
