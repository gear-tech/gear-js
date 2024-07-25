module.exports = class Data1721905384294 {
    name = 'Data1721905384294'

    async up(db) {
        await db.query(`CREATE TABLE "program" ("block_hash" character varying(66), "block_number" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL, "id" character varying NOT NULL, "owner" character varying, "name" character varying, "expiration" character varying, "status" text NOT NULL DEFAULT 'unknown', "code_id" character varying NOT NULL, "meta_type" character varying, "metahash" character varying, "has_state" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_3bade5945afbafefdd26a3a29fb" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_2156fc4598c9a1b865d85b5f1e" ON "program" ("name") `)
        await db.query(`CREATE TABLE "code" ("block_hash" character varying(66), "block_number" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL, "id" character varying NOT NULL, "uploaded_by" character varying, "name" character varying, "status" text NOT NULL, "expiration" character varying, "metahash" character varying, "has_state" boolean, "meta_type" character varying, CONSTRAINT "PK_367e70f79a9106b8e802e1a9825" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "message_from_program" ("block_hash" character varying(66), "block_number" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL, "id" character varying NOT NULL, "destination" character varying NOT NULL, "source" character varying NOT NULL, "payload" character varying, "value" character varying NOT NULL DEFAULT '0', "exit_code" integer, "reply_to_msg_id" character varying, "expiration" integer, "read_reason" text, CONSTRAINT "PK_3b63d6cbfc0d932d08089decbab" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_5c319551135829c361aa583432" ON "message_from_program" ("destination") `)
        await db.query(`CREATE INDEX "IDX_136fc941e4570dcbf0d43b1cfe" ON "message_from_program" ("source") `)
        await db.query(`CREATE TABLE "message_to_program" ("block_hash" character varying(66), "block_number" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL, "id" character varying NOT NULL, "destination" character varying NOT NULL, "source" character varying NOT NULL, "payload" character varying, "value" character varying NOT NULL DEFAULT '0', "reply_to_msg_id" character varying, "processed_with_panic" boolean, "entry" text, CONSTRAINT "PK_91c306dd60f61f2f1807ccbd0da" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_856cca228fa032025dd88fbb31" ON "message_to_program" ("destination") `)
        await db.query(`CREATE INDEX "IDX_8544e1c56bf52277d5875c30de" ON "message_to_program" ("source") `)
        await db.query(`CREATE TABLE "event" ("block_hash" character varying(66), "block_number" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL, "id" character varying NOT NULL, "source" character varying NOT NULL, "payload" character varying, "service" character varying, "name" character varying, CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_155b245dee66708209ac2883de" ON "event" ("source") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "program"`)
        await db.query(`DROP INDEX "public"."IDX_2156fc4598c9a1b865d85b5f1e"`)
        await db.query(`DROP TABLE "code"`)
        await db.query(`DROP TABLE "message_from_program"`)
        await db.query(`DROP INDEX "public"."IDX_5c319551135829c361aa583432"`)
        await db.query(`DROP INDEX "public"."IDX_136fc941e4570dcbf0d43b1cfe"`)
        await db.query(`DROP TABLE "message_to_program"`)
        await db.query(`DROP INDEX "public"."IDX_856cca228fa032025dd88fbb31"`)
        await db.query(`DROP INDEX "public"."IDX_8544e1c56bf52277d5875c30de"`)
        await db.query(`DROP TABLE "event"`)
        await db.query(`DROP INDEX "public"."IDX_155b245dee66708209ac2883de"`)
    }
}
