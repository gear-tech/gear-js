import { MigrationInterface, QueryRunner } from 'typeorm';

export class generatedCodeId1663669097188 implements MigrationInterface {
  name = 'generatedCodeId1663669097188';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "code" ADD "_id" uuid NOT NULL DEFAULT uuid_generate_v4()');
    await queryRunner.query('ALTER TABLE "code" DROP CONSTRAINT "PK_367e70f79a9106b8e802e1a9825"');
    await queryRunner.query('ALTER TABLE "code" ADD CONSTRAINT "PK_39e6fce078e206257182672c48d" PRIMARY KEY ("id", "_id")');
    await queryRunner.query('ALTER TABLE "code" DROP CONSTRAINT "PK_39e6fce078e206257182672c48d"');
    await queryRunner.query('ALTER TABLE "code" ADD CONSTRAINT "PK_3faae0c7f4cfa80186e791ce7f1" PRIMARY KEY ("_id")');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "code" DROP CONSTRAINT "PK_3faae0c7f4cfa80186e791ce7f1"');
    await queryRunner.query('ALTER TABLE "code" ADD CONSTRAINT "PK_39e6fce078e206257182672c48d" PRIMARY KEY ("id", "_id")');
    await queryRunner.query('ALTER TABLE "code" DROP CONSTRAINT "PK_39e6fce078e206257182672c48d"');
    await queryRunner.query('ALTER TABLE "code" ADD CONSTRAINT "PK_367e70f79a9106b8e802e1a9825" PRIMARY KEY ("id")');
    await queryRunner.query('ALTER TABLE "code" DROP COLUMN "_id"');
  }

}
