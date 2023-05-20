module.exports = class Data1684578399886 {
    name = 'Data1684578399886'

    async up(db) {
        await db.query(`CREATE TABLE "message" ("id" character varying NOT NULL, "payload" text NOT NULL, "destination" text NOT NULL, "source" text NOT NULL, "reply_to_message_id" text, "value" text NOT NULL, "reply" text, "expiration" integer, "type" character varying(15) NOT NULL, "block_hash" text NOT NULL, "timestamp" date NOT NULL, "entry" character varying(6), "read_reason" character varying(9), "processed_with_panic" boolean, "exit_code" integer, "is_in_mail_box" boolean, "gas_limit" text, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "message"`)
    }
}
