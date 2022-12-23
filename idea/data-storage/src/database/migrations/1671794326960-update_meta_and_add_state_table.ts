import { MigrationInterface, QueryRunner } from "typeorm";

export class updateMetaAndAddStateTable1671794326960 implements MigrationInterface {
    name = 'updateMetaAndAddStateTable1671794326960'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "state" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "wasmBuffBase64" character varying NOT NULL,
                "funcNames" json NOT NULL,
                "functions" json NOT NULL,
                "code_id" uuid,
                CONSTRAINT "PK_549ffd046ebab1336c3a8030a12" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "meta" DROP COLUMN "meta"
        `);
        await queryRunner.query(`
            ALTER TABLE "meta" DROP COLUMN "metaWasm"
        `);
        await queryRunner.query(`
            ALTER TABLE "code"
            ADD "hex" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "meta"
            ADD "hex" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "meta"
            ADD "data" json
        `);
        await queryRunner.query(`
            ALTER TABLE "state"
            ADD CONSTRAINT "FK_cb46b1ac13bba524405d4e81382" FOREIGN KEY ("code_id") REFERENCES "code"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "state" DROP CONSTRAINT "FK_cb46b1ac13bba524405d4e81382"
        `);
        await queryRunner.query(`
            ALTER TABLE "meta" DROP COLUMN "data"
        `);
        await queryRunner.query(`
            ALTER TABLE "meta" DROP COLUMN "hex"
        `);
        await queryRunner.query(`
            ALTER TABLE "code" DROP COLUMN "hex"
        `);
        await queryRunner.query(`
            ALTER TABLE "meta"
            ADD "metaWasm" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "meta"
            ADD "meta" character varying
        `);
        await queryRunner.query(`
            DROP TABLE "state"
        `);
    }

}
