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
            'Tiene visualización de todas las tarjetas, puede modificar todas las tarjetas',
        },
        {
          id: 3,
          code: 'WT',
          name: 'Observador',
          description:
            'Automáticamente se le asigna como observador a todo, no puede cambiar nada',
        },
        {
          id: 4,
          code: 'AG',
          name: 'Agente de Soporte',
          description: 'Encargado de resolver tickets',
        },
        {
          id: 5,
          code: 'US',
          name: 'Usuario',
          description: 'Creador de tickets',
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
