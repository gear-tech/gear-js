import { MigrationInterface, QueryRunner } from 'typeorm';

export class addReadStatusAndTypeMessageEnttity1657545567061 implements MigrationInterface {
  name = 'addReadStatusAndTypeMessageEnttity1657545567061';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."message_type_enum" AS ENUM('UserMessageSent', 'Enqueued')`);
    await queryRunner.query(`ALTER TABLE "message" ADD "type" "public"."message_type_enum" NOT NULL`);
    await queryRunner.query(
      `CREATE TYPE "public"."message_readstatus_enum" AS ENUM('OutOfRent', 'Claimed', 'Replied')`,
    );
    await queryRunner.query(`ALTER TABLE "message" ADD "readStatus" "public"."message_readstatus_enum"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "readStatus"`);
    await queryRunner.query(`DROP TYPE "public"."message_readstatus_enum"`);
    await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."message_type_enum"`);
  }
}
