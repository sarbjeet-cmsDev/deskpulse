import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import { User, UserDocument } from "./user.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { checkUserExists, comparePassword, hashPassword } from "./user.helper";
import { Types } from "mongoose";
import { log } from "console";
@Injectable()
export class UserService {
  static create(adminData: any) {
    throw new Error("Method not implemented.");
  }
  constructor(
    @InjectModel("User") private readonly userModel: Model<UserDocument>
  ) {}
  async create(createUserDto: Partial<User>): Promise<User> {
    await checkUserExists(
      this.userModel,
      createUserDto.email,
      createUserDto.username
    );
    if (createUserDto.password) {
      createUserDto.password = await hashPassword(createUserDto.password);
    }
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async comparePassword(password: string, userId: string): Promise<boolean> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) return false;
    return comparePassword(password, user.password);
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async remove(id: string): Promise<UserDocument | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async getmeDetails(userId: string): Promise<any | null> {
    const user = await this.userModel.findById(userId).exec();
    const { password: _, __v, ...safeUser } = user.toObject();
    return safeUser;
  }

  async searchUsers(keyword: string, roles?: string): Promise<UserDocument[]> {
    const regex = new RegExp(keyword, "i");
    // return this.userModel.find({
    //     $or: [
    //         { name: regex },
    //         { email: regex }
    //     ]
    // });

    const filters: any = {
      roles: "user",
      $or: [
        { firstName: { $regex: regex } }, // Search by first name
        { lastName: { $regex: regex } }, // Search by last name
        { email: { $regex: regex } }, // Search by email
      ],
      // $or: [
      //   { name: regex },
      //   { email: regex },
      // ]
    };

    if (roles) {
      filters["role"] = roles;
    }

    return this.userModel.find(filters).exec();
  }

  async UpdateMyDetails(
    id: string,
    updateUserDto: Partial<User>
  ): Promise<UserDocument | null> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true, runValidators: true })
      .exec();
    if (!updatedUser) {
      throw new ConflictException("User not found");
    }
    return updatedUser;
  }
  async resetPasswordByAdmin(
    id: string,
    newPassword: string
  ): Promise<UserDocument | null> {
    const hashedPassword = await hashPassword(newPassword);
    return this.userModel
      .findByIdAndUpdate(id, { password: hashedPassword }, { new: true })
      .exec();
  }
  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    keyword?: string,
    sortField: string = "createdAt",
    sortOrder: "asc" | "desc" = "asc"
  ): Promise<{ data: UserDocument[]; total: number }> {
    const skip = (page - 1) * limit;

    const query: any = {};
    if (keyword) {
      query.$or = [
        { firstName: { $regex: keyword, $options: "i" } },
        { lastName: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      this.userModel
        .find(query)
        .sort({ [sortField]: sortOrder === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.userModel.countDocuments(query),
    ]);

    return { data: users, total };
  }

  async validateToken(user: { userId: string; email: string }) {
    const foundUser = await this.userModel.findById(user.userId).lean();
    if (!foundUser) {
      throw new UnauthorizedException("User not found or token invalid");
    }

    return {
      valid: true,
      user,
    };
  }

  async updateUserAvatar(
    userId: string,
    imageUrl: string
  ): Promise<UserDocument | null> {
    const updated = await this.userModel.findByIdAndUpdate(
      userId,
      { profileImage: imageUrl },
      { new: true }
    );
    return updated;
  }
}
