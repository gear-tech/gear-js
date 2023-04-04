import { MigrationInterface, QueryRunner } from "typeorm";

export class updateProgramStatus1675420216422 implements MigrationInterface {
    name = 'updateProgramStatus1675420216422'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "program" DROP CONSTRAINT "FK_9dbbd996a3b171485b1b810eb20"
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."program_type_enum"
            RENAME TO "program_type_enum_old"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."program_type_enum" AS ENUM(
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
        await queryRunner.query(`
            ALTER TABLE "program"
            ADD CONSTRAINT "FK_9dbbd996a3b171485b1b810eb20" FOREIGN KEY ("meta_id") REFERENCES "meta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "program" DROP CONSTRAINT "FK_9dbbd996a3b171485b1b810eb20"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."program_type_enum_old" AS ENUM(
                'unknown',
                'active',
                'terminated',
                'inactive',
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
            ADD CONSTRAINT "FK_9dbbd996a3b171485b1b810eb20" FOREIGN KEY ("meta_id") REFERENCES "meta"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

}
