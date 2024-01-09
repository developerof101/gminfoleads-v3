import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToMany,
  ManyToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { SystemUser } from '../system-users/system-user.entity';

export enum RoleCodes {
  SUPER_ADMIN = 'SA',
  ADMIN = 'AD',
  USER = 'US',
}

@Entity('system_roles')
export class SystemRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: RoleCodes,
    nullable: false,
    unique: true,
  })
  code: RoleCodes;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  codeVarchar: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  description: string;

  @ManyToMany(() => SystemUser, (systemUsers) => systemUsers.roles)
  systemUsers: SystemUser[];

  @Exclude()
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Exclude()
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async multipleUpdates() {
    if (this.code) this.codeVarchar = this.code;
  }
}
