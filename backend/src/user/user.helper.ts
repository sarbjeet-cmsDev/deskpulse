import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}



export async function checkUserExists(userModel: any, email: string, username: string): Promise<void> {
    if (await userModel.exists({ $or: [{ email }, { username }] })) {
        throw new ConflictException('User with this email or username already exists');
    }
}

export async function comparePassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

export default async function fetched_by_user_email(userModel: any, email: string) {
    return userModel.findOne({ email });
}

