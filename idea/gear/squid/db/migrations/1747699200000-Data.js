export default class Data1747699200000 {
  name = 'Data1747699200000';

  async up(db) {
    await db.query(`CREATE TYPE "public"."code_status_enum" AS ENUM('0', '1', '2')`);
    await db.query(`CREATE TYPE "public"."code_meta_type_enum" AS ENUM('0', '1')`);
    await db.query(`CREATE TYPE "public"."message_from_program_read_reason_enum" AS ENUM('0', '1', '2')`);
    await db.query(`CREATE TYPE "public"."message_to_program_entry_enum" AS ENUM('0', '1', '2')`);
    await db.query(`CREATE TYPE "public"."program_status_enum" AS ENUM('0', '1', '2', '3', '4', '5')`);
    await db.query(`CREATE TYPE "public"."program_meta_type_enum" AS ENUM('0', '1')`);

    // ── code ──────────────────────────────────────────────────────────────────
    await db.query(`ALTER TABLE "code" RENAME TO "code_old"`);
    await db.query(`ALTER TABLE "code_old" DROP CONSTRAINT "PK_367e70f79a9106b8e802e1a9825"`);
    await db.query(`
      CREATE TABLE "code" (
        "id"           character varying(66)            NOT NULL,
        "status"       "public"."code_status_enum"      NOT NULL,
        "block_number" bigint                           NOT NULL,
        "timestamp"    TIMESTAMP WITH TIME ZONE         NOT NULL,
        "meta_type"    "public"."code_meta_type_enum",
        "uploaded_by"  bytea,
        "block_hash"   bytea,
        "name"         character varying,
        "expiration"   character varying,
        "metahash"     character varying,
        CONSTRAINT "PK_367e70f79a9106b8e802e1a9825" PRIMARY KEY ("id")
      )
    `);
    await db.query(`
      INSERT INTO "code"
             ("id", "status", "block_number", "timestamp", "meta_type",
              "uploaded_by", "block_hash", "name", "expiration", "metahash")
      SELECT id,
             CASE status WHEN 'Active' THEN '0' WHEN 'Inactive' THEN '1' ELSE '2' END
               ::"public"."code_status_enum",
             block_number::bigint,
             "timestamp" AT TIME ZONE 'UTC',
             CASE meta_type WHEN 'sails' THEN '0' WHEN 'meta' THEN '1' ELSE NULL END
               ::"public"."code_meta_type_enum",
             decode(substring(uploaded_by FROM 3), 'hex'),
             decode(substring(block_hash  FROM 3), 'hex'),
             name, expiration, metahash
      FROM "code_old"
    `);
    await db.query(`DROP TABLE "code_old"`);

    // ── event ─────────────────────────────────────────────────────────────────
    await db.query(`DROP INDEX "public"."IDX_155b245dee66708209ac2883de"`);
    await db.query(`ALTER TABLE "event" RENAME TO "event_old"`);
    await db.query(`ALTER TABLE "event_old" DROP CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614"`);
    await db.query(`
      CREATE TABLE "event" (
        "id"           character varying(66)    NOT NULL,
        "block_number" bigint                   NOT NULL,
        "timestamp"    TIMESTAMP WITH TIME ZONE NOT NULL,
        "source"       bytea                    NOT NULL,
        "parent_id"    bytea,
        "block_hash"   bytea,
        "payload"      bytea,
        "service"      character varying,
        "name"         character varying,
        CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id")
      )
    `);
    await db.query(`
      INSERT INTO "event"
             ("id", "block_number", "timestamp", "source", "parent_id",
              "block_hash", "payload", "service", "name")
      SELECT id,
             block_number::bigint,
             "timestamp" AT TIME ZONE 'UTC',
             decode(substring(source     FROM 3), 'hex'),
             decode(substring(parent_id  FROM 3), 'hex'),
             decode(substring(block_hash FROM 3), 'hex'),
             decode(substring(payload    FROM 3), 'hex'),
             service, name
      FROM "event_old"
    `);
    await db.query(`DROP TABLE "event_old"`);
    await db.query(`CREATE INDEX "IDX_155b245dee66708209ac2883de" ON "event" ("source")`);

    // ── message_from_program ──────────────────────────────────────────────────
    await db.query(`DROP INDEX "public"."IDX_5c319551135829c361aa583432"`);
    await db.query(`DROP INDEX "public"."IDX_136fc941e4570dcbf0d43b1cfe"`);
    await db.query(`ALTER TABLE "message_from_program" RENAME TO "message_from_program_old"`);
    await db.query(`ALTER TABLE "message_from_program_old" DROP CONSTRAINT "PK_3b63d6cbfc0d932d08089decbab"`);
    await db.query(`
      CREATE TABLE "message_from_program" (
        "id"              character varying(66)                                    NOT NULL,
        "is_sails_idl_v2" boolean                                                  NOT NULL DEFAULT false,
        "exit_code"       integer,
        "expiration"      integer,
        "read_reason"     "public"."message_from_program_read_reason_enum",
        "value"           numeric                                                  NOT NULL DEFAULT 0,
        "block_number"    bigint                                                   NOT NULL,
        "timestamp"       TIMESTAMP WITH TIME ZONE                                NOT NULL,
        "destination"     bytea                                                    NOT NULL,
        "source"          bytea                                                    NOT NULL,
        "parent_id"       bytea,
        "block_hash"      bytea,
        "reply_to_msg_id" bytea,
        "header"          bytea,
        "route_idx"       bytea,
        "payload"         bytea,
        "service"         character varying,
        "fn"              character varying,
        "reply_code"      character varying,
        CONSTRAINT "PK_3b63d6cbfc0d932d08089decbab" PRIMARY KEY ("id")
      )
    `);
    await db.query(`
      INSERT INTO "message_from_program"
             ("id", "is_sails_idl_v2", "exit_code", "expiration", "read_reason",
              "value", "block_number", "timestamp", "destination", "source",
              "parent_id", "block_hash", "reply_to_msg_id", "header", "route_idx",
              "payload", "service", "fn", "reply_code")
      SELECT id,
             false,
             exit_code,
             expiration,
             CASE read_reason
               WHEN 'OutOfRent' THEN '0' WHEN 'Claimed' THEN '1' WHEN 'Replied' THEN '2'
               ELSE NULL
             END::"public"."message_from_program_read_reason_enum",
             value::numeric,
             block_number::bigint,
             "timestamp" AT TIME ZONE 'UTC',
             decode(substring(destination     FROM 3), 'hex'),
             decode(substring(source          FROM 3), 'hex'),
             decode(substring(parent_id       FROM 3), 'hex'),
             decode(substring(block_hash      FROM 3), 'hex'),
             decode(substring(reply_to_msg_id FROM 3), 'hex'),
             NULL, NULL,
             decode(substring(payload         FROM 3), 'hex'),
             service, fn, reply_code
      FROM "message_from_program_old"
    `);
    await db.query(`DROP TABLE "message_from_program_old"`);
    await db.query(
      `CREATE INDEX "IDX_efb03e97b43c2467d0a710f2e0" ON "message_from_program" ("parent_id") WHERE "parent_id" IS NOT NULL`,
    );
    await db.query(`CREATE INDEX "IDX_23b9bed872dd32fb59b75ae34b" ON "message_from_program" ("source", "timestamp")`);
    await db.query(
      `CREATE INDEX "IDX_f968d93d9312061b84b85a7b39" ON "message_from_program" ("destination", "timestamp")`,
    );

    // ── message_to_program ────────────────────────────────────────────────────
    await db.query(`DROP INDEX "public"."IDX_856cca228fa032025dd88fbb31"`);
    await db.query(`DROP INDEX "public"."IDX_8544e1c56bf52277d5875c30de"`);
    await db.query(`ALTER TABLE "message_to_program" RENAME TO "message_to_program_old"`);
    await db.query(`ALTER TABLE "message_to_program_old" DROP CONSTRAINT "PK_91c306dd60f61f2f1807ccbd0da"`);
    await db.query(`
      CREATE TABLE "message_to_program" (
        "id"                   character varying(66)                        NOT NULL,
        "processed_with_panic" boolean,
        "is_sails_idl_v2"      boolean                                      NOT NULL DEFAULT false,
        "entry"                "public"."message_to_program_entry_enum",
        "value"                numeric                                      NOT NULL DEFAULT 0,
        "block_number"         bigint                                       NOT NULL,
        "timestamp"            TIMESTAMP WITH TIME ZONE                    NOT NULL,
        "destination"          bytea                                        NOT NULL,
        "source"               bytea                                        NOT NULL,
        "block_hash"           bytea,
        "reply_to_msg_id"      bytea,
        "header"               bytea,
        "route_idx"            bytea,
        "payload"              bytea,
        "service"              character varying,
        "fn"                   character varying,
        CONSTRAINT "PK_91c306dd60f61f2f1807ccbd0da" PRIMARY KEY ("id")
      )
    `);
    await db.query(`
      INSERT INTO "message_to_program"
             ("id", "processed_with_panic", "is_sails_idl_v2", "entry",
              "value", "block_number", "timestamp", "destination", "source",
              "block_hash", "reply_to_msg_id", "header", "route_idx",
              "payload", "service", "fn")
      SELECT id,
             processed_with_panic,
             false,
             CASE entry
               WHEN 'init' THEN '0' WHEN 'handle' THEN '1' WHEN 'reply' THEN '2'
               ELSE NULL
             END::"public"."message_to_program_entry_enum",
             value::numeric,
             block_number::bigint,
             "timestamp" AT TIME ZONE 'UTC',
             decode(substring(destination     FROM 3), 'hex'),
             decode(substring(source          FROM 3), 'hex'),
             decode(substring(block_hash      FROM 3), 'hex'),
             decode(substring(reply_to_msg_id FROM 3), 'hex'),
             NULL, NULL,
             decode(substring(payload         FROM 3), 'hex'),
             service, fn
      FROM "message_to_program_old"
    `);
    await db.query(`DROP TABLE "message_to_program_old"`);
    await db.query(`CREATE INDEX "IDX_442e06c7a691260f740032fcad" ON "message_to_program" ("source", "timestamp")`);
    await db.query(
      `CREATE INDEX "IDX_f54ab3e3cda6fcdb7447b9afe4" ON "message_to_program" ("destination", "timestamp")`,
    );

    // ── program ───────────────────────────────────────────────────────────────
    await db.query(`DROP INDEX "public"."IDX_2156fc4598c9a1b865d85b5f1e"`);
    await db.query(`ALTER TABLE "program" RENAME TO "program_old"`);
    await db.query(`ALTER TABLE "program_old" DROP CONSTRAINT "PK_3bade5945afbafefdd26a3a29fb"`);
    await db.query(`
      CREATE TABLE "program" (
        "id"           character varying(66)              NOT NULL,
        "status"       "public"."program_status_enum"     NOT NULL DEFAULT '0',
        "block_number" bigint                             NOT NULL,
        "timestamp"    TIMESTAMP WITH TIME ZONE           NOT NULL,
        "code_id"      bytea                              NOT NULL,
        "owner"        bytea,
        "block_hash"   bytea,
        "name"         character varying,
        "expiration"   character varying,
        "meta_type"    "public"."program_meta_type_enum",
        "metahash"     character varying,
        CONSTRAINT "PK_3bade5945afbafefdd26a3a29fb" PRIMARY KEY ("id")
      )
    `);
    await db.query(`
      INSERT INTO "program"
             ("id", "status", "block_number", "timestamp", "code_id",
              "owner", "block_hash", "name", "expiration", "meta_type", "metahash")
      SELECT id,
             CASE status
               WHEN 'unknown'    THEN '0' WHEN 'programSet' THEN '1'
               WHEN 'active'     THEN '2' WHEN 'terminated' THEN '3'
               WHEN 'exited'     THEN '4' WHEN 'paused'     THEN '5'
               ELSE '0'
             END::"public"."program_status_enum",
             block_number::bigint,
             "timestamp" AT TIME ZONE 'UTC',
             decode(substring(code_id    FROM 3), 'hex'),
             decode(substring(owner      FROM 3), 'hex'),
             decode(substring(block_hash FROM 3), 'hex'),
             name, expiration,
             CASE meta_type WHEN 'sails' THEN '0' WHEN 'meta' THEN '1' ELSE NULL END
               ::"public"."program_meta_type_enum",
             metahash
      FROM "program_old"
    `);
    await db.query(`DROP TABLE "program_old"`);
    await db.query(`CREATE INDEX "IDX_73fc77872000d1b75431e1592d" ON "program" ("code_id", "timestamp")`);

    // ── voucher ───────────────────────────────────────────────────────────────
    await db.query(`ALTER TABLE "voucher" RENAME TO "voucher_old"`);
    await db.query(`ALTER TABLE "voucher_old" DROP CONSTRAINT "PK_677ae75f380e81c2f103a57ffaf"`);
    await db.query(`
      CREATE TABLE "voucher" (
        "id"               character varying(66)    NOT NULL,
        "code_uploading"   boolean                  NOT NULL,
        "is_declined"      boolean                  NOT NULL DEFAULT false,
        "amount"           numeric                  NOT NULL,
        "balance"          numeric                  NOT NULL,
        "duration"         bigint                   NOT NULL,
        "expiry_at"        TIMESTAMP WITH TIME ZONE NOT NULL,
        "issued_at_block"  bigint                   NOT NULL,
        "issued_at"        TIMESTAMP WITH TIME ZONE NOT NULL,
        "updated_at_block" bigint                   NOT NULL,
        "created_at"       TIMESTAMP WITH TIME ZONE NOT NULL,
        "owner"            bytea                    NOT NULL,
        "spender"          bytea                    NOT NULL,
        "programs"         jsonb                    NOT NULL DEFAULT '[]',
        CONSTRAINT "PK_677ae75f380e81c2f103a57ffaf" PRIMARY KEY ("id")
      )
    `);
    await db.query(`
      INSERT INTO "voucher"
             ("id", "code_uploading", "is_declined", "amount", "balance",
              "duration", "expiry_at", "issued_at_block", "issued_at",
              "updated_at_block", "created_at", "owner", "spender", "programs")
      SELECT id,
             code_uploading, is_declined, amount, balance, duration,
             expiry_at  AT TIME ZONE 'UTC',
             issued_at_block,
             issued_at  AT TIME ZONE 'UTC',
             updated_at_block,
             created_at AT TIME ZONE 'UTC',
             decode(substring(owner   FROM 3), 'hex'),
             decode(substring(spender FROM 3), 'hex'),
             programs
      FROM "voucher_old"
    `);
    await db.query(`DROP TABLE "voucher_old"`);
  }

  async down(db) {
    // ── voucher ───────────────────────────────────────────────────────────────
    await db.query(`ALTER TABLE "voucher" RENAME TO "voucher_new"`);
    await db.query(`ALTER TABLE "voucher_new" DROP CONSTRAINT "PK_677ae75f380e81c2f103a57ffaf"`);
    await db.query(`
      CREATE TABLE "voucher" (
        "id"               character varying        NOT NULL,
        "owner"            character varying        NOT NULL,
        "spender"          character varying        NOT NULL,
        "amount"           bigint                   NOT NULL,
        "balance"          bigint                   NOT NULL,
        "programs"         jsonb                    NOT NULL DEFAULT '[]',
        "code_uploading"   boolean                  NOT NULL,
        "duration"         bigint                   NOT NULL,
        "expiry_at"        TIMESTAMP                NOT NULL,
        "issued_at_block"  bigint                   NOT NULL,
        "issued_at"        TIMESTAMP                NOT NULL,
        "updated_at_block" bigint                   NOT NULL,
        "created_at"       TIMESTAMP                NOT NULL,
        "is_declined"      boolean                  NOT NULL DEFAULT false,
        CONSTRAINT "PK_677ae75f380e81c2f103a57ffaf" PRIMARY KEY ("id")
      )
    `);
    await db.query(`
      INSERT INTO "voucher"
             ("id", "owner", "spender", "amount", "balance", "programs",
              "code_uploading", "duration", "expiry_at", "issued_at_block",
              "issued_at", "updated_at_block", "created_at", "is_declined")
      SELECT id,
             '0x' || encode(owner,   'hex'),
             '0x' || encode(spender, 'hex'),
             amount, balance, programs, code_uploading, duration,
             expiry_at  AT TIME ZONE 'UTC',
             issued_at_block,
             issued_at  AT TIME ZONE 'UTC',
             updated_at_block,
             created_at AT TIME ZONE 'UTC',
             is_declined
      FROM "voucher_new"
    `);
    await db.query(`DROP TABLE "voucher_new"`);

    // ── program ───────────────────────────────────────────────────────────────
    await db.query(`DROP INDEX "public"."IDX_73fc77872000d1b75431e1592d"`);
    await db.query(`ALTER TABLE "program" RENAME TO "program_new"`);
    await db.query(`ALTER TABLE "program_new" DROP CONSTRAINT "PK_3bade5945afbafefdd26a3a29fb"`);
    await db.query(`
      CREATE TABLE "program" (
        "block_hash"   character varying(66),
        "block_number" character varying        NOT NULL,
        "timestamp"    TIMESTAMP                NOT NULL,
        "id"           character varying        NOT NULL,
        "owner"        character varying,
        "name"         character varying,
        "expiration"   character varying,
        "status"       text                     NOT NULL DEFAULT 'unknown',
        "code_id"      character varying        NOT NULL,
        "meta_type"    character varying,
        "metahash"     character varying,
        CONSTRAINT "PK_3bade5945afbafefdd26a3a29fb" PRIMARY KEY ("id")
      )
    `);
    await db.query(`
      INSERT INTO "program"
             ("block_hash", "block_number", "timestamp", "id", "owner", "name",
              "expiration", "status", "code_id", "meta_type", "metahash")
      SELECT '0x' || encode(block_hash, 'hex'),
             block_number::text,
             "timestamp" AT TIME ZONE 'UTC',
             id,
             '0x' || encode(owner,   'hex'),
             name, expiration,
             CASE status::text
               WHEN '0' THEN 'unknown'    WHEN '1' THEN 'programSet'
               WHEN '2' THEN 'active'     WHEN '3' THEN 'terminated'
               WHEN '4' THEN 'exited'     WHEN '5' THEN 'paused'
               ELSE 'unknown'
             END,
             '0x' || encode(code_id, 'hex'),
             CASE meta_type::text WHEN '0' THEN 'sails' WHEN '1' THEN 'meta' ELSE NULL END,
             metahash
      FROM "program_new"
    `);
    await db.query(`DROP TABLE "program_new"`);
    await db.query(`CREATE INDEX "IDX_2156fc4598c9a1b865d85b5f1e" ON "program" ("name")`);

    // ── message_to_program ────────────────────────────────────────────────────
    await db.query(`DROP INDEX "public"."IDX_442e06c7a691260f740032fcad"`);
    await db.query(`DROP INDEX "public"."IDX_f54ab3e3cda6fcdb7447b9afe4"`);
    await db.query(`ALTER TABLE "message_to_program" RENAME TO "message_to_program_new"`);
    await db.query(`ALTER TABLE "message_to_program_new" DROP CONSTRAINT "PK_91c306dd60f61f2f1807ccbd0da"`);
    await db.query(`
      CREATE TABLE "message_to_program" (
        "block_hash"           character varying(66),
        "block_number"         character varying     NOT NULL,
        "timestamp"            TIMESTAMP             NOT NULL,
        "id"                   character varying     NOT NULL,
        "destination"          character varying     NOT NULL,
        "source"               character varying     NOT NULL,
        "payload"              character varying,
        "value"                character varying     NOT NULL DEFAULT '0',
        "reply_to_msg_id"      character varying,
        "processed_with_panic" boolean,
        "entry"                text,
        "service"              character varying,
        "fn"                   character varying,
        CONSTRAINT "PK_91c306dd60f61f2f1807ccbd0da" PRIMARY KEY ("id")
      )
    `);
    await db.query(`
      INSERT INTO "message_to_program"
             ("block_hash", "block_number", "timestamp", "id", "destination", "source",
              "payload", "value", "reply_to_msg_id", "processed_with_panic", "entry",
              "service", "fn")
      SELECT '0x' || encode(block_hash,      'hex'),
             block_number::text,
             "timestamp" AT TIME ZONE 'UTC',
             id,
             '0x' || encode(destination,    'hex'),
             '0x' || encode(source,         'hex'),
             '0x' || encode(payload,        'hex'),
             value::text,
             '0x' || encode(reply_to_msg_id, 'hex'),
             processed_with_panic,
             CASE entry::text
               WHEN '0' THEN 'init' WHEN '1' THEN 'handle' WHEN '2' THEN 'reply'
               ELSE NULL
             END,
             service, fn
      FROM "message_to_program_new"
    `);
    await db.query(`DROP TABLE "message_to_program_new"`);
    await db.query(`CREATE INDEX "IDX_856cca228fa032025dd88fbb31" ON "message_to_program" ("destination")`);
    await db.query(`CREATE INDEX "IDX_8544e1c56bf52277d5875c30de" ON "message_to_program" ("source")`);

    // ── message_from_program ──────────────────────────────────────────────────
    await db.query(`DROP INDEX "public"."IDX_efb03e97b43c2467d0a710f2e0"`);
    await db.query(`DROP INDEX "public"."IDX_23b9bed872dd32fb59b75ae34b"`);
    await db.query(`DROP INDEX "public"."IDX_f968d93d9312061b84b85a7b39"`);
    await db.query(`ALTER TABLE "message_from_program" RENAME TO "message_from_program_new"`);
    await db.query(`ALTER TABLE "message_from_program_new" DROP CONSTRAINT "PK_3b63d6cbfc0d932d08089decbab"`);
    await db.query(`
      CREATE TABLE "message_from_program" (
        "block_hash"      character varying(66),
        "block_number"    character varying     NOT NULL,
        "timestamp"       TIMESTAMP             NOT NULL,
        "id"              character varying     NOT NULL,
        "destination"     character varying     NOT NULL,
        "source"          character varying     NOT NULL,
        "payload"         character varying,
        "value"           character varying     NOT NULL DEFAULT '0',
        "exit_code"       integer,
        "reply_to_msg_id" character varying,
        "expiration"      integer,
        "read_reason"     text,
        "service"         character varying,
        "fn"              character varying,
        "parent_id"       character varying,
        "reply_code"      character varying,
        CONSTRAINT "PK_3b63d6cbfc0d932d08089decbab" PRIMARY KEY ("id")
      )
    `);
    await db.query(`
      INSERT INTO "message_from_program"
             ("block_hash", "block_number", "timestamp", "id", "destination", "source",
              "payload", "value", "exit_code", "reply_to_msg_id", "expiration",
              "read_reason", "service", "fn", "parent_id", "reply_code")
      SELECT '0x' || encode(block_hash,       'hex'),
             block_number::text,
             "timestamp" AT TIME ZONE 'UTC',
             id,
             '0x' || encode(destination,     'hex'),
             '0x' || encode(source,          'hex'),
             '0x' || encode(payload,         'hex'),
             value::text,
             exit_code,
             '0x' || encode(reply_to_msg_id,  'hex'),
             expiration,
             CASE read_reason::text
               WHEN '0' THEN 'OutOfRent' WHEN '1' THEN 'Claimed' WHEN '2' THEN 'Replied'
               ELSE NULL
             END,
             service, fn,
             '0x' || encode(parent_id,       'hex'),
             reply_code
      FROM "message_from_program_new"
    `);
    await db.query(`DROP TABLE "message_from_program_new"`);
    await db.query(`CREATE INDEX "IDX_5c319551135829c361aa583432" ON "message_from_program" ("destination")`);
    await db.query(`CREATE INDEX "IDX_136fc941e4570dcbf0d43b1cfe" ON "message_from_program" ("source")`);

    // ── event ─────────────────────────────────────────────────────────────────
    await db.query(`DROP INDEX "public"."IDX_155b245dee66708209ac2883de"`);
    await db.query(`ALTER TABLE "event" RENAME TO "event_new"`);
    await db.query(`ALTER TABLE "event_new" DROP CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614"`);
    await db.query(`
      CREATE TABLE "event" (
        "block_hash"   character varying(66),
        "block_number" character varying     NOT NULL,
        "timestamp"    TIMESTAMP             NOT NULL,
        "id"           character varying     NOT NULL,
        "source"       character varying     NOT NULL,
        "payload"      character varying,
        "service"      character varying,
        "name"         character varying,
        "parent_id"    character varying,
        CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id")
      )
    `);
    await db.query(`
      INSERT INTO "event"
             ("block_hash", "block_number", "timestamp", "id", "source",
              "payload", "service", "name", "parent_id")
      SELECT '0x' || encode(block_hash, 'hex'),
             block_number::text,
             "timestamp" AT TIME ZONE 'UTC',
             id,
             '0x' || encode(source,    'hex'),
             '0x' || encode(payload,   'hex'),
             service, name,
             '0x' || encode(parent_id, 'hex')
      FROM "event_new"
    `);
    await db.query(`DROP TABLE "event_new"`);
    await db.query(`CREATE INDEX "IDX_155b245dee66708209ac2883de" ON "event" ("source")`);

    // ── code ──────────────────────────────────────────────────────────────────
    await db.query(`ALTER TABLE "code" RENAME TO "code_new"`);
    await db.query(`ALTER TABLE "code_new" DROP CONSTRAINT "PK_367e70f79a9106b8e802e1a9825"`);
    await db.query(`
      CREATE TABLE "code" (
        "block_hash"   character varying(66),
        "block_number" character varying     NOT NULL,
        "timestamp"    TIMESTAMP             NOT NULL,
        "id"           character varying     NOT NULL,
        "uploaded_by"  character varying,
        "name"         character varying,
        "status"       text                  NOT NULL,
        "expiration"   character varying,
        "meta_type"    character varying,
        "metahash"     character varying,
        CONSTRAINT "PK_367e70f79a9106b8e802e1a9825" PRIMARY KEY ("id")
      )
    `);
    await db.query(`
      INSERT INTO "code"
             ("block_hash", "block_number", "timestamp", "id", "uploaded_by",
              "name", "status", "expiration", "meta_type", "metahash")
      SELECT '0x' || encode(block_hash,  'hex'),
             block_number::text,
             "timestamp" AT TIME ZONE 'UTC',
             id,
             '0x' || encode(uploaded_by, 'hex'),
             name,
             CASE status::text WHEN '0' THEN 'Active' WHEN '1' THEN 'Inactive' ELSE 'Unknown' END,
             expiration,
             CASE meta_type::text WHEN '0' THEN 'sails' WHEN '1' THEN 'meta' ELSE NULL END,
             metahash
      FROM "code_new"
    `);
    await db.query(`DROP TABLE "code_new"`);

    // ── enum types ────────────────────────────────────────────────────────────
    await db.query(`DROP TYPE "public"."code_status_enum"`);
    await db.query(`DROP TYPE "public"."code_meta_type_enum"`);
    await db.query(`DROP TYPE "public"."message_from_program_read_reason_enum"`);
    await db.query(`DROP TYPE "public"."message_to_program_entry_enum"`);
    await db.query(`DROP TYPE "public"."program_status_enum"`);
    await db.query(`DROP TYPE "public"."program_meta_type_enum"`);
  }
}
