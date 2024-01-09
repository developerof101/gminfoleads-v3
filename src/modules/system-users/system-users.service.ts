import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { SystemUser, JobtitleTypes } from './system-user.entity';
import { CreateUserDto, UpdateUserDto } from './system-user.dto';
import { SystemRole } from '../system-roles/system-role.entity';
// import { UtilitiesService } from '../utilities/utilities.service';
import {
  HttpException,
  HttpExceptionMessage,
} from '../../utils/HttpExceptionFilter';

@Injectable()
export class SystemUsersService {
  constructor(
    @InjectRepository(SystemUser)
    private userRepo: Repository<SystemUser>,
    @InjectRepository(SystemRole)
    private roleRepo: Repository<SystemRole>, // private utilitiesService: UtilitiesService,
  ) {}

  async findOne(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new HttpException(HttpStatus.NOT_FOUND, 'USER');
    return user;
  }

  async findOneBy(
    data: FindOptionsWhere<SystemUser>,
    relations?: string[],
    throwException = true,
  ) {
    const systemUser = await this.userRepo.findOne({
      where: { ...data },
      relations,
    });
    if (!systemUser && throwException)
      throw new HttpException(HttpStatus.NOT_FOUND, 'USER');
    return systemUser;
  }

  async findManyBy(
    data: FindOptionsWhere<SystemUser>,
    relations?: string[],
    throwException = false,
  ) {
    const systemUsers = await this.userRepo.find({
      where: { ...data },
      relations,
    });
    if (systemUsers.length === 0 && throwException)
      throw new HttpException(HttpStatus.NOT_FOUND, 'USER');
    return systemUsers;
  }

  async findByEmail(email: string) {
    return await this.userRepo.findOne({
      where: { email },
      relations: ['roles'],
    });
  }

  async getUsers() {
    const users = await this.userRepo.find({ relations: ['role'] });
    return users.map((user) => ({
      ...user,
    }));
  }

  async createUser(payload: CreateUserDto) {
    await this.checkIfSystemUserExists(payload);
    const newUser = this.userRepo.create(payload);

    // if (!this.utilitiesService.isAnAuthorizedEmail(payload.email))
    //   throw new HttpExceptionMessage(
    //     HttpStatus.BAD_REQUEST,
    //     `Domain not authorized.`,
    //   );

    const roles = await this.roleRepo.findByIds(payload.roleIds);
    if (roles.length === 0)
      throw new HttpException(HttpStatus.NOT_FOUND, 'ROLES', 'mp');
    newUser.roles = roles;

    return this.userRepo.save(newUser);
  }

  async checkIfSystemUserExists(
    data: CreateUserDto | UpdateUserDto,
    throwException = true,
  ) {
    const { email, username } = data;
    const systemUser = await this.userRepo.findOne({
      where: [{ email }, { username }],
    });

    if (systemUser) {
      if (!throwException) return true;

      if (systemUser.email === email)
        throw new HttpException(
          HttpStatus.CONFLICT,
          'email',
          'm',
          'systemUser',
        );

      if (systemUser.username === username)
        throw new HttpException(
          HttpStatus.CONFLICT,
          'username',
          'm',
          'username',
        );
    }

    return false;
  }

  async updateUser(idOrEmail: number | string, changes: UpdateUserDto) {
    const pivot = `${idOrEmail}`;
    const user = await this.userRepo.findOne({
      where: [{ id: parseInt(idOrEmail as string) }, { email: `${idOrEmail}` }],
    });
    // if (isNaN(parseInt(pivot))) {
    //   if (!this.utilitiesService.isAnAuthorizedEmail(pivot)) {
    //     throw new HttpExceptionMessage(
    //       HttpStatus.BAD_REQUEST,
    //       `Domain not authorized.`,
    //     );
    //   }
    // }
    if (!user) throw new HttpException(HttpStatus.NOT_FOUND, 'USER');

    if (changes.roleIds) {
      const roles = await this.roleRepo.findByIds(changes.roleIds);
      if (roles.length === 0)
        throw new HttpException(HttpStatus.NOT_FOUND, 'ROLES', 'mp');
      user.roles = roles;
    }

    this.userRepo.merge(user, changes);
    return this.userRepo.save(user);
  }

  async userInfo(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['roles'],
    });
    if (!user) throw new HttpException(HttpStatus.NOT_FOUND, 'USER');
    return {
      ...user,
      username: user.email,
      location: 'EC',
      role: user.roles,
      coverImg: user.avatar,
      description: '',
    };
  }
}
