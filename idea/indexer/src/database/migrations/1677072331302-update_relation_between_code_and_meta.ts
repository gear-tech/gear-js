import { MigrationInterface, QueryRunner } from "typeorm";

export class updateRelationBetweenCodeAndMeta1677072331302 implements MigrationInterface {
    name = 'updateRelationBetweenCodeAndMeta1677072331302'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "code" DROP CONSTRAINT "FK_8aa019d7912f73ed38fc8138152"
        `);
        await queryRunner.query(`
            ALTER TABLE "code" DROP CONSTRAINT "REL_8aa019d7912f73ed38fc813815"
        `);
        await queryRunner.query(`
            ALTER TABLE "code"
            ADD CONSTRAINT "FK_8aa019d7912f73ed38fc8138152" FOREIGN KEY ("meta_id") REFERENCES "meta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "code" DROP CONSTRAINT "FK_8aa019d7912f73ed38fc8138152"
        `);
        await queryRunner.query(`
            ALTER TABLE "code"
            ADD CONSTRAINT "REL_8aa019d7912f73ed38fc813815" UNIQUE ("meta_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "code"
            ADD CONSTRAINT "FK_8aa019d7912f73ed38fc8138152" FOREIGN KEY ("meta_id") REFERENCES "meta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
