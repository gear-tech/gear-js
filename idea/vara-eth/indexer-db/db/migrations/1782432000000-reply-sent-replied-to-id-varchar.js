/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export default class ReplySentRepliedToIdVarchar1782432000000 {
  name = 'ReplySentRepliedToIdVarchar1782432000000';

  /** @param {QueryRunner} queryRunner */
  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "reply_sent" ALTER COLUMN "replied_to_id" TYPE character varying USING '\\x' || encode("replied_to_id", 'hex')`,
    );
  }

  /** @param {QueryRunner} queryRunner */
  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "reply_sent" ALTER COLUMN "replied_to_id" TYPE bytea USING decode(substring("replied_to_id" from 3), 'hex')`,
    );
  }
}
