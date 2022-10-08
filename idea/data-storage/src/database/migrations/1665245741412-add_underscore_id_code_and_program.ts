import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUnderscoreIdCodeAndProgram1665245741412 implements MigrationInterface {
  name = 'addUnderscoreIdCodeAndProgram1665245741412';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "code" ADD "_id" uuid NOT NULL DEFAULT uuid_generate_v4()');
    await queryRunner.query('ALTER TABLE "code" DROP CONSTRAINT "PK_367e70f79a9106b8e802e1a9825" CASCADE'); //Add cascade
    await queryRunner.query('ALTER TABLE "code" ADD CONSTRAINT "PK_39e6fce078e206257182672c48d" PRIMARY KEY ("id", "_id")');
    await queryRunner.query('ALTER TABLE "program" ADD "_id" uuid NOT NULL DEFAULT uuid_generate_v4()');
    await queryRunner.query('ALTER TABLE "program" DROP CONSTRAINT "PK_3bade5945afbafefdd26a3a29fb" CASCADE'); //Add cascade
    await queryRunner.query('ALTER TABLE "program" ADD CONSTRAINT "PK_aedcff3f6c6f241ff31b3736613" PRIMARY KEY ("id", "_id")');
    // await queryRunner.query('ALTER TABLE "program" DROP CONSTRAINT "FK_0a5783ec166b1a3d42ba1143f99"');
    await queryRunner.query('ALTER TABLE "code" DROP CONSTRAINT "PK_39e6fce078e206257182672c48d"');
    await queryRunner.query('ALTER TABLE "code" ADD CONSTRAINT "PK_3faae0c7f4cfa80186e791ce7f1" PRIMARY KEY ("_id")');
    // await queryRunner.query('ALTER TABLE "message" DROP CONSTRAINT "FK_b8e38090b7fc53bdce979813f76"');
    await queryRunner.query('ALTER TABLE "program" DROP CONSTRAINT "PK_aedcff3f6c6f241ff31b3736613"');
    await queryRunner.query('ALTER TABLE "program" ADD CONSTRAINT "PK_0927f29c435c391dcb574ccfb7a" PRIMARY KEY ("_id")');
    await queryRunner.query('ALTER TABLE "program" DROP COLUMN "code_id"');
    await queryRunner.query('ALTER TABLE "program" ADD "code_id" uuid');
    await queryRunner.query('ALTER TABLE "message" DROP COLUMN "program_id"');
    await queryRunner.query('ALTER TABLE "message" ADD "program_id" uuid');
    await queryRunner.query('ALTER TABLE "program" ADD CONSTRAINT "FK_0a5783ec166b1a3d42ba1143f99" FOREIGN KEY ("code_id") REFERENCES "code"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "message" ADD CONSTRAINT "FK_b8e38090b7fc53bdce979813f76" FOREIGN KEY ("program_id") REFERENCES "program"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "message" DROP CONSTRAINT "FK_b8e38090b7fc53bdce979813f76"');
    await queryRunner.query('ALTER TABLE "program" DROP CONSTRAINT "FK_0a5783ec166b1a3d42ba1143f99"');
    await queryRunner.query('ALTER TABLE "message" DROP COLUMN "program_id"');
    await queryRunner.query('ALTER TABLE "message" ADD "program_id" character varying');
    await queryRunner.query('ALTER TABLE "program" DROP COLUMN "code_id"');
    await queryRunner.query('ALTER TABLE "program" ADD "code_id" character varying');
    await queryRunner.query('ALTER TABLE "program" DROP CONSTRAINT "PK_0927f29c435c391dcb574ccfb7a"');
    await queryRunner.query('ALTER TABLE "program" ADD CONSTRAINT "PK_aedcff3f6c6f241ff31b3736613" PRIMARY KEY ("id", "_id")');
    // await queryRunner.query('ALTER TABLE "message" ADD CONSTRAINT "FK_b8e38090b7fc53bdce979813f76" FOREIGN KEY ("program_id") REFERENCES "program"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "code" DROP CONSTRAINT "PK_3faae0c7f4cfa80186e791ce7f1"');
    await queryRunner.query('ALTER TABLE "code" ADD CONSTRAINT "PK_39e6fce078e206257182672c48d" PRIMARY KEY ("id", "_id")');
    // await queryRunner.query('ALTER TABLE "program" ADD CONSTRAINT "FK_0a5783ec166b1a3d42ba1143f99" FOREIGN KEY ("code_id") REFERENCES "code"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "program" DROP CONSTRAINT "PK_aedcff3f6c6f241ff31b3736613"');
    await queryRunner.query('ALTER TABLE "program" ADD CONSTRAINT "PK_3bade5945afbafefdd26a3a29fb" PRIMARY KEY ("id")');
    await queryRunner.query('ALTER TABLE "program" DROP COLUMN "_id"');
    await queryRunner.query('ALTER TABLE "code" DROP CONSTRAINT "PK_39e6fce078e206257182672c48d"');
    await queryRunner.query('ALTER TABLE "code" ADD CONSTRAINT "PK_367e70f79a9106b8e802e1a9825" PRIMARY KEY ("id")');
    await queryRunner.query('ALTER TABLE "code" DROP COLUMN "_id"');
  }

}
