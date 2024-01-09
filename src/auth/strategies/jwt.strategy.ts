import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AuthService } from '../auth.service';
import { JwtDto } from '../dto/Jwt.dto';
import { RoleCodes } from '../../modules/system-roles/system-role.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService, private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: configService.get('NODE_ENV') === 'development',
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtDto) {
    await this.authService.validateSystemUserTokenInfo(
      payload.sub,
      payload.roles,
    );

    return {
      userId: payload.sub,
      username: payload.username,
      roles: payload.roles,
    };
  }
}
