import { MigrationInterface, QueryRunner } from "typeorm";

export class uniqueMetaHash1678717516065 implements MigrationInterface {
    name = 'uniqueMetaHash1678717516065'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "meta"
            ADD CONSTRAINT "UQ_38be34309a8eee85ebfd8f4bc00" UNIQUE ("hash")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "meta" DROP CONSTRAINT "UQ_38be34309a8eee85ebfd8f4bc00"
        `);
    }

}
