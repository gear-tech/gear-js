module.exports = class Data1725704609634 {
    name = 'Data1725704609634'

    async up(db) {
        await db.query(`ALTER TABLE "message_from_program" ADD "parent_id" character varying`)
        await db.query(`ALTER TABLE "event" ADD "parent_id" character varying`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "message_from_program" DROP COLUMN "parent_id"`)
        await db.query(`ALTER TABLE "event" DROP COLUMN "parent_id"`)
    }
}
