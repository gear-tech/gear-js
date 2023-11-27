import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexes1701091693635 implements MigrationInterface {
    name = 'AddIndexes1701091693635'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."IDX_a2d0e671c0f3215950d128fea2"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_a8dbdd1e11aad73e620bcefbb9"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_367e70f79a9106b8e802e1a982" ON "code" ("id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_b5c04a17f83b4eb709102d0768" ON "code" ("name")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_3bade5945afbafefdd26a3a29f" ON "program" ("id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_2156fc4598c9a1b865d85b5f1e" ON "program" ("name")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."IDX_2156fc4598c9a1b865d85b5f1e"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_3bade5945afbafefdd26a3a29f"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_b5c04a17f83b4eb709102d0768"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_367e70f79a9106b8e802e1a982"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_a8dbdd1e11aad73e620bcefbb9" ON "program" ("owner")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_a2d0e671c0f3215950d128fea2" ON "code" ("uploadedBy")
        `);
    }

}
