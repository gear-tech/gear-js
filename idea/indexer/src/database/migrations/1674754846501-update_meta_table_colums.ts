import { MigrationInterface, QueryRunner } from "typeorm";

export class updateMetaTableColums1674754846501 implements MigrationInterface {
    name = 'updateMetaTableColums1674754846501'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "meta"
            ADD "hex" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "meta"
            ALTER COLUMN "hash"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "meta"
            ADD CONSTRAINT "UQ_38be34309a8eee85ebfd8f4bc00" UNIQUE ("hash")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "meta" DROP CONSTRAINT "UQ_38be34309a8eee85ebfd8f4bc00"
        `);
        await queryRunner.query(`
            ALTER TABLE "meta"
            ALTER COLUMN "hash" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "meta" DROP COLUMN "hex"
        `);
    }

}
