/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export default class InjectedTransactionDropReplyId1782432001000 {
  name = 'InjectedTransactionDropReplyId1782432001000';

  /** @param {QueryRunner} queryRunner */
  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE "injected_transaction" DROP COLUMN "reply_id"`);
  }

  /** @param {QueryRunner} queryRunner */
  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "injected_transaction" ADD COLUMN "reply_id" bytea NOT NULL`);
  }
}
