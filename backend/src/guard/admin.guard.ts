import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class AdminGuard extends JwtAuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isAuthenticated = (await super.canActivate(context)) as boolean;
        if (!isAuthenticated) {
            throw new UnauthorizedException('Unauthorized: Invalid token');
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new UnauthorizedException('Unauthorized: No user found');
        }
        const allRoles = [...new Set([...(user.roles || []), ...(user.userRoles || [])])];

        const isAdmin = allRoles.includes('admin');

        if (!isAdmin) {
            throw new UnauthorizedException('Unauthorized: Admins only');
        }
        return true;
    }
}
