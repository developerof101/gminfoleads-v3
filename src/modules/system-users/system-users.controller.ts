import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';

import { SystemUsersService } from './system-users.service';
import { CreateUserDto, UpdateUserDto } from './system-user.dto';
import { RoleCodes } from '../system-roles/system-role.entity';
import { PayloadToken } from '../../auth/models/token.model';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { Roles } from '../../auth/decorators';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('system-users')
export class SystemUsersController {
  constructor(private systemUsersService: SystemUsersService) {}

  @Roles(RoleCodes.ADMIN)
  @Get()
  async getUsers() {
    return await this.systemUsersService.getUsers();
  }

  @Roles()
  @Post()
  async createUser(@Body() payload: CreateUserDto) {
    return await this.systemUsersService.createUser(payload);
  }

  @Get('/my-info')
  async getMyInfo(@Req() req: any) {
    const user = req.user as PayloadToken;
    return await this.systemUsersService.userInfo(user.userId);
  }

  @Put('/:idOrEmail')
  async updateUser(
    @Param('idOrEmail') idOrEmail: number | string,
    @Body() payload: UpdateUserDto,
  ) {
    return await this.systemUsersService.updateUser(idOrEmail, payload);
  }
}
