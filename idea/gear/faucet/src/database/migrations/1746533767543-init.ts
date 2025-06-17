import { MigrationInterface, QueryRunner } from "typeorm";

export class init1746533767543 implements MigrationInterface {
    name = 'init1746533767543'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."faucet_request_type_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TYPE "public"."faucet_request_status_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "faucet_request" ("id" SERIAL NOT NULL, "type" "public"."faucet_request_type_enum" NOT NULL, "address" character varying NOT NULL, "target" character varying NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "status" "public"."faucet_request_status_enum" NOT NULL DEFAULT '0', CONSTRAINT "PK_2d86d1fa603c361df0053688a41" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_last_seen" ("id" character varying NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_17692a55dac91866fec3e6f3d77" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user_last_seen"`);
        await queryRunner.query(`DROP TABLE "faucet_request"`);
        await queryRunner.query(`DROP TYPE "public"."faucet_request_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."faucet_request_type_enum"`);
    }

}
