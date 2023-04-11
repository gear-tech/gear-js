import { MigrationInterface, QueryRunner } from "typeorm";

export class removeGeneratedPk1681220971037 implements MigrationInterface {
    name = 'removeGeneratedPk1681220971037'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "state_to_code" DROP CONSTRAINT "FK_9fa5d2837b9b9275af7c3e4785d"
        `);
        await queryRunner.query(`
            ALTER TABLE "program" DROP CONSTRAINT "FK_0a5783ec166b1a3d42ba1143f99"
        `);
        await queryRunner.query(`
            ALTER TABLE "code"
            ALTER COLUMN "_id" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "message" DROP CONSTRAINT "FK_b8e38090b7fc53bdce979813f76"
        `);
        await queryRunner.query(`
            ALTER TABLE "program"
            ALTER COLUMN "_id" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "state_to_code"
            ADD CONSTRAINT "FK_9fa5d2837b9b9275af7c3e4785d" FOREIGN KEY ("code_id") REFERENCES "code"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "program"
            ADD CONSTRAINT "FK_0a5783ec166b1a3d42ba1143f99" FOREIGN KEY ("code_id") REFERENCES "code"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "message"
            ADD CONSTRAINT "FK_b8e38090b7fc53bdce979813f76" FOREIGN KEY ("program_id") REFERENCES "program"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "message" DROP CONSTRAINT "FK_b8e38090b7fc53bdce979813f76"
        `);
        await queryRunner.query(`
            ALTER TABLE "program" DROP CONSTRAINT "FK_0a5783ec166b1a3d42ba1143f99"
        `);
        await queryRunner.query(`
            ALTER TABLE "state_to_code" DROP CONSTRAINT "FK_9fa5d2837b9b9275af7c3e4785d"
        `);
        await queryRunner.query(`
            ALTER TABLE "program"
            ALTER COLUMN "_id"
            SET DEFAULT uuid_generate_v4()
        `);
        await queryRunner.query(`
            ALTER TABLE "message"
            ADD CONSTRAINT "FK_b8e38090b7fc53bdce979813f76" FOREIGN KEY ("program_id") REFERENCES "program"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "code"
            ALTER COLUMN "_id"
            SET DEFAULT uuid_generate_v4()
        `);
        await queryRunner.query(`
            ALTER TABLE "program"
            ADD CONSTRAINT "FK_0a5783ec166b1a3d42ba1143f99" FOREIGN KEY ("code_id") REFERENCES "code"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "state_to_code"
            ADD CONSTRAINT "FK_9fa5d2837b9b9275af7c3e4785d" FOREIGN KEY ("code_id") REFERENCES "code"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
