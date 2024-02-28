import { MigrationInterface, QueryRunner } from 'typeorm';
import { UUID, randomUUID } from 'crypto';

const updateProgramsQuery = (queryRunner: QueryRunner, programCodeMap: Map<string, string>) => {
  const updateQueries = Array.from(programCodeMap.entries()).map(([programId, codeId]) => {
    return queryRunner.query(`UPDATE program SET code_id = '${codeId}' WHERE id = '${programId}';`);
  });

  return Promise.all(updateQueries);
};

const preparePrograms = async (queryRunner: QueryRunner, down = false) => {
  const codeIdsMap = new Map<string, string>();
  const programCodeMap = new Map<string, string>();

  const codes = (await queryRunner.query(`SELECT _id, id FROM code`)) as any[];

  codes.forEach(({ _id, id }) => {
    down ? codeIdsMap.set(id, _id) : codeIdsMap.set(_id, id);
  });

  const programs = (await queryRunner.query(`SELECT id, code_id FROM program`)) as any[];

  programs.forEach(({ id, code_id }) => {
    if (!codeIdsMap.has(code_id)) {
      throw new Error('Code not found');
    }
    programCodeMap.set(id, codeIdsMap.get(code_id));
  });

  return [codeIdsMap, programCodeMap];
};

const prepareStatesUp = async (queryRunner: QueryRunner, codeIdsMap: Map<string, string>) => {
  const stateCodeMap = new Map<string, any>();

  const stateCodes = (await queryRunner.query(`SELECT "codeId", "stateId", "stateHex" FROM state_to_code`)) as any[];

  stateCodes.forEach(({ codeId, stateId, stateHex }) => {
    stateCodeMap.set(stateId, { codeId: codeIdsMap.get(codeId), stateHex });
  });

  return stateCodeMap;
};

const updateStates = async (queryRunner: QueryRunner, stateCodeMap: Map<string, any>) => {
  const updateQueries = Array.from(stateCodeMap.entries()).map(([stateId, { codeId, stateHex }]) => {
    return queryRunner.query(`UPDATE state SET code_id = '${codeId}', id = '${stateHex}' WHERE id = '${stateId}';`);
  });

  return Promise.all(updateQueries);
};

const updateMessages = async (queryRunner: QueryRunner) => {
  const programs = await queryRunner.query(`SELECT id, _id FROM program`);

  for (let i = 0; i < programs.length; i++) {
    await queryRunner.query(`
        UPDATE message SET program_id = '${programs[i]._id}' WHERE destination = '${programs[i].id}';
    `);
    await queryRunner.query(`
        UPDATE message SET program_id = '${programs[i]._id}' WHERE source = '${programs[i].id}';
    `);

    console.log(`Updated messages of ${i} programs`);
  }
};

const updateStatesDown = async (queryRunner: QueryRunner, codesMap: Map<string, string>) => {
  const states = await queryRunner.query(`SELECT id, code_id FROM state`);
  const statesMap = new Map<string, { stateId: UUID; codeId: string }>();

  states.forEach(({ id, code_id }) => {
    statesMap.set(id, { stateId: randomUUID(), codeId: code_id });
  });

  for (const [id, { stateId, codeId }] of statesMap) {
    await queryRunner.query(`UPDATE state SET id = '${stateId}' WHERE id = '${id}'`);
    await queryRunner.query(`
      INSERT INTO state_to_code ("codeId", "stateId", "stateHex", "code_id") 
      VALUES ('${codeId}', '${stateId}', '${id}', '${codesMap.get(codeId)}')
   `);
  }
};

export class DropRelations1707831399009 implements MigrationInterface {
  transaction?: boolean;
  name = 'DropRelations1707831399009';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const [codesMap, programsMap] = await preparePrograms(queryRunner);

    await queryRunner.query(`
        ALTER TABLE "message" DROP CONSTRAINT "FK_b8e38090b7fc53bdce979813f76"
    `);
    await queryRunner.query(`
        ALTER TABLE "message" DROP COLUMN "program_id"
    `);

    await queryRunner.query(`
        ALTER TABLE "program" DROP CONSTRAINT "FK_0a5783ec166b1a3d42ba1143f99"
    `);
    await queryRunner.query(`
        DROP INDEX "public"."IDX_a08fe3dc85de760c624254da6a"
    `);
    await queryRunner.query(`
        ALTER TABLE "program" DROP COLUMN "code_id"
    `);
    await queryRunner.query(`
        ALTER TABLE "program"
        ADD "code_id" character varying
    `);
    await updateProgramsQuery(queryRunner, programsMap);

    await queryRunner.query(`
        ALTER TABLE "program"
        ALTER COLUMN "code_id" SET NOT NULL
    `);
    await queryRunner.query(`
        ALTER TABLE "code"
        ALTER COLUMN "_id" SET DEFAULT uuid_generate_v4();
    `);
    await queryRunner.query(`
        ALTER TABLE "program"
        ALTER COLUMN "_id" SET DEFAULT uuid_generate_v4();
    `);

    const statesMap = await prepareStatesUp(queryRunner, codesMap);

    await queryRunner.query(`DROP TABLE state_to_code;`);

    await queryRunner.query(`
            ALTER TABLE "state"
            ADD "code_id" character varying
    `);

    await queryRunner.query(`
        ALTER TABLE "state"
        ALTER COLUMN "id" DROP DEFAULT
    `);

    await queryRunner.query(`
        ALTER TABLE "state"
        ALTER COLUMN "id" TYPE character varying
    `);

    await updateStates(queryRunner, statesMap);

    await queryRunner.query(`
        ALTER TABLE "state"
        ALTER COLUMN "id" SET NOT NULL
    `);

    await queryRunner.query(`
        ALTER TABLE "state"
        ALTER COLUMN "code_id" SET NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const [codesMap, programMap] = await preparePrograms(queryRunner, true);

    await queryRunner.query(`
        ALTER TABLE "program" DROP COLUMN "code_id"
    `);
    await queryRunner.query(`
        ALTER TABLE "program"
        ADD "code_id" uuid
    `);
    await updateProgramsQuery(queryRunner, programMap);

    await queryRunner.query(`
        ALTER TABLE "program"
        ADD CONSTRAINT "FK_0a5783ec166b1a3d42ba1143f99" FOREIGN KEY ("code_id") REFERENCES "code"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
        ALTER TABLE "message"
        ADD "program_id" uuid
    `);

    await updateMessages(queryRunner);

    await queryRunner.query(`
        ALTER TABLE "message"
        ADD CONSTRAINT "FK_b8e38090b7fc53bdce979813f76" FOREIGN KEY ("program_id") REFERENCES "program"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
        CREATE TABLE "state_to_code" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "codeId" character varying NOT NULL,
            "stateId" uuid NOT NULL,
            "stateHex" character varying NOT NULL,
            "code_id" uuid,
            CONSTRAINT "PK_f4189c7208d247ff74101eba8e4" PRIMARY KEY ("id")
        )
    `);

    await updateStatesDown(queryRunner, codesMap);

    await queryRunner.query(`
        ALTER TABLE "state"
        ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()
    `);

    await queryRunner.query(`
        ALTER TABLE "state"
        ALTER COLUMN "id" SET NOT NULL
    `);

    await queryRunner.query(`
        ALTER TABLE "state"
        ALTER COLUMN "id" TYPE uuid USING id::uuid
    `);

    await queryRunner.query(`
        ALTER TABLE "state" DROP COLUMN "code_id"
    `);

    await queryRunner.query(`
        ALTER TABLE "state_to_code"
        ADD CONSTRAINT "FK_9fa5d2837b9b9275af7c3e4785d" FOREIGN KEY ("code_id") REFERENCES "code"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
        ALTER TABLE "state_to_code"
        ADD CONSTRAINT "FK_fa9cf57f13ab8aa9fa41d96e64f" FOREIGN KEY ("stateId") REFERENCES "state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
        CREATE INDEX "IDX_a08fe3dc85de760c624254da6a" ON "block" ("genesis")
    `);
  }
}
