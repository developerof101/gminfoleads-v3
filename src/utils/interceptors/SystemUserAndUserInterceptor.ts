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
export class SetSystemUserAndUserIdInterceptor implements NestInterceptor {
  private readonly systemUserProperty: string;
  private readonly userProperty: string;
  constructor(systemUserProperty = 'systemUserId', userProperty = 'userId') {
    this.systemUserProperty = systemUserProperty;
    this.userProperty = userProperty;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const user = req.user as PayloadToken;

    const isUser = () =>
      user.roles.some((role: RoleCodes) => [RoleCodes.USER].includes(role));
    if (user && isUser()) req.body[this.userProperty] = user.userId;
    if (user && !isUser()) req.body[this.systemUserProperty] = user.userId;

    return next.handle();
  }
}
