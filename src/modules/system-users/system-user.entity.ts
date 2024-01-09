import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToMany,
  JoinTable,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { SystemRole } from '../system-roles/system-role.entity';

const bcrypt = require('bcrypt');

export enum JobtitleTypes {
  BOSS = 'BOSS',
  PRESIDENT = 'PRESIDENT',
  EXECUTIVE_PRODUCER = 'EXECUTIVE PRODUCER',
  LOGISTICS = 'LOGISTICS',
  DEVELOPER = 'DEVELOPER',
  FINANCE = 'FINANCE',
  TEAM = 'TEAM',
}

@Entity('system_users')
export class SystemUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  avatar: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  fullName: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  password: string;

  @Column({
    type: 'enum',
    enum: JobtitleTypes,
    nullable: false,
    default: JobtitleTypes.TEAM,
  })
  jobTitle: JobtitleTypes;

  @Column({
    type: 'varchar',
    nullable: false,
    default: JobtitleTypes.TEAM,
  })
  jobTitleVarchar: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  isActive: boolean;

  @Exclude()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToMany((type) => SystemRole, (role) => role.systemUsers)
  @JoinTable({
    name: 'system_users_roles',
    joinColumn: { name: 'system_user_id' },
    inverseJoinColumn: { name: 'system_role_id' },
  })
  roles: SystemRole[];

  @BeforeInsert()
  @BeforeUpdate()
  async multipleUpdates() {
    if (this.firstName || this.lastName) {
      this.fullName = `${this.firstName} ${this.lastName}`;
    }

    if (!this.avatar)
      this.avatar = `https://ui-avatars.com/api/?name=${this.firstName}${this.lastName}&background=random`;
  }

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    const defaultPassword = process.env.DEFAULT_PASSWORD;
    if (!this.password) this.password = defaultPassword;
    this.password = bcrypt.hashSync(this.password, 10);

    if (this.jobTitle) this.jobTitleVarchar = this.jobTitle;
  }
}
