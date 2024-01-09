import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SystemUsersService } from './system-users.service';
import { SystemUser } from './system-user.entity';
import { SystemRole } from '../system-roles/system-role.entity';
import { SystemUsersController } from './system-users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SystemUser, SystemRole])],
  providers: [SystemUsersService],
  exports: [SystemUsersService],
  controllers: [SystemUsersController],
})
export class SystemUsersModule {}
