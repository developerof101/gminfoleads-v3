import { Injectable, ExecutionContext, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { HttpExceptionMessage } from '../../utils/HttpExceptionFilter';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    if (isPublic) return true;
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user)
      throw new HttpExceptionMessage(HttpStatus.UNAUTHORIZED, 'Invalid token');

    return user;
  }
}
