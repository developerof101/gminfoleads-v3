import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { PayloadToken } from '../../auth/models/token.model';
import { RoleCodes } from '../../modules/system-roles/system-role.entity';

@Injectable()
export class SetUserIdInterceptor implements NestInterceptor {
  private readonly propertyName: string;
  constructor(propertyName: string) {
    this.propertyName = propertyName;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const user = req.user as PayloadToken;

    // I want to allow SuperAdmin and Admin to set the participantId
    const roles: RoleCodes[] = [RoleCodes.SUPER_ADMIN, RoleCodes.ADMIN];
    const hasRole = () =>
      user.roles.some((role: RoleCodes) => roles.includes(role));
    if (user && hasRole()) return next.handle();

    if (user) req.body[this.propertyName] = user.userId;

    return next.handle();
  }
}
