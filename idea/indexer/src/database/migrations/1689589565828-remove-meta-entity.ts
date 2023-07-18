import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeMetaEntity1689589565828 implements MigrationInterface {
  name = 'removeMetaEntity1689589565828';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "code" DROP CONSTRAINT "FK_8aa019d7912f73ed38fc8138152"
        `);
    await queryRunner.query(`
            ALTER TABLE "program" DROP CONSTRAINT "FK_9dbbd996a3b171485b1b810eb20"
        `);
    await queryRunner.query(`
            ALTER TABLE "code"
                RENAME COLUMN "meta_id" TO "metahash"
        `);
    await queryRunner.query(`
            ALTER TABLE "program"
                RENAME COLUMN "meta_id" TO "metahash"
        `);
    await queryRunner.query(`
            ALTER TABLE "code" DROP COLUMN "metahash"
        `);
    await queryRunner.query(`
            ALTER TABLE "code"
            ADD "metahash" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "program" DROP COLUMN "metahash"
        `);
    await queryRunner.query(`
            ALTER TABLE "program"
            ADD "metahash" character varying
        `);
    await queryRunner.query(`
                DROP TABLE "meta"
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "meta" (
                "id" SERIAL NOT NULL,
                "program" character varying NOT NULL,
                "owner" character varying NOT NULL,
                "meta" character varying,
                "metaWasm" character varying,
                CONSTRAINT "PK_c4c17a6c2bd7651338b60fc590b" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "program" DROP COLUMN "metahash"
        `);
    await queryRunner.query(`
            ALTER TABLE "program"
            ADD "metahash" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "code" DROP COLUMN "metahash"
        `);
    await queryRunner.query(`
            ALTER TABLE "code"
            ADD "metahash" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "program"
                RENAME COLUMN "metahash" TO "meta_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "code"
                RENAME COLUMN "metahash" TO "meta_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "program"
            ADD CONSTRAINT "FK_9dbbd996a3b171485b1b810eb20" FOREIGN KEY ("meta_id") REFERENCES "meta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "code"
            ADD CONSTRAINT "FK_8aa019d7912f73ed38fc8138152" FOREIGN KEY ("meta_id") REFERENCES "meta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
