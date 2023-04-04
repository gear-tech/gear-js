import { MigrationInterface, QueryRunner } from "typeorm";

export class updateMessageTable1676455747413 implements MigrationInterface {
    name = 'updateMessageTable1676455747413'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "message" DROP COLUMN "entry"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."message_entry_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "message"
            ADD "entry" text
        `);
        await queryRunner.query(`
            ALTER TABLE "message" DROP COLUMN "type"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."message_type_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "message"
            ADD "type" text
        `);
        await queryRunner.query(`
            ALTER TABLE "message" DROP COLUMN "readReason"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."message_readreason_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "message"
            ADD "readReason" text
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "message" DROP COLUMN "readReason"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."message_readreason_enum" AS ENUM('OutOfRent', 'Claimed', 'Replied')
        `);
        await queryRunner.query(`
            ALTER TABLE "message"
            ADD "readReason" "public"."message_readreason_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "message" DROP COLUMN "type"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."message_type_enum" AS ENUM('UserMessageSent', 'MessageEnqueued')
        `);
        await queryRunner.query(`
            ALTER TABLE "message"
            ADD "type" "public"."message_type_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "message" DROP COLUMN "entry"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."message_entry_enum" AS ENUM('init', 'handle', 'reply')
        `);
        await queryRunner.query(`
            ALTER TABLE "message"
            ADD "entry" "public"."message_entry_enum"
        `);
    }

}
