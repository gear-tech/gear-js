import { MigrationInterface, QueryRunner } from "typeorm";

export class codeStatusUnknown1678708517193 implements MigrationInterface {
    name = 'codeStatusUnknown1678708517193'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TYPE "public"."code_status_enum"
            RENAME TO "code_status_enum_old"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."code_status_enum" AS ENUM('Active', 'Inactive', 'Unknown')
        `);
        await queryRunner.query(`
            ALTER TABLE "code"
            ALTER COLUMN "status" TYPE "public"."code_status_enum" USING "status"::"text"::"public"."code_status_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."code_status_enum_old"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."code_status_enum_old" AS ENUM('Active', 'Inactive')
        `);
        await queryRunner.query(`
            ALTER TABLE "code"
            ALTER COLUMN "status" TYPE "public"."code_status_enum_old" USING "status"::"text"::"public"."code_status_enum_old"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."code_status_enum"
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."code_status_enum_old"
            RENAME TO "code_status_enum"
        `);
    }

}
