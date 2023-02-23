import { MigrationInterface, QueryRunner } from "typeorm";

export class deleteUniqueHashMetaTable1677069754299 implements MigrationInterface {
    name = 'deleteUniqueHashMetaTable1677069754299'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "meta" DROP CONSTRAINT "UQ_38be34309a8eee85ebfd8f4bc00"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "meta"
            ADD CONSTRAINT "UQ_38be34309a8eee85ebfd8f4bc00" UNIQUE ("hash")
        `);
    }

}
