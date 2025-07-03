import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { CreateUserDto, UpdateUserDto } from "./user.dto";
import { User } from "./user.schema";
import { UserService } from "./user.service";
import { UseGuards, Req } from "@nestjs/common";
import { JwtAuthGuard } from "src/guard/jwt-auth.guard";
import { UseInterceptors, UploadedFile } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerOptions } from "../shared/multer.config";

@Controller("api/user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("create")
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get("view/:id")
  async findOne(@Param("id") id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async getMe(@Req() req: any): Promise<User> {
    return this.userService.getmeDetails(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put("me")
  async UpdateMyDetails(
    @Req() req: any,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.userService.UpdateMyDetails(req.user.userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("validate-token")
  async validateToken(@Req() req: any) {
    const user = req.user as { userId: string; email: string };
    return this.userService.validateToken(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post("upload-avatar")
  @UseInterceptors(FileInterceptor("file", multerOptions))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any
  ) {
    const userId = req.user.userId;

    const fileUrl = `/uploads/${file.filename}`;

    return this.userService.updateUserAvatar(userId, fileUrl);
  }
}
