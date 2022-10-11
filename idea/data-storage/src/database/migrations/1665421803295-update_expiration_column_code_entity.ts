import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateExpirationColumnCodeEntity1665421803295 implements MigrationInterface {
  name = 'updateExpirationColumnCodeEntity1665421803295';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "code" DROP COLUMN "expiration"');
    await queryRunner.query('ALTER TABLE "code" ADD "expiration" character varying');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "code" DROP COLUMN "expiration"');
    await queryRunner.query('ALTER TABLE "code" ADD "expiration" integer');
  }

}
