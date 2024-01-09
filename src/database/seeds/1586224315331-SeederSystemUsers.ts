import { SystemRole } from '../../modules/system-roles/system-role.entity';
import { SystemUser } from '../../modules/system-users/system-user.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

const bcrypt = require('bcrypt');

require('dotenv').config();

export class SeederSystemUsers1586224315331 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('system_users')
      .values([
        {
          email: 'juan.cortez@101grados.com',
          username: 'juan.cortez',
          password: bcrypt.hashSync(process.env.DEFAULT_PASSWORD, 10),
          firstName: 'Juan',
          lastName: 'Cortez',
          fullName: 'Juan Cortez',
          avatar: `https://ui-avatars.com/api/?name=JuanCortez&background=random`,
          isActive: true,
          jobTitle: 'PRESIDENT',
          jobTitleVarchar: 'PRESIDENT',
        },
        {
          email: 'carlos.vallejo@101grados.com',
          username: 'carlos.vallejo',
          password: bcrypt.hashSync(process.env.DEFAULT_PASSWORD, 10),
          firstName: 'Carlos',
          lastName: 'Vallejo',
          fullName: 'Carlos Vallejo',
          avatar: `https://ui-avatars.com/api/?name=CarlosVallejo&background=random`,
          isActive: true,
          jobTitle: 'DEVELOPER',
          jobTitleVarchar: 'DEVELOPER',
        },
      ])
      .execute();

    const admin1 = await queryRunner.manager
      .createQueryBuilder()
      .select('system_users')
      .from(SystemUser, 'system_users')
      .where('system_users.email= :email', {
        email: 'juan.cortez@101grados.com',
      })
      .getOne();

    const admin2 = await queryRunner.manager
      .createQueryBuilder()
      .select('system_users')
      .from(SystemUser, 'system_users')
      .where('system_users.email= :email', {
        email: 'carlos.vallejo@101grados.com',
      })
      .getOne();

    const superAdminRole = await queryRunner.manager
      .createQueryBuilder()
      .select('system_roles')
      .from(SystemRole, 'system_roles')
      .where('system_roles.code = :code', { code: 'SA' })
      .getOne();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('system_users_roles')
      .values([
        {
          system_user_id: admin1.id,
          system_role_id: superAdminRole.id,
        },
        {
          system_user_id: admin2.id,
          system_role_id: superAdminRole.id,
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('system_users_roles')
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('system_users')
      .execute();
  }
}
