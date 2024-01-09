import { ApiProperty } from '@nestjs/swagger';

import { RoleCodes } from '../../modules/system-roles/system-role.entity';

export class JwtDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  roles: RoleCodes[];

  @ApiProperty()
  username: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  sub: number;
}
