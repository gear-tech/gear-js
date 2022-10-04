import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateCodeAndMessageEntities1664897069055 implements MigrationInterface {
  name = 'updateCodeAndMessageEntities1664897069055';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "code" DROP CONSTRAINT "FK_c7b6c24862b8cc4a0ff252dfda5"');
    await queryRunner.query('ALTER TABLE "code" DROP CONSTRAINT "REL_c7b6c24862b8cc4a0ff252dfda"');
    await queryRunner.query('ALTER TABLE "code" DROP COLUMN "mata_id"');
    await queryRunner.query('ALTER TABLE "code" ADD "meta_id" integer');
    await queryRunner.query('ALTER TABLE "code" ADD CONSTRAINT "UQ_8aa019d7912f73ed38fc8138152" UNIQUE ("meta_id")');
    await queryRunner.query('ALTER TABLE "code" ALTER COLUMN "status" SET NOT NULL');
    await queryRunner.query('ALTER TABLE "code" ADD CONSTRAINT "FK_8aa019d7912f73ed38fc8138152" FOREIGN KEY ("meta_id") REFERENCES "meta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "code" DROP CONSTRAINT "FK_8aa019d7912f73ed38fc8138152"');
    await queryRunner.query('ALTER TABLE "code" ALTER COLUMN "status" DROP NOT NULL');
    await queryRunner.query('ALTER TABLE "code" DROP CONSTRAINT "UQ_8aa019d7912f73ed38fc8138152"');
    await queryRunner.query('ALTER TABLE "code" DROP COLUMN "meta_id"');
    await queryRunner.query('ALTER TABLE "code" ADD "mata_id" integer');
    await queryRunner.query('ALTER TABLE "code" ADD CONSTRAINT "REL_c7b6c24862b8cc4a0ff252dfda" UNIQUE ("mata_id")');
    await queryRunner.query('ALTER TABLE "code" ADD CONSTRAINT "FK_c7b6c24862b8cc4a0ff252dfda5" FOREIGN KEY ("mata_id") REFERENCES "meta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
  }

}
