import { MigrationInterface, QueryRunner } from "typeorm";

export class deleteMetaTable1683095884082 implements MigrationInterface {
    name = 'deleteMetaTable1683095884082'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "code" DROP CONSTRAINT "FK_8aa019d7912f73ed38fc8138152"
        `);
        await queryRunner.query(`
            ALTER TABLE "program" DROP CONSTRAINT "FK_9dbbd996a3b171485b1b810eb20"
        `);
        await queryRunner.query(`
            ALTER TABLE "code"
                RENAME COLUMN "meta_id" TO "metaHash"
        `);
        await queryRunner.query(`
            ALTER TABLE "program"
                RENAME COLUMN "meta_id" TO "metaHash"
        `);
        await queryRunner.query(`
            ALTER TABLE "code" DROP COLUMN "metaHash"
        `);
        await queryRunner.query(`
            ALTER TABLE "code"
            ADD "metaHash" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "program" DROP COLUMN "metaHash"
        `);
        await queryRunner.query(`
            ALTER TABLE "program"
            ADD "metaHash" character varying
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "program" DROP COLUMN "metaHash"
        `);
        await queryRunner.query(`
            ALTER TABLE "program"
            ADD "metaHash" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "code" DROP COLUMN "metaHash"
        `);
        await queryRunner.query(`
            ALTER TABLE "code"
            ADD "metaHash" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "program"
                RENAME COLUMN "metaHash" TO "meta_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "code"
                RENAME COLUMN "metaHash" TO "meta_id"
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
