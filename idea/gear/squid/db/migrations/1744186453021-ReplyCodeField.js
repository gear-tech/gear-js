module.exports = class ReplyCodeField1744186453021 {
    name = 'ReplyCodeField1744186453021'

    async up(db) {
        await db.query(`ALTER TABLE "message_from_program" ADD "reply_code" character varying`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "message_from_program" DROP COLUMN "reply_code"`)
    }
}
