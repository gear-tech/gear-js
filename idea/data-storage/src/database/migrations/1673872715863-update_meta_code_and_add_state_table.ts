import { MigrationInterface, QueryRunner } from "typeorm";

export class updateMetaCodeAndAddStateTable1673872715863 implements MigrationInterface {
    name = 'updateMetaCodeAndAddStateTable1673872715863'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "state" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "wasmBuffBase64" character varying NOT NULL,
                "funcNames" json NOT NULL,
                "functions" json NOT NULL,
                CONSTRAINT "PK_549ffd046ebab1336c3a8030a12" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "state_to_code" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "codeId" character varying NOT NULL,
                "stateId" uuid NOT NULL,
                "stateHex" character varying NOT NULL,
                "code_id" uuid,
                CONSTRAINT "PK_f4189c7208d247ff74101eba8e4" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "meta" DROP COLUMN "program"
        `);
        await queryRunner.query(`
            ALTER TABLE "meta" DROP COLUMN "owner"
        `);
        await queryRunner.query(`
            ALTER TABLE "meta" DROP COLUMN "metaWasm"
        `);
        await queryRunner.query(`
            ALTER TABLE "meta" DROP COLUMN "meta"
        `);
        await queryRunner.query(`
            ALTER TABLE "program" DROP COLUMN "title"
        `);
        await queryRunner.query(`
            ALTER TABLE "meta"
            ADD "hash" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "meta"
            ADD "types" json
        `);
        await queryRunner.query(`
            ALTER TABLE "state_to_code"
            ADD CONSTRAINT "FK_9fa5d2837b9b9275af7c3e4785d" FOREIGN KEY ("code_id") REFERENCES "code"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "state_to_code"
            ADD CONSTRAINT "FK_fa9cf57f13ab8aa9fa41d96e64f" FOREIGN KEY ("stateId") REFERENCES "state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "state_to_code" DROP CONSTRAINT "FK_fa9cf57f13ab8aa9fa41d96e64f"
        `);
        await queryRunner.query(`
            ALTER TABLE "state_to_code" DROP CONSTRAINT "FK_9fa5d2837b9b9275af7c3e4785d"
        `);
        await queryRunner.query(`
            ALTER TABLE "meta" DROP COLUMN "types"
        `);
        await queryRunner.query(`
            ALTER TABLE "meta" DROP COLUMN "hash"
        `);
        await queryRunner.query(`
            ALTER TABLE "program"
            ADD "title" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "meta"
            ADD "meta" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "meta"
            ADD "metaWasm" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "meta"
            ADD "owner" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "meta"
            ADD "program" character varying NOT NULL
        `);
        await queryRunner.query(`
            DROP TABLE "state_to_code"
        `);
        await queryRunner.query(`
            DROP TABLE "state"
        `);
    }

}
