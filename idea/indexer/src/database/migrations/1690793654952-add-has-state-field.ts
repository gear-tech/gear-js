import { MigrationInterface, QueryRunner } from "typeorm";

export class addHasStateField1690793654952 implements MigrationInterface {
    name = 'addHasStateField1690793654952'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "code"
            ADD "hasState" boolean NOT NULL DEFAULT false
        `);
        await queryRunner.query(`
            ALTER TABLE "program"
            ADD "hasState" boolean NOT NULL DEFAULT false
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "program" DROP COLUMN "hasState"
        `);
        await queryRunner.query(`
            ALTER TABLE "code" DROP COLUMN "hasState"
        `);
    }

}
