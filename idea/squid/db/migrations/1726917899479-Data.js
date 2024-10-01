module.exports = class Data1726917899479 {
    name = 'Data1726917899479'

    async up(db) {
        await db.query(`CREATE TABLE "voucher" ("id" character varying NOT NULL, "owner" character varying NOT NULL, "spender" character varying NOT NULL, "amount" bigint NOT NULL, "balance" bigint NOT NULL, "programs" jsonb NOT NULL DEFAULT '[]', "code_uploading" boolean NOT NULL, "duration" bigint NOT NULL, "expiry_at" TIMESTAMP NOT NULL, "issued_at_block" bigint NOT NULL, "issued_at" TIMESTAMP NOT NULL, "updated_at_block" bigint NOT NULL, "created_at" TIMESTAMP NOT NULL, "is_declined" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_677ae75f380e81c2f103a57ffaf" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "voucher"`)
    }
}
