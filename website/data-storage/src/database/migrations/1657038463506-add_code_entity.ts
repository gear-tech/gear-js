import { MigrationInterface, QueryRunner } from 'typeorm';

export class addCodeEntity1657038463506 implements MigrationInterface {
  name = 'addCodeEntity1657038463506';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."code_status_enum" AS ENUM('Active', 'Inactive')`);
    await queryRunner.query(`CREATE TABLE "code" (
    "genesis" character varying NOT NULL, 
    "blockHash" character varying, 
    "timestamp" TIMESTAMP, 
    "id" character varying NOT NULL, 
    "name" character varying NOT NULL, 
    "status" "public"."code_status_enum" NOT NULL, 
    "expiration" integer, CONSTRAINT "PK_367e70f79a9106b8e802e1a9825" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE INDEX "IDX_0d3d98dbcf0d87b240911ce6e3" ON "code" ("genesis") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_0d3d98dbcf0d87b240911ce6e3"`);
    await queryRunner.query(`DROP TABLE "code"`);
    await queryRunner.query(`DROP TYPE "public"."code_status_enum"`);
  }
}
