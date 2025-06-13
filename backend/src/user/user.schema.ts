import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsString, IsOptional, IsBoolean, IsArray, IsDate, IsEnum, IsNumber } from 'class-validator';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum UserRole {
  ADMIN = 'admin',
  PROJECT_MANAGER = 'project_manager',
  TEAM_MEMBER = 'team_member',
  CLIENT = 'client',
  EMPLOYEE = 'employee',
}

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
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
  @IsArray()
  @IsString({ each: true })
  @Prop({ type: [String], default: [] })
  roles?: string[];

  @IsOptional()
  @IsEnum(UserRole, { each: true })
  @Prop({ type: [String], enum: UserRole, default: ['employee'] })
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
  @Prop()
  jobTitle?: string;

  @IsOptional()
  @IsString()
  @Prop()
  department?: string;

  @IsOptional()
  @IsString()
  @Prop()
  managerId?: string;

  @IsOptional()
  @IsDate()
  @Prop()
  joinedDate?: Date;

  @IsOptional()
  @IsDate()
  @Prop()
  lastLogin?: Date;

  @IsOptional()
  @IsString()
  @Prop()
  timezone?: string;

  @IsOptional()
  @IsString()
  @Prop()
  languagePreference?: string;

  @IsOptional()
  @IsBoolean()
  @Prop({ default: true })
  receiveEmailNotifications?: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
