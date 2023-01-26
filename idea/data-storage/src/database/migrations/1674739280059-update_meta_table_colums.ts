import { MigrationInterface, QueryRunner } from "typeorm";

export class updateMetaTableColums1674739280059 implements MigrationInterface {
    name = 'updateMetaTableColums1674739280059'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "meta" DROP COLUMN "hash"
        `);
        await queryRunner.query(`
            ALTER TABLE "meta"
            ADD "hex" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "code" DROP CONSTRAINT "FK_8aa019d7912f73ed38fc8138152"
        `);
        await queryRunner.query(`
            ALTER TABLE "code" DROP CONSTRAINT "REL_8aa019d7912f73ed38fc813815"
        `);
        await queryRunner.query(`
            ALTER TABLE "code" DROP COLUMN "meta_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "code"
            ADD "meta_id" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "code"
            ADD CONSTRAINT "UQ_8aa019d7912f73ed38fc8138152" UNIQUE ("meta_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "program" DROP CONSTRAINT "FK_9dbbd996a3b171485b1b810eb20"
        `);
        await queryRunner.query(`
            ALTER TABLE "meta" DROP CONSTRAINT "PK_c4c17a6c2bd7651338b60fc590b"
        `);
        await queryRunner.query(`
            ALTER TABLE "meta" DROP COLUMN "id"
        `);
        await queryRunner.query(`
            ALTER TABLE "meta"
            ADD "id" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "meta"
            ADD CONSTRAINT "PK_c4c17a6c2bd7651338b60fc590b" PRIMARY KEY ("id")
        `);
        await queryRunner.query(`
            ALTER TABLE "program" DROP COLUMN "meta_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "program"
            ADD "meta_id" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "code"
            ADD CONSTRAINT "FK_8aa019d7912f73ed38fc8138152" FOREIGN KEY ("meta_id") REFERENCES "meta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "program"
            ADD CONSTRAINT "FK_9dbbd996a3b171485b1b810eb20" FOREIGN KEY ("meta_id") REFERENCES "meta"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "program" DROP CONSTRAINT "FK_9dbbd996a3b171485b1b810eb20"
        `);
        await queryRunner.query(`
            ALTER TABLE "code" DROP CONSTRAINT "FK_8aa019d7912f73ed38fc8138152"
        `);
        await queryRunner.query(`
            ALTER TABLE "program" DROP COLUMN "meta_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "program"
            ADD "meta_id" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "meta" DROP CONSTRAINT "PK_c4c17a6c2bd7651338b60fc590b"
        `);
        await queryRunner.query(`
            ALTER TABLE "meta" DROP COLUMN "id"
        `);
        await queryRunner.query(`
            ALTER TABLE "meta"
            ADD "id" SERIAL NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "meta"
            ADD CONSTRAINT "PK_c4c17a6c2bd7651338b60fc590b" PRIMARY KEY ("id")
        `);
        await queryRunner.query(`
            ALTER TABLE "program"
            ADD CONSTRAINT "FK_9dbbd996a3b171485b1b810eb20" FOREIGN KEY ("meta_id") REFERENCES "meta"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "code" DROP CONSTRAINT "UQ_8aa019d7912f73ed38fc8138152"
        `);
        await queryRunner.query(`
            ALTER TABLE "code" DROP COLUMN "meta_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "code"
            ADD "meta_id" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "code"
            ADD CONSTRAINT "REL_8aa019d7912f73ed38fc813815" UNIQUE ("meta_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "code"
            ADD CONSTRAINT "FK_8aa019d7912f73ed38fc8138152" FOREIGN KEY ("meta_id") REFERENCES "meta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "meta" DROP COLUMN "hex"
        `);
        await queryRunner.query(`
            ALTER TABLE "meta"
            ADD "hash" character varying
        `);
    }

}
