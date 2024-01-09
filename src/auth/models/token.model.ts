import { RoleCodes } from '../../modules/system-roles/system-role.entity';

export interface PayloadToken {
  // sub: number;
  // role: string;
  userId: number;
  username: string;
  roles: RoleCodes[];
  programId: number;
  positionId: number;
  groupId: number;
}
