import { MigrationInterface, QueryRunner } from 'typeorm';

export class initMetaMessageProgram1656439725137 implements MigrationInterface {
  name = 'initMetaMessageProgram1656439725137';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE program_initstatus_enum as ENUM ('success', 'failed', 'in progress');
    `);
    await queryRunner.query(
      `CREATE TABLE "message" (
        "genesis" character varying NOT NULL, 
        "blockHash" character varying, 
        "timestamp" TIMESTAMP, 
        "id" character varying NOT NULL, 
        "destination" character varying NOT NULL, 
        "source" character varying NOT NULL, 
        "payload" character varying, 
        "error" character varying, 
        "replyTo" character varying, 
        "replyError" character varying, 
        "processedWithPanic" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_415b62539db7e5df16641549ba" ON "message" ("genesis") `);
    await queryRunner.query(`CREATE INDEX "IDX_2b0c43ce7cf7b69fcce6dc3450" ON "message" ("destination") `);
    await queryRunner.query(`CREATE INDEX "IDX_1cad381e4d31baf6327cab90f1" ON "message" ("source") `);
    await queryRunner.query(
      `CREATE TABLE "meta" (
        "id" SERIAL NOT NULL, 
        "program" character varying NOT NULL, 
        "owner" character varying NOT NULL, 
        "meta" character varying, 
        "metaFile" character varying, CONSTRAINT "PK_c4c17a6c2bd7651338b60fc590b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "program" (
        "genesis" character varying NOT NULL, 
        "blockHash" character varying, 
        "timestamp" TIMESTAMP, 
        "id" character varying NOT NULL, 
        "owner" character varying NOT NULL, 
        "name" character varying NOT NULL, 
        "title" character varying, 
        "initStatus" "public"."program_initstatus_enum" NOT NULL DEFAULT 'in progress', 
        "metaId" integer, CONSTRAINT "REL_78c75d89b4fd889ef67d5e3030" UNIQUE ("metaId"), CONSTRAINT "PK_3bade5945afbafefdd26a3a29fb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_634f57814226ec9e93ea5e5da9" ON "program" ("genesis") `);
    await queryRunner.query(`CREATE INDEX "IDX_a8dbdd1e11aad73e620bcefbb9" ON "program" ("owner") `);
    await queryRunner.query(
      `ALTER TABLE "program" ADD CONSTRAINT "FK_78c75d89b4fd889ef67d5e3030f" FOREIGN KEY ("metaId") REFERENCES "meta"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "program" DROP CONSTRAINT "FK_78c75d89b4fd889ef67d5e3030f"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a8dbdd1e11aad73e620bcefbb9"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_634f57814226ec9e93ea5e5da9"`);
    await queryRunner.query(`DROP TABLE "program"`);
    await queryRunner.query(`DROP TABLE "meta"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_1cad381e4d31baf6327cab90f1"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_2b0c43ce7cf7b69fcce6dc3450"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_415b62539db7e5df16641549ba"`);
    await queryRunner.query(`DROP TABLE "message"`);
  }
}
