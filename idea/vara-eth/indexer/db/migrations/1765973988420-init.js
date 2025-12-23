/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class Init1765973988420 {
  name = 'Init1765973988420';

  /**
   * @param {QueryRunner} queryRunner
   */
  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "batch" ("id" bytea NOT NULL, "block_hash" bytea NOT NULL, "block_timestamp" bigint NOT NULL, "previous_committed_batch_hash" bytea NOT NULL, "expiry" integer NOT NULL, "committed_at_block" bigint NOT NULL, "committed_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_57da3b830b57bec1fd329dcaf43" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."code_status_enum" AS ENUM('0', '1', '2')`);
    await queryRunner.query(
      `CREATE TABLE "code" ("id" bytea NOT NULL, "status" "public"."code_status_enum" NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_367e70f79a9106b8e802e1a9825" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."hash_registry_type_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7')`,
    );
    await queryRunner.query(
      `CREATE TABLE "hash_registry" ("id" bytea NOT NULL, "type" "public"."hash_registry_type_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_666886d02f27e4af99b8ddf7f6a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "program" ("id" bytea NOT NULL, "code_id" bytea NOT NULL, "created_at_block" bigint NOT NULL, "created_at_tx_hash" bytea NOT NULL, "abi_interface_address" bytea, "created_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_3bade5945afbafefdd26a3a29fb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "message_request" ("id" bytea NOT NULL, "source_address" bytea NOT NULL, "program_id" bytea NOT NULL, "payload" bytea NOT NULL, "value" bigint NOT NULL, "call_reply" boolean NOT NULL DEFAULT false, "tx_hash" bytea NOT NULL, "block_number" bigint NOT NULL, "created_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_c2cfffab238c4e12b775a013f49" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "state_transition" ("id" bytea NOT NULL, "hash" bytea NOT NULL, "timestamp" TIMESTAMP NOT NULL, "program_id" bytea NOT NULL, "exited" boolean NOT NULL DEFAULT false, "inheritor" bytea, "value_to_receive" bigint, "batch_hash" bytea, CONSTRAINT "PK_08a49842a67b84f47fab2746ea2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "message_sent" ("id" bytea NOT NULL, "source_program_id" bytea NOT NULL, "destination" bytea NOT NULL, "payload" bytea NOT NULL, "value" bigint NOT NULL, "is_call" boolean NOT NULL DEFAULT false, "state_transition_id" bytea NOT NULL, "created_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_8b1b9e0af3eac42a29879166fbb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "reply_request" ("id" bytea NOT NULL, "source_address" bytea NOT NULL, "program_id" bytea NOT NULL, "payload" bytea NOT NULL, "value" bigint NOT NULL, "tx_hash" bytea NOT NULL, "block_number" bigint NOT NULL, "created_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_29bf870bde2bc1dec18f5804520" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "reply_sent" ("id" bytea NOT NULL, "replied_to_id" bytea NOT NULL, "reply_code" character varying(10) NOT NULL, "source_program_id" bytea NOT NULL, "destination" bytea NOT NULL, "payload" bytea NOT NULL, "value" bigint NOT NULL, "is_call" boolean NOT NULL DEFAULT false, "state_transition_id" bytea NOT NULL, "created_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_7ec04b801a6e7d3a777c8fb6b56" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ethereum_tx" ("id" bytea NOT NULL, "contract_address" bytea NOT NULL, "selector" character varying(10) NOT NULL, "data" bytea NOT NULL, "sender" bytea NOT NULL, "block_number" bigint NOT NULL, "created_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_5b147d8b5498e37a58abc7d3341" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "program" ADD CONSTRAINT "FK_0a5783ec166b1a3d42ba1143f99" FOREIGN KEY ("code_id") REFERENCES "code"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_request" ADD CONSTRAINT "FK_b4ce125d991a44ec786b4f78fa4" FOREIGN KEY ("program_id") REFERENCES "program"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "state_transition" ADD CONSTRAINT "FK_6b8bac83639f4ae90640560eab4" FOREIGN KEY ("batch_hash") REFERENCES "batch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "state_transition" ADD CONSTRAINT "FK_a019efeec33436daabca0cb7c48" FOREIGN KEY ("program_id") REFERENCES "program"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_sent" ADD CONSTRAINT "FK_c652bb7a4a69dda2774f455b59c" FOREIGN KEY ("source_program_id") REFERENCES "program"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_sent" ADD CONSTRAINT "FK_f24706a5e9ce0becab2cde1b7c6" FOREIGN KEY ("state_transition_id") REFERENCES "state_transition"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reply_request" ADD CONSTRAINT "FK_1788c79b3ad37b7f0bc6a4e9674" FOREIGN KEY ("program_id") REFERENCES "program"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reply_sent" ADD CONSTRAINT "FK_adaa1a3abbb9bf57453dd7fe35b" FOREIGN KEY ("source_program_id") REFERENCES "program"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reply_sent" ADD CONSTRAINT "FK_529caaa898b37a0baa91fd8c85f" FOREIGN KEY ("state_transition_id") REFERENCES "state_transition"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  /**
   * @param {QueryRunner} queryRunner
   */
  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "reply_sent" DROP CONSTRAINT "FK_529caaa898b37a0baa91fd8c85f"`);
    await queryRunner.query(`ALTER TABLE "reply_sent" DROP CONSTRAINT "FK_adaa1a3abbb9bf57453dd7fe35b"`);
    await queryRunner.query(`ALTER TABLE "reply_request" DROP CONSTRAINT "FK_1788c79b3ad37b7f0bc6a4e9674"`);
    await queryRunner.query(`ALTER TABLE "message_sent" DROP CONSTRAINT "FK_f24706a5e9ce0becab2cde1b7c6"`);
    await queryRunner.query(`ALTER TABLE "message_sent" DROP CONSTRAINT "FK_c652bb7a4a69dda2774f455b59c"`);
    await queryRunner.query(`ALTER TABLE "state_transition" DROP CONSTRAINT "FK_a019efeec33436daabca0cb7c48"`);
    await queryRunner.query(`ALTER TABLE "state_transition" DROP CONSTRAINT "FK_6b8bac83639f4ae90640560eab4"`);
    await queryRunner.query(`ALTER TABLE "message_request" DROP CONSTRAINT "FK_b4ce125d991a44ec786b4f78fa4"`);
    await queryRunner.query(`ALTER TABLE "program" DROP CONSTRAINT "FK_0a5783ec166b1a3d42ba1143f99"`);
    await queryRunner.query(`DROP TABLE "ethereum_tx"`);
    await queryRunner.query(`DROP TABLE "reply_sent"`);
    await queryRunner.query(`DROP TABLE "reply_request"`);
    await queryRunner.query(`DROP TABLE "message_sent"`);
    await queryRunner.query(`DROP TABLE "state_transition"`);
    await queryRunner.query(`DROP TABLE "message_request"`);
    await queryRunner.query(`DROP TABLE "program"`);
    await queryRunner.query(`DROP TABLE "hash_registry"`);
    await queryRunner.query(`DROP TYPE "public"."hash_registry_type_enum"`);
    await queryRunner.query(`DROP TABLE "code"`);
    await queryRunner.query(`DROP TYPE "public"."code_status_enum"`);
    await queryRunner.query(`DROP TABLE "batch"`);
  }
};
