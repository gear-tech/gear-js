import { MigrationInterface, QueryRunner } from 'typeorm';

export class addReadStatusAndTypeMessageEntity1657703197826 implements MigrationInterface {
  name = 'addReadStatusAndTypeMessageEntity1657703197826';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TYPE "public"."message_type_enum" AS ENUM(\'UserMessageSent\', \'MessageEnqueued\')');
    await queryRunner.query('ALTER TABLE "message" ADD "type" "public"."message_type_enum"');
    await queryRunner.query(
      'CREATE TYPE "public"."message_readstatus_enum" AS ENUM(\'OutOfRent\', \'Claimed\', \'Replied\')',
    );
    await queryRunner.query('ALTER TABLE "message" ADD "readStatus" "public"."message_readstatus_enum"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "message" DROP COLUMN "readStatus"');
    await queryRunner.query('DROP TYPE "public"."message_readstatus_enum"');
    await queryRunner.query('ALTER TABLE "message" DROP COLUMN "type"');
    await queryRunner.query('DROP TYPE "public"."message_type_enum"');
  }
}
