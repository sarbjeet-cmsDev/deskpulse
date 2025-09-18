import { IsString, IsOptional, IsNumber, IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateWorkSpaceDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsNumber()
    status: number

    @IsOptional()
    role?: string
}

export class UpdateWorkSpaceDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsNumber()
    status: number
}

export class InviteMemberDto {
    @IsEmail()
    email: string;

    @IsEnum(['admin', 'user'], {
        message: 'userType must be either admin or user',
    })
    userType: 'admin' | 'user';

}


export class AcceptInviteDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    workspaceId: string;

    @IsNotEmpty()
    role: string;

}