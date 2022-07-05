import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateMessageEntity1656925123213 implements MigrationInterface {
  name = 'updateMessageEntity1656925123213';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "error"`);
    await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "replyTo"`);
    await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "replyError"`);
    await queryRunner.query(`ALTER TABLE "message" ADD "value" character varying NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "message" ADD "exitCode" integer`);
    await queryRunner.query(`ALTER TABLE "message" ADD "replyToMessageId" character varying`);
    await queryRunner.query(`ALTER TABLE "message" ADD "entry" character varying`);
    await queryRunner.query(`ALTER TABLE "message" ADD "expiration" integer`);
    await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "processedWithPanic" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "processedWithPanic" DROP DEFAULT`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "processedWithPanic" SET DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "processedWithPanic" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "expiration"`);
    await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "entry"`);
    await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "replyToMessageId"`);
    await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "exitCode"`);
    await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "value"`);
    await queryRunner.query(`ALTER TABLE "message" ADD "replyError" character varying`);
    await queryRunner.query(`ALTER TABLE "message" ADD "replyTo" character varying`);
    await queryRunner.query(`ALTER TABLE "message" ADD "error" character varying`);
  }
}
