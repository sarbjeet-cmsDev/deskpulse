import { JwtService } from '@nestjs/jwt';
export declare class JwtTokenService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    signToken(payload: any): Promise<string>;
    verifyToken(token: string): Promise<any>;
}
