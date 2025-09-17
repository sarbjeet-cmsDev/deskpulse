import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./user.schema";
import { Seeder } from "nestjs-seeder";
import { hashPassword } from "./user.helper";

@Injectable()
export class UserSeeder implements Seeder {
  constructor(@InjectModel(User.name) private readonly user: Model<User>) { }

  async seed(): Promise<any> {
    const users = [
      {
        username: "admin",
        email: "bb_projectadmin@yopmail.com",
        firstName: "admin",
        lastName: "testing",
        password: await hashPassword("admin"),
        isActive: true,
        roles: ["admin"],
        userRoles: ["admin"],
        hobbies: ["reading", "writing", "coding"],
      },
      {
        username: "user",
        firstName: "User",
        lastName: "testing",
        email: "user@gmail.com",
        password: await hashPassword("admin"),
        isActive: true,
        roles: ["user"],
        userRoles: ["user"],
        hobbies: ["reading", "writing", "coding"],
      },
    ];

    const inserted = [];

    for (const u of users) {
      const exists = await this.user.findOne({ email: u.email });
      if (exists) {
        console.warn(`User with email ${u.email} already exists`);
        continue;
      }
      const created = await this.user.create(u);
      inserted.push(created);
    }

    return inserted;
  }

  async drop(): Promise<any> {
    return this.user.deleteMany({});
  }
}
