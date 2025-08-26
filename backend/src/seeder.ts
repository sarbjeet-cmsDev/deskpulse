import { seeder } from "nestjs-seeder";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./user/user.schema";
import { UserSeeder } from "./user/user.seeder";
import { ConfigModule, ConfigService } from '@nestjs/config';

seeder({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
}).run([UserSeeder]);