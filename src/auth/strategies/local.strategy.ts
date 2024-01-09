import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passReqToCallback: true });
  }

  async validate(req: Request, email: string, password: string): Promise<any> {
    let user = null;
    const isGoogleLogin = req.body.isGoogleLogin;

    if (isGoogleLogin) {
      const token = password;
      user = await this.authService.validateSystemUserByGoogleLogin(
        email,
        token,
      );
    } else {
      user = await this.authService.validateSystemUser(email, password);
    }

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
