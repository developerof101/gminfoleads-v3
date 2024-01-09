import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  Column,
  JoinColumn,
  Timestamp,
} from 'typeorm';
import { SystemUser } from '../modules/system-users/system-user.entity';

@Entity({
  name: 'access_tokens',
})
export class AccessToken {
  @PrimaryColumn()
  id: string;

  @ManyToOne((type) => SystemUser)
  @JoinColumn({
    name: 'system_user_id',
  })
  systemUser: SystemUser;

  @Column({
    default: false,
  })
  revoked: boolean;

  @Column({
    type: 'timestamp',
  })
  expiresAt: Timestamp;
}
