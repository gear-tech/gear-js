/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class Init1756732151877 {
    name = 'Init1756732151877'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "code" ("id" character varying(66) NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_367e70f79a9106b8e802e1a9825" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "program" ("id" character varying(42) NOT NULL, "code_id" character varying(66) NOT NULL, "created_at_block" bigint NOT NULL, "created_at_tx" character varying(66) NOT NULL, "abi_interface_address" character varying(42), CONSTRAINT "PK_3bade5945afbafefdd26a3a29fb" PRIMARY KEY ("id"))`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "program"`);
        await queryRunner.query(`DROP TABLE "code"`);
    }
}
