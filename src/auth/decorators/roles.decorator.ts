import { SetMetadata } from '@nestjs/common';

import { RoleCodes } from '../../modules/system-roles/system-role.entity';

export const Roles = (...roles: RoleCodes[]) => SetMetadata('roles', roles);
