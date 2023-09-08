import { MigrationInterface, QueryRunner } from "typeorm";

export class addIndexes1694089926155 implements MigrationInterface {
    name = 'addIndexes1694089926155'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE INDEX "IDX_e7a6a0dd0160df08d1386778c6" ON "code" ("timestamp")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_6169ccad61c4600bab206d1225" ON "program" ("timestamp")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_0a97a10e53ad4e12bda1e6b28b" ON "message" ("timestamp")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_ba01f0a3e0123651915008bc57" ON "message" ("id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_b477a789fc61e5fc5221c88970" ON "message" ("type")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."IDX_b477a789fc61e5fc5221c88970"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_ba01f0a3e0123651915008bc57"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_0a97a10e53ad4e12bda1e6b28b"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_6169ccad61c4600bab206d1225"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_e7a6a0dd0160df08d1386778c6"
        `);
    }

}
