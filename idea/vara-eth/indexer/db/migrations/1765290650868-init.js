/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class Init1765290650868 {
    name = 'Init1765290650868'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "code" ("id" character varying(66) NOT NULL, "status" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_367e70f79a9106b8e802e1a9825" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "program" ("id" character varying(42) NOT NULL, "code_id" character varying(66) NOT NULL, "created_at_block" bigint NOT NULL, "created_at_tx" character varying(66) NOT NULL, "abi_interface_address" character varying(42), "created_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_3bade5945afbafefdd26a3a29fb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "hash_registry" ("id" character varying NOT NULL, "type" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_666886d02f27e4af99b8ddf7f6a" PRIMARY KEY ("id"))`);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "hash_registry"`);
        await queryRunner.query(`DROP TABLE "program"`);
        await queryRunner.query(`DROP TABLE "code"`);
    }
}
