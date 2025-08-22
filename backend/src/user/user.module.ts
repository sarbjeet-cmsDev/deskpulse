import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSchema } from './user.schema';
import { AdminUserController } from './admin.user.controller';
@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [UserController, AdminUserController],
  providers: [UserService],
  exports: [UserService,MongooseModule], // <- This allows other modules to use UserService
})
export class UserModule {}
