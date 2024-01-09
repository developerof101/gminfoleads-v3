import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleCodes } from '../../modules/system-roles/system-role.entity';
import { HttpExceptionMessage } from '../../utils/HttpExceptionFilter';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    let roles: RoleCodes[] = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    ) as RoleCodes[];
    if (!roles) return true;

    // Always allow super admin
    roles = [...roles, RoleCodes.SUPER_ADMIN];

    const request = context.switchToHttp().getRequest();
    const { user } = request;
    const hasRole = () =>
      user.roles.some((role: RoleCodes) => roles.includes(role));
    return user && user.roles && hasRole();
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw new HttpExceptionMessage(
        HttpStatus.UNAUTHORIZED,
        'Invalid token 2',
      );
    }
    return user;
  }
}
