import { MigrationInterface, QueryRunner } from "typeorm";

export class programExpiration1681206929961 implements MigrationInterface {
    name = 'programExpiration1681206929961'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "program" DROP COLUMN "expiration"
        `);
        await queryRunner.query(`
            ALTER TABLE "program"
            ADD "expiration" character varying
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "program" DROP COLUMN "expiration"
        `);
        await queryRunner.query(`
            ALTER TABLE "program"
            ADD "expiration" integer
        `);
    }

}
