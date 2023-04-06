import { MigrationInterface, QueryRunner } from "typeorm";

export class status1680591096475 implements MigrationInterface {
    name = 'status1680591096475'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "status" (
                "height" character varying NOT NULL,
                "hash" character varying,
                "genesis" character varying NOT NULL,
                CONSTRAINT "PK_d903646eb40a38db9c04c2f9d78" PRIMARY KEY ("height")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_e0e87ec226dd4b147ba783fd2d" ON "status" ("genesis")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_38414873c187a3e0c7943bc4c7" ON "block" ("number")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."IDX_38414873c187a3e0c7943bc4c7"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_e0e87ec226dd4b147ba783fd2d"
        `);
        await queryRunner.query(`
            DROP TABLE "status"
        `);
    }

}
