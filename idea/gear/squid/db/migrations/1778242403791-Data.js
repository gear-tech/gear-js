export default class Data1778242403791 {
  name = 'Data1778242403791';

  async up(db) {
    await db.query(`CREATE TYPE "public"."code_status_enum" AS ENUM('0', '1', '2')`);
    await db.query(`CREATE TYPE "public"."code_meta_type_enum" AS ENUM('0', '1')`);
    await db.query(
      `CREATE TABLE "code" ("id" bytea NOT NULL, "status" "public"."code_status_enum" NOT NULL, "block_number" bigint NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "meta_type" "public"."code_meta_type_enum", "uploaded_by" bytea, "block_hash" bytea, "name" character varying, "expiration" character varying, "metahash" character varying, CONSTRAINT "PK_367e70f79a9106b8e802e1a9825" PRIMARY KEY ("id"))`,
    );
    await db.query(
      `CREATE TABLE "event" ("id" bytea NOT NULL, "block_number" bigint NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "source" bytea NOT NULL, "parent_id" bytea, "block_hash" bytea, "payload" bytea, "service" character varying, "name" character varying, CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`,
    );
    await db.query(`CREATE INDEX "IDX_155b245dee66708209ac2883de" ON "event" ("source") `);
    await db.query(`CREATE TYPE "public"."message_from_program_read_reason_enum" AS ENUM('0', '1', '2')`);
    await db.query(
      `CREATE TABLE "message_from_program" ("id" bytea NOT NULL, "is_sails_idl_v2" boolean NOT NULL DEFAULT false, "exit_code" integer, "expiration" integer, "read_reason" "public"."message_from_program_read_reason_enum", "value" bigint NOT NULL DEFAULT 0, "block_number" bigint NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "destination" bytea NOT NULL, "source" bytea NOT NULL, "parent_id" bytea, "block_hash" bytea, "reply_to_msg_id" bytea, "header" bytea, "route_idx" bytea, "payload" bytea, "service" character varying, "fn" character varying, "reply_code" character varying, CONSTRAINT "PK_3b63d6cbfc0d932d08089decbab" PRIMARY KEY ("id"))`,
    );
    await db.query(
      `CREATE INDEX "IDX_efb03e97b43c2467d0a710f2e0" ON "message_from_program" ("parent_id") WHERE "parent_id" IS NOT NULL`,
    );
    await db.query(`CREATE INDEX "IDX_23b9bed872dd32fb59b75ae34b" ON "message_from_program" ("source", "timestamp") `);
    await db.query(
      `CREATE INDEX "IDX_f968d93d9312061b84b85a7b39" ON "message_from_program" ("destination", "timestamp") `,
    );
    await db.query(`CREATE TYPE "public"."message_to_program_entry_enum" AS ENUM('0', '1', '2')`);
    await db.query(
      `CREATE TABLE "message_to_program" ("id" bytea NOT NULL, "processed_with_panic" boolean, "is_sails_idl_v2" boolean NOT NULL DEFAULT false, "entry" "public"."message_to_program_entry_enum", "value" bigint NOT NULL DEFAULT 0, "block_number" bigint NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "destination" bytea NOT NULL, "source" bytea NOT NULL, "block_hash" bytea, "reply_to_msg_id" bytea, "header" bytea, "route_idx" bytea, "payload" bytea, "service" character varying, "fn" character varying, CONSTRAINT "PK_91c306dd60f61f2f1807ccbd0da" PRIMARY KEY ("id"))`,
    );
    await db.query(`CREATE INDEX "IDX_442e06c7a691260f740032fcad" ON "message_to_program" ("source", "timestamp") `);
    await db.query(
      `CREATE INDEX "IDX_f54ab3e3cda6fcdb7447b9afe4" ON "message_to_program" ("destination", "timestamp") `,
    );
    await db.query(`CREATE TYPE "public"."program_status_enum" AS ENUM('0', '1', '2', '3', '4', '5')`);
    await db.query(`CREATE TYPE "public"."program_meta_type_enum" AS ENUM('0', '1')`);
    await db.query(
      `CREATE TABLE "program" ("id" bytea NOT NULL, "status" "public"."program_status_enum" NOT NULL DEFAULT '0', "block_number" bigint NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "code_id" bytea NOT NULL, "owner" bytea, "block_hash" bytea, "name" character varying, "expiration" character varying, "meta_type" "public"."program_meta_type_enum", "metahash" character varying, CONSTRAINT "PK_3bade5945afbafefdd26a3a29fb" PRIMARY KEY ("id"))`,
    );
    await db.query(`CREATE INDEX "IDX_73fc77872000d1b75431e1592d" ON "program" ("code_id", "timestamp") `);
    await db.query(
      `CREATE TABLE "voucher" ("id" bytea NOT NULL, "code_uploading" boolean NOT NULL, "is_declined" boolean NOT NULL DEFAULT false, "amount" bigint NOT NULL, "balance" bigint NOT NULL, "duration" bigint NOT NULL, "expiry_at" TIMESTAMP WITH TIME ZONE NOT NULL, "issued_at_block" bigint NOT NULL, "issued_at" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_at_block" bigint NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "owner" bytea NOT NULL, "spender" bytea NOT NULL, "programs" jsonb NOT NULL DEFAULT '[]', CONSTRAINT "PK_677ae75f380e81c2f103a57ffaf" PRIMARY KEY ("id"))`,
    );
  }

  async down(db) {
    await db.query(`DROP TABLE "voucher"`);
    await db.query(`DROP INDEX "public"."IDX_73fc77872000d1b75431e1592d"`);
    await db.query(`DROP TABLE "program"`);
    await db.query(`DROP TYPE "public"."program_meta_type_enum"`);
    await db.query(`DROP TYPE "public"."program_status_enum"`);
    await db.query(`DROP INDEX "public"."IDX_f54ab3e3cda6fcdb7447b9afe4"`);
    await db.query(`DROP INDEX "public"."IDX_442e06c7a691260f740032fcad"`);
    await db.query(`DROP TABLE "message_to_program"`);
    await db.query(`DROP TYPE "public"."message_to_program_entry_enum"`);
    await db.query(`DROP INDEX "public"."IDX_f968d93d9312061b84b85a7b39"`);
    await db.query(`DROP INDEX "public"."IDX_23b9bed872dd32fb59b75ae34b"`);
    await db.query(`DROP INDEX "public"."IDX_efb03e97b43c2467d0a710f2e0"`);
    await db.query(`DROP INDEX "public"."IDX_1a5a1c6f2cbb2a2b37ce150dbd"`);
    await db.query(`DROP TABLE "message_from_program"`);
    await db.query(`DROP TYPE "public"."message_from_program_read_reason_enum"`);
    await db.query(`DROP INDEX "public"."IDX_155b245dee66708209ac2883de"`);
    await db.query(`DROP TABLE "event"`);
    await db.query(`DROP TABLE "code"`);
    await db.query(`DROP TYPE "public"."code_meta_type_enum"`);
    await db.query(`DROP TYPE "public"."code_status_enum"`);
  }
}
