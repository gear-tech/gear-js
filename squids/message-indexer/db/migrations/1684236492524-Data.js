module.exports = class Data1684236492524 {
    name = 'Data1684236492524'

    async up(db) {
        await db.query(`CREATE TABLE "message" ("id" character varying NOT NULL, "payload" text, "destination" text, "source" text, "reply_to_message_id" text, "value" text, "reply" text, "expiration" integer, "type" character varying(15) NOT NULL, "block_hash" text, "timestamp" date NOT NULL, "entry" character varying(6), "read_reason" character varying(9), "processed_with_panic" boolean, "exit_code" integer, "is_in_mail_box" boolean, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "message"`)
    }
}
