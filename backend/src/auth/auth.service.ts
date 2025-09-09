import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { User, UserDocument } from "src/user/user.schema";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import {
  checkUserExists,
  hashPassword,
} from "../user/user.helper";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import * as jwt from "jsonwebtoken";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel("User") private readonly userModel: Model<UserDocument>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private eventEmitter: EventEmitter2
  ) {}

  async login({ email, password }: Partial<User>): Promise<any> {
    if (!email || !password) {
      throw new BadRequestException("Email and password are required.");
    }

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException("Invalid email.");
    }

    const isPasswordValid = await this.userService.comparePassword(
      password,
      user.id
    );
    if (!isPasswordValid) {
      throw new BadRequestException("Invalid password.");
    }

    if (!user.isActive) {
      throw new NotFoundException(
        "Account not verified! Please check your email and verify account."
      );
    }
    const payload = {
      sub: user._id,
      email: user.email,
      roles: user.roles,
      userRoles: user.userRoles,
    };
    const token = await this.jwtService.signAsync(payload);
    return {
      message: "Login successful.",
      access_token: token,

      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.roles,
      },
    };
  }

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
    const userData: any = await createdUser.save();

    const token = jwt.sign({ id: userData._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    if (userData) {
      this.eventEmitter.emit("user.account.verification", {
        userObj: userData,
        token: token,
      });
    }
    return userData;
  }

  async verifyAccount(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        id: string;
      };
      const user = await this.userModel.findById(decoded.id);
      if (!user) {
        throw new NotFoundException("User not found");
      }
      if (user?.isActive) {
          return 'already verified'
        }
      user.isActive = true;
      await user.save();
      if (user) {
        this.eventEmitter.emit("user.verified-notification", {
          userObj: user,
          token: token,
        });
      }

      return true;
    } catch (e) {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }

  async requestPasswordReset(email: string): Promise<string> {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException("User not found");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    if (user) {
      this.eventEmitter.emit("request.resetPassword.notification", {
        userObj: user,
        token: token,
      });
    }

    return "Reset password email sent.";
  }

  async resetPassword(
    id: string,
    token: string,
    newPassword: string
  ): Promise<string> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException("User not found");

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        id: string;
      };
      if (decoded.id !== id) {
        throw new UnauthorizedException("Token does not match user");
      }
    } catch (e) {
      throw new UnauthorizedException("Invalid or expired token");
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    if (user) {
      this.eventEmitter.emit("passwordReset.done.notifiction", {
        userObj: user,
        token: token,
      });
    }
    return "Password reset successfully.";
  }

  async resendVerifyUser(email: string): Promise<string> {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException("User not found");
    if (user.isActive) throw new ConflictException("Your Account is Already Verified");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    if (user) {
      this.eventEmitter.emit("user.account.verification", {
        userObj: user,
        token: token,
      });
    }

    return "Verifiction email sent successfully.";
  }
}
