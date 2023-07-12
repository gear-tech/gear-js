import { MigrationInterface, QueryRunner } from "typeorm";

export class nullableOwner1685519228764 implements MigrationInterface {
    name = 'nullableOwner1685519228764'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "program"
            ALTER COLUMN "owner" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."program_type_enum"
            RENAME TO "program_type_enum_old"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."program_type_enum" AS ENUM(
                'unknown',
                'programSet',
                'active',
                'terminated',
                'exited',
                'paused'
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "program"
            ALTER COLUMN "type" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "program"
            ALTER COLUMN "type" TYPE "public"."program_type_enum" USING "type"::"text"::"public"."program_type_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "program"
            ALTER COLUMN "type"
            SET DEFAULT 'unknown'
        `);
        await queryRunner.query(`
            DROP TYPE "public"."program_type_enum_old"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."program_type_enum_old" AS ENUM(
                'unknown',
                'active',
                'terminated',
                'exited',
                'paused'
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "program"
            ALTER COLUMN "type" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "program"
            ALTER COLUMN "type" TYPE "public"."program_type_enum_old" USING "type"::"text"::"public"."program_type_enum_old"
        `);
        await queryRunner.query(`
            ALTER TABLE "program"
            ALTER COLUMN "type"
            SET DEFAULT 'unknown'
        `);
        await queryRunner.query(`
            DROP TYPE "public"."program_type_enum"
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."program_type_enum_old"
            RENAME TO "program_type_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "program"
            ALTER COLUMN "owner"
            SET NOT NULL
        `);
    }

}
