import * as bcrypt from 'bcrypt';
import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtDto } from './dto/Jwt.dto';
import { JwtService } from '@nestjs/jwt';
import { AccessToken } from './accessToken.entity';
import { RefreshToken } from './refreshToken.entity';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

import {
  HttpException,
  HttpExceptionMessage,
} from '../utils/HttpExceptionFilter';
import { SystemUsersService } from '../modules/system-users/system-users.service';
import { SystemUser } from '../modules/system-users/system-user.entity';
import { RoleCodes } from '../modules/system-roles/system-role.entity';
import { equalsIgnoreOrder } from '../utils/utils';

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AccessToken)
    private readonly accessTokenRepository: Repository<AccessToken>,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private readonly refreshRepository: Repository<RefreshToken>,
    private systemUsersService: SystemUsersService,
  ) {}

  async validateSystemUser(email: string, password: string): Promise<any> {
    // Verify if domain is 101grados.com
    // if (!this.utilitiesService.isAnAuthorizedEmail(email))
    //   throw new UnauthorizedException('Unauthorized email');

    const user = await this.systemUsersService.findByEmail(email);

    // First search if the user exists
    if (!user) throw new HttpException(HttpStatus.NOT_FOUND, 'USER');

    // Second we campare the passwords
    if (!(await bcrypt.compare(password, user.password))) {
      // await this.systemUsersService.incrementLoginAttempts(user.id);
      throw new HttpExceptionMessage(HttpStatus.UNAUTHORIZED, 'Wrong password');
    }

    // await this.systemUsersService.resetLoginAttempts(user.id);
    return user;
  }

  async validateSystemUserByGoogleLogin(
    email: string,
    token: string,
  ): Promise<any> {
    // Verify if domain is 101grados.com
    // if (!this.utilitiesService.isAnAuthorizedEmail(email))
    //   throw new UnauthorizedException('Unauthorized email');

    const user = await this.systemUsersService.findByEmail(email);
    // First search if the user exists
    if (!user) throw new HttpException(HttpStatus.NOT_FOUND, 'USER');

    try {
      // Now we verify the google token
      const ticket = await client.verifyIdToken({
        idToken: token,
      });
      const payload = ticket.getPayload();
      const googleEmail = payload['email'];

      if (googleEmail === email) return user;
    } catch (e) {
      throw new UnauthorizedException('Wrong credentials');
    }

    // await this.systemUsersService.resetLoginAttempts(user.id);
    return user;
  }

  async login(user: SystemUser): Promise<JwtDto> {
    return await this.createSystemUserTokens(user);
  }

  async refresh(token: string): Promise<JwtDto> {
    try {
      const refreshData = this.jwtService.verify(token);

      const refreshToken = await this.refreshRepository.findOne({
        where: { id: refreshData.jti },
        join: {
          alias: 'refreshToken',
          leftJoinAndSelect: {
            accessToken: 'refreshToken.accessToken',
            user: 'accessToken.user',
          },
        },
      });

      if (!refreshToken || refreshToken.revoked) {
        throw new Error('Refresh token not recognized');
      }

      refreshToken.revoked = true;
      await this.refreshRepository.save(refreshToken);
      refreshToken.accessToken.revoked = true;
      await this.accessTokenRepository.save(refreshToken.accessToken);

      // this.systemUsersService.setLastLogin(refreshToken.accessToken.user.id);
      // // Find the full user here because refreshToken does not contain user roles
      const fullUser = await this.systemUsersService.findByEmail(
        refreshToken.accessToken.systemUser.email,
      );
      return this.createSystemUserTokens(fullUser);
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }

  async createSystemUserTokens(user: SystemUser): Promise<JwtDto> {
    const id = uuid();
    const refreshId = uuid();
    const accessPayload = {
      email: user.email,
      sub: user.id,
      roles: user.roles.map((r) => r.code),
    };

    const accessToken = this.jwtService.sign(accessPayload, {
      jwtid: id,
    });

    const refreshToken = this.jwtService.sign(
      {},
      {
        expiresIn: this.configService.get('JWT_EXPIRES_IN'),
        jwtid: refreshId,
      },
    );

    return {
      accessToken,
      refreshToken,
      roles: accessPayload.roles,
      username: accessPayload.email,
      sub: accessPayload.sub,
    };
  }

  async validateSystemUserTokenInfo(userId: number, roles: RoleCodes[]) {
    const user = await this.systemUsersService.findOneBy(
      {
        id: userId,
      },
      ['roles'],
      false,
    );
    if (!user)
      throw new HttpExceptionMessage(
        HttpStatus.UNAUTHORIZED,
        'System User have been deleted',
      );

    const assignedRoles = user.roles.map((r) => r.code);
    const areRolesTheSame = equalsIgnoreOrder(roles, assignedRoles);

    if (!areRolesTheSame)
      throw new HttpExceptionMessage(
        HttpStatus.FORBIDDEN,
        'System Roles have been updated',
      );

    return user;
  }
}
