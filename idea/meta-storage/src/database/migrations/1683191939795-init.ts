import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1683191939795 implements MigrationInterface {
  name = 'init1683191939795';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "meta" (
                "hash" character varying NOT NULL,
                "hex" character varying,
                "types" json,
                CONSTRAINT "PK_38be34309a8eee85ebfd8f4bc00" PRIMARY KEY ("hash")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "meta"
        `);
  }
}
