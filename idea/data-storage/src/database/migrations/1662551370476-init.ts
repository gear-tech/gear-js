import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1662551370476 implements MigrationInterface {
  name = 'init1662551370476';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TYPE "public"."code_status_enum" AS ENUM(\'Active\', \'Inactive\')');
    await queryRunner.query(`CREATE TABLE "code" (
       "genesis" character varying NOT NULL, 
       "blockHash" character varying, 
       "timestamp" TIMESTAMP, 
       "id" character varying NOT NULL, 
       "name" character varying NOT NULL, 
       "status" "public"."code_status_enum" NOT NULL, 
       "expiration" integer, CONSTRAINT "PK_367e70f79a9106b8e802e1a9825" PRIMARY KEY ("id"))`);
    await queryRunner.query('CREATE INDEX "IDX_0d3d98dbcf0d87b240911ce6e3" ON "code" ("genesis") ');
    await queryRunner.query(`CREATE TABLE "meta" (
	     "id" SERIAL NOT NULL, 
	     "program" character varying NOT NULL, 
	     "owner" character varying NOT NULL, 
	     "meta" character varying, 
	     "metaWasm" character varying, 
	     "code_id" character varying, CONSTRAINT "REL_b38826a2ce85817720d6e9ca1a" UNIQUE ("code_id"), 
	     CONSTRAINT "PK_c4c17a6c2bd7651338b60fc590b" PRIMARY KEY ("id"))`);

    await queryRunner.query(
      'CREATE TYPE "public"."program_status_enum" AS ENUM(\'unknown\', \'active\', \'terminated\', \'init_failed\', \'paused\')');
    await queryRunner.query(`CREATE TABLE "program" (
	     "genesis" character varying NOT NULL, 
	     "blockHash" character varying, 
	     "timestamp" TIMESTAMP, 
	     "id" character varying NOT NULL, 
	     "owner" character varying NOT NULL, 
	     "name" character varying NOT NULL, 
	     "title" character varying, 
	     "status" "public"."program_status_enum" NOT NULL DEFAULT 'unknown', 
	     "code_id" character varying, "meta_id" integer, 
	     CONSTRAINT "PK_3bade5945afbafefdd26a3a29fb" PRIMARY KEY ("id"))`);
    await queryRunner.query(
      'CREATE INDEX "IDX_634f57814226ec9e93ea5e5da9" ON "program" ("genesis") ');
    await queryRunner.query(
      'CREATE INDEX "IDX_a8dbdd1e11aad73e620bcefbb9" ON "program" ("owner") ');
    await queryRunner.query('CREATE TYPE "public"."message_entry_enum" AS ENUM(\'init\', \'handle\', \'reply\')');
    await queryRunner.query('CREATE TYPE "public"."message_readreason_enum" AS ENUM(\'OutOfRent\', \'Claimed\', \'Replied\')');
    await queryRunner.query('CREATE TYPE "public"."message_type_enum" AS ENUM(\'UserMessageSent\', \'MessageEnqueued\')');
    await queryRunner.query(`CREATE TABLE "message" (
	      "genesis" character varying NOT NULL, 
	      "blockHash" character varying, 
	      "timestamp" TIMESTAMP, 
	      "id" character varying NOT NULL, 
	      "destination" character varying NOT NULL, 
	      "source" character varying NOT NULL, 
	      "payload" character varying, 
	      "value" character varying NOT NULL DEFAULT '0', 
	      "exitCode" integer, 
	      "replyToMessageId" character varying, 
	      "processedWithPanic" boolean, 
	      "entry" "public"."message_entry_enum", 
	      "expiration" integer, "type" "public"."message_type_enum", 
	      "readReason" "public"."message_readreason_enum", 
	      "program_id" character varying, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
    await queryRunner.query('CREATE INDEX "IDX_415b62539db7e5df16641549ba" ON "message" ("genesis") ');
    await queryRunner.query('CREATE INDEX "IDX_2b0c43ce7cf7b69fcce6dc3450" ON "message" ("destination") ');
    await queryRunner.query('CREATE INDEX "IDX_1cad381e4d31baf6327cab90f1" ON "message" ("source") ');
    await queryRunner.query(
      'ALTER TABLE "meta" ADD CONSTRAINT "FK_b38826a2ce85817720d6e9ca1a4" FOREIGN KEY ("code_id") REFERENCES "code"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "program" ADD CONSTRAINT "FK_0a5783ec166b1a3d42ba1143f99" FOREIGN KEY ("code_id") REFERENCES "code"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "program" ADD CONSTRAINT "FK_9dbbd996a3b171485b1b810eb20" FOREIGN KEY ("meta_id") REFERENCES "meta"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "message" ADD CONSTRAINT "FK_b8e38090b7fc53bdce979813f76" FOREIGN KEY ("program_id") REFERENCES "program"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "message" DROP CONSTRAINT "FK_b8e38090b7fc53bdce979813f76"');
    await queryRunner.query('ALTER TABLE "program" DROP CONSTRAINT "FK_9dbbd996a3b171485b1b810eb20"');
    await queryRunner.query('ALTER TABLE "program" DROP CONSTRAINT "FK_0a5783ec166b1a3d42ba1143f99"');
    await queryRunner.query('ALTER TABLE "meta" DROP CONSTRAINT "FK_b38826a2ce85817720d6e9ca1a4"');
    await queryRunner.query('DROP INDEX "public"."IDX_1cad381e4d31baf6327cab90f1"');
    await queryRunner.query('DROP INDEX "public"."IDX_2b0c43ce7cf7b69fcce6dc3450"');
    await queryRunner.query('DROP INDEX "public"."IDX_415b62539db7e5df16641549ba"');
    await queryRunner.query('DROP TABLE "message"');
    await queryRunner.query('DROP TYPE "public"."message_readreason_enum"');
    await queryRunner.query('DROP TYPE "public"."message_entry_enum"');
    await queryRunner.query('DROP INDEX "public"."IDX_a8dbdd1e11aad73e620bcefbb9"');
    await queryRunner.query('DROP INDEX "public"."IDX_634f57814226ec9e93ea5e5da9"');
    await queryRunner.query('DROP TABLE "program"');
    await queryRunner.query('DROP TYPE "public"."program_status_enum"');
    await queryRunner.query('DROP TABLE "meta"');
    await queryRunner.query('DROP INDEX "public"."IDX_0d3d98dbcf0d87b240911ce6e3"');
    await queryRunner.query('DROP TABLE "code"');
  }

}
