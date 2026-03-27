export default class Data1774560914514 {
  name = 'Data1774560914514';

  async up(db) {
    await db.query(`ALTER TABLE "program" DROP CONSTRAINT "PK_3bade5945afbafefdd26a3a29fb"`);
    await db.query(`ALTER TABLE "program" DROP COLUMN "id"`);
    await db.query(`ALTER TABLE "program" ADD "id" bytea NOT NULL`);
    await db.query(`ALTER TABLE "program" ADD CONSTRAINT "PK_3bade5945afbafefdd26a3a29fb" PRIMARY KEY ("id")`);
    await db.query(`ALTER TABLE "code" DROP CONSTRAINT "PK_367e70f79a9106b8e802e1a9825"`);
    await db.query(`ALTER TABLE "code" DROP COLUMN "id"`);
    await db.query(`ALTER TABLE "code" ADD "id" bytea NOT NULL`);
    await db.query(`ALTER TABLE "code" ADD CONSTRAINT "PK_367e70f79a9106b8e802e1a9825" PRIMARY KEY ("id")`);
    await db.query(`ALTER TABLE "message_from_program" DROP CONSTRAINT "PK_3b63d6cbfc0d932d08089decbab"`);
    await db.query(`ALTER TABLE "message_from_program" DROP COLUMN "id"`);
    await db.query(`ALTER TABLE "message_from_program" ADD "id" bytea NOT NULL`);
    await db.query(
      `ALTER TABLE "message_from_program" ADD CONSTRAINT "PK_3b63d6cbfc0d932d08089decbab" PRIMARY KEY ("id")`,
    );
    await db.query(`ALTER TABLE "message_to_program" DROP CONSTRAINT "PK_91c306dd60f61f2f1807ccbd0da"`);
    await db.query(`ALTER TABLE "message_to_program" DROP COLUMN "id"`);
    await db.query(`ALTER TABLE "message_to_program" ADD "id" bytea NOT NULL`);
    await db.query(
      `ALTER TABLE "message_to_program" ADD CONSTRAINT "PK_91c306dd60f61f2f1807ccbd0da" PRIMARY KEY ("id")`,
    );
    await db.query(`ALTER TABLE "event" DROP CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614"`);
    await db.query(`ALTER TABLE "event" DROP COLUMN "id"`);
    await db.query(`ALTER TABLE "event" ADD "id" bytea NOT NULL`);
    await db.query(`ALTER TABLE "event" ADD CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id")`);
    await db.query(`ALTER TABLE "voucher" DROP CONSTRAINT "PK_677ae75f380e81c2f103a57ffaf"`);
    await db.query(`ALTER TABLE "voucher" DROP COLUMN "id"`);
    await db.query(`ALTER TABLE "voucher" ADD "id" bytea NOT NULL`);
    await db.query(`ALTER TABLE "voucher" ADD CONSTRAINT "PK_677ae75f380e81c2f103a57ffaf" PRIMARY KEY ("id")`);
  }

  async down(db) {
    await db.query(`ALTER TABLE "program" ADD CONSTRAINT "PK_3bade5945afbafefdd26a3a29fb" PRIMARY KEY ("id")`);
    await db.query(`ALTER TABLE "program" ADD "id" character varying NOT NULL`);
    await db.query(`ALTER TABLE "program" DROP COLUMN "id"`);
    await db.query(`ALTER TABLE "program" DROP CONSTRAINT "PK_3bade5945afbafefdd26a3a29fb"`);
    await db.query(`ALTER TABLE "code" ADD CONSTRAINT "PK_367e70f79a9106b8e802e1a9825" PRIMARY KEY ("id")`);
    await db.query(`ALTER TABLE "code" ADD "id" character varying NOT NULL`);
    await db.query(`ALTER TABLE "code" DROP COLUMN "id"`);
    await db.query(`ALTER TABLE "code" DROP CONSTRAINT "PK_367e70f79a9106b8e802e1a9825"`);
    await db.query(
      `ALTER TABLE "message_from_program" ADD CONSTRAINT "PK_3b63d6cbfc0d932d08089decbab" PRIMARY KEY ("id")`,
    );
    await db.query(`ALTER TABLE "message_from_program" ADD "id" character varying NOT NULL`);
    await db.query(`ALTER TABLE "message_from_program" DROP COLUMN "id"`);
    await db.query(`ALTER TABLE "message_from_program" DROP CONSTRAINT "PK_3b63d6cbfc0d932d08089decbab"`);
    await db.query(
      `ALTER TABLE "message_to_program" ADD CONSTRAINT "PK_91c306dd60f61f2f1807ccbd0da" PRIMARY KEY ("id")`,
    );
    await db.query(`ALTER TABLE "message_to_program" ADD "id" character varying NOT NULL`);
    await db.query(`ALTER TABLE "message_to_program" DROP COLUMN "id"`);
    await db.query(`ALTER TABLE "message_to_program" DROP CONSTRAINT "PK_91c306dd60f61f2f1807ccbd0da"`);
    await db.query(`ALTER TABLE "event" ADD CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id")`);
    await db.query(`ALTER TABLE "event" ADD "id" character varying NOT NULL`);
    await db.query(`ALTER TABLE "event" DROP COLUMN "id"`);
    await db.query(`ALTER TABLE "event" DROP CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614"`);
    await db.query(`ALTER TABLE "voucher" ADD CONSTRAINT "PK_677ae75f380e81c2f103a57ffaf" PRIMARY KEY ("id")`);
    await db.query(`ALTER TABLE "voucher" ADD "id" character varying NOT NULL`);
    await db.query(`ALTER TABLE "voucher" DROP COLUMN "id"`);
    await db.query(`ALTER TABLE "voucher" DROP CONSTRAINT "PK_677ae75f380e81c2f103a57ffaf"`);
  }
}
