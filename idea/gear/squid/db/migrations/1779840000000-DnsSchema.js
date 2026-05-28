export default class DnsSchema1779840000000 {
  name = 'DnsSchema1779840000000';

  async up(db) {
    await db.query(`CREATE SCHEMA IF NOT EXISTS dns`);

    await db.query(`
      CREATE TABLE "dns"."dns" (
        "id"      character varying NOT NULL,
        "address" character varying NOT NULL,
        CONSTRAINT "PK_dns" PRIMARY KEY ("id")
      )
    `);

    await db.query(`
      CREATE TABLE "dns"."dns_program" (
        "id"         character varying NOT NULL,
        "name"       character varying NOT NULL,
        "address"    character varying NOT NULL,
        "admins"     text[]            NOT NULL,
        "created_by" character varying NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        CONSTRAINT "PK_dns_program" PRIMARY KEY ("id")
      )
    `);
    await db.query(`CREATE INDEX "IDX_dns_program_created_at" ON "dns"."dns_program" ("created_at")`);
    await db.query(`CREATE INDEX "IDX_dns_program_updated_at" ON "dns"."dns_program" ("updated_at")`);

    await db.query(`
      CREATE TABLE "dns"."dns_event" (
        "id"           character varying(36)    NOT NULL,
        "type"         character varying        NOT NULL,
        "raw"          text                     NOT NULL,
        "block_number" bigint                   NOT NULL,
        "tx_hash"      character varying(66)    NOT NULL,
        "timestamp"    TIMESTAMP WITH TIME ZONE NOT NULL,
        CONSTRAINT "PK_dns_event" PRIMARY KEY ("id")
      )
    `);
    await db.query(`CREATE INDEX "IDX_dns_event_block_number" ON "dns"."dns_event" ("block_number")`);
  }

  async down(db) {
    await db.query(`DROP TABLE IF EXISTS "dns"."dns_event"`);
    await db.query(`DROP TABLE IF EXISTS "dns"."dns_program"`);
    await db.query(`DROP TABLE IF EXISTS "dns"."dns"`);
    await db.query(`DROP SCHEMA IF EXISTS dns`);
  }
}
