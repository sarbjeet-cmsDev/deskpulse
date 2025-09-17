import { Prop } from "@nestjs/mongoose";
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsDate,
  IsEnum,
} from "class-validator";

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export class CreateUserDto {
  @IsString()
  @Prop({ required: true, unique: true, immutable: true })
  readonly username: string;

  @IsString()
  @Prop({ required: true, unique: true })
  email: string;

  @IsString()
  @Prop({ required: true })
  password: string;

  @IsOptional()
  @IsBoolean()
  @Prop({ default: false })
  isActive?: boolean;

  @IsOptional()
  @IsString()
  @Prop()
  firstName?: string;

  @IsOptional()
  @IsString()
  @Prop()
  lastName?: string;

  @IsOptional()
  @IsString()
  @Prop()
  phone?: string;

  @IsOptional()
  @IsString()
  @Prop()
  address?: string;

  @IsOptional()
  @IsString()
  @Prop()
  city?: string;

  @IsOptional()
  @IsString()
  @Prop()
  state?: string;

  @IsOptional()
  @IsString()
  @Prop()
  country?: string;

  @IsOptional()
  @IsString()
  @Prop()
  zipCode?: string;

  @IsOptional()
  @IsDate()
  @Prop()
  dateOfBirth?: Date;

  @IsOptional()
  @IsEnum(Gender)
  @Prop({ enum: Gender })
  gender?: Gender;

  @IsOptional()
  @IsString()
  @Prop()
  profileImage?: string;

  @IsOptional()
  @IsString({ each: true })
  @Prop({ type: [String], default: [] })
  roles?: string[];

  @IsOptional()
  @IsEnum(UserRole, { each: true })
  @Prop({ type: [String], required: true })
  userRoles?: UserRole[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Prop({ type: [String], default: [] })
  hobbies?: string[];

  @IsOptional()
  @IsString()
  @Prop()
  aboutUs?: string;

  @IsOptional()
  @IsString()
  @Prop({ required: true })
  jobTitle?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @Prop({ required: true })
  @IsOptional()
  managerId?: string;

  @IsOptional()
  @IsDate()
  @Prop({ immutable: true })
  joinedDate?: Date;

  @IsOptional()
  @IsDate()
  @Prop()
  lastLogin?: Date;

  @IsOptional()
  @IsString()
  @Prop({ immutable: true })
  readonly timezone?: string;

  @IsOptional()
  @IsString()
  @Prop({ immutable: true })
  readonly languagePreference?: string;

  @IsOptional()
  @IsBoolean()
  @Prop()
  receiveEmailNotifications?: boolean;
}

export class UpdateUserDto {
  @IsString()
  @Prop({ required: true, unique: true, immutable: true })
  readonly username: string;

  @IsString()
  @Prop({ required: true, unique: true })
  email: string;

  @IsOptional()
  @IsBoolean()
  @Prop({ default: false })
  isActive?: boolean;

  @IsOptional()
  @IsString()
  @Prop()
  firstName?: string;

  @IsOptional()
  @IsString()
  @Prop()
  lastName?: string;

  @IsOptional()
  @IsString()
  @Prop()
  phone?: string;

  @IsOptional()
  @IsString()
  @Prop()
  address?: string;

  @IsOptional()
  @IsString()
  @Prop()
  city?: string;

  @IsOptional()
  @IsString()
  @Prop()
  state?: string;

  @IsOptional()
  @IsString()
  @Prop()
  country?: string;

  @IsOptional()
  @IsString()
  @Prop()
  zipCode?: string;

  @IsOptional()
  @Prop({ type: Date })
  dateOfBirth?: Date;

  @IsOptional()
  @IsEnum(Gender)
  @Prop({ enum: Gender })
  gender?: Gender;

  @IsOptional()
  @IsString()
  @Prop()
  profileImage?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Prop({ type: [String], default: [] })
  roles?: string[];
  @IsOptional()
  @IsEnum(UserRole, { each: true })
  @Prop({ type: [String], required: true })
  userRoles?: UserRole[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Prop({ type: [String], default: [] })
  hobbies?: string[];

  @IsOptional()
  @IsString()
  @Prop()
  aboutUs?: string;

  @IsOptional()
  @IsString()
  @Prop({ required: true })
  jobTitle?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @Prop({ required: true })
  @IsOptional()
  managerId?: string;

  @IsOptional()
  @IsDate()
  @Prop({ immutable: true })
  joinedDate?: Date;

  @IsOptional()
  @IsDate()
  @Prop()
  lastLogin?: Date;

  @IsOptional()
  @IsString()
  @Prop({ immutable: true })
  readonly timezone?: string;

  @IsOptional()
  @IsString()
  @Prop({ immutable: true })
  readonly languagePreference?: string;

  @IsOptional()
  @IsBoolean()
  @Prop()
  receiveEmailNotifications?: boolean;
}
