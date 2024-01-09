// import {
//   CallHandler,
//   ExecutionContext,
//   Injectable,
//   NestInterceptor,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';

// import { PayloadToken } from '../auth/models/token.model';

// @Injectable()
// export class SetUserIdInterceptor implements NestInterceptor {
//   private readonly propertyName: string;
//   constructor(propertyName: string) {
//     this.propertyName = propertyName;
//   }

//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const req = context.switchToHttp().getRequest();
//     const user = req.user as PayloadToken;

//     if (user) req.body[this.propertyName] = user.userId;

//     return next.handle();
//   }
// }
