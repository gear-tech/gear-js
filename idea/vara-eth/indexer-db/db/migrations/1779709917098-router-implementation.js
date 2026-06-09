/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export default class RouterImplementation1779709917098 {
  name = 'RouterImplementation1779709917098';

  /** @param {QueryRunner} queryRunner */
  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "router_implementation" ("id" character varying NOT NULL, "from_block" bigint NOT NULL, "version" character varying NOT NULL, CONSTRAINT "PK_router_implementation" PRIMARY KEY ("id"))`,
    );
  }

  /** @param {QueryRunner} queryRunner */
  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "router_implementation"`);
  }
}
