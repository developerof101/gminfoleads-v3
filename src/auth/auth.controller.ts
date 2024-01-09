import {
  Controller,
  // Request,
  Req,
  Post,
  UseGuards,
  Get,
  Body,
  HttpException,
  HttpStatus,
  HttpCode,
  Query,
  ClassSerializerInterceptor,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  Delete,
  Param,
} from '@nestjs/common';
import { ApiConsumes } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { RefreshTokenDto } from './dto/RefreshToken.dto';
import { JwtDto } from './dto/Jwt.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SystemUser } from '../modules/system-users/system-user.entity';
// import { Participant } from '../modules/participants/participant.entity';

@Controller('auth')
@UsePipes(ValidationPipe)
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiConsumes('email', 'password')
  @Post('/login')
  // async login(@Req() req: Request): Promise<JwtDto> {
  async login(@Req() req: any): Promise<JwtDto> {
    const loggedUser = req.user as SystemUser;
    return this.authService.login(loggedUser);
  }

  @Post('/refresh')
  async refreshToken(@Body() body: RefreshTokenDto): Promise<JwtDto> {
    return this.authService.refresh(body.refreshToken);
  }
}
