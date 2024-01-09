import { MigrationInterface, QueryRunner } from 'typeorm';

export class SystemRolesSeeder1586224315330 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('system_roles')
      .values([
        {
          id: 1,
          code: 'SA',
          name: 'Super Admin',
          description: 'Dueño del sistema, puede hacerlo todo',
        },
        {
          id: 2,
          code: 'AD',
          name: 'Administrador',
          description:
            'Tiene permisos de administrador, pero no puede crear usuarios',
        },
        {
          id: 3,
          code: 'US',
          name: 'Usuario',
          description: 'Usuario normal, no tiene permisos de administrador',
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('system_roles')
      .execute();
  }
}
