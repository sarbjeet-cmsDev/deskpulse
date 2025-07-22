import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./user.schema";
import { Seeder, DataFactory } from "nestjs-seeder";
import { checkUserExists, comparePassword, hashPassword } from './user.helper';

@Injectable()
export class UserSeeder implements Seeder {
  constructor(@InjectModel(User.name) private readonly user: Model<User>) {}

  async seed(): Promise<any> {
    // Insert into the database.
    return this.user.insertMany([
        {
            username: "admin",
            email: "admin@gmail.com",
            firstName:"admin",
            lastName:'testing',
            password: await hashPassword("admin"),
            isActive: true,
            roles: ["admin"],
            userRoles: ["admin"],
            hobbies: ["reading", "writing", "coding"],
        },
        {
          username: "user",
          firstName:"User",
          lastName:'testing',
          email: "user@gmail.com",
          password: await hashPassword("admin"),
          isActive: true,
          roles: ["user"],
          userRoles: ["user"],
          hobbies: ["reading", "writing", "coding"],
      }
    ]);
  }

  async drop(): Promise<any> {
    return this.user.deleteMany({});
  }
}