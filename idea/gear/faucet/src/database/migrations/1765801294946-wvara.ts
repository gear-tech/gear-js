import { MigrationInterface, QueryRunner } from "typeorm";

export class Wvara1765801294946 implements MigrationInterface {
    name = 'Wvara1765801294946'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."faucet_request_type_enum" RENAME TO "faucet_request_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."faucet_request_type_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`ALTER TABLE "faucet_request" ALTER COLUMN "type" TYPE "public"."faucet_request_type_enum" USING "type"::"text"::"public"."faucet_request_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."faucet_request_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."faucet_request_type_enum_old" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`ALTER TABLE "faucet_request" ALTER COLUMN "type" TYPE "public"."faucet_request_type_enum_old" USING "type"::"text"::"public"."faucet_request_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."faucet_request_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."faucet_request_type_enum_old" RENAME TO "faucet_request_type_enum"`);
    }

}
