import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1683038648938 implements MigrationInterface {
  name = 'init1683038648938';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "meta" (
                "id" character varying NOT NULL,
                "hex" character varying,
                "types" json,
                CONSTRAINT "PK_c4c17a6c2bd7651338b60fc590b" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "meta"
        `);
  }
}
