import { randomUUID } from 'node:crypto';
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { Client } from 'pg';
import { DataSource } from 'typeorm';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import config from '../src/config.js';
import { AppDataSource } from '../src/database/app-data-source.js';
import { init1746533767543 } from '../src/database/migrations/1746533767543-init.js';
import { RequestType1760434006491 } from '../src/database/migrations/1760434006491-request_type.js';
import { Wvara1765801294946 } from '../src/database/migrations/1765801294946-wvara.js';
import { MainnetFaucet1783929600000 } from '../src/database/migrations/1783929600000-mainnet-faucet.js';
import {
  FaucetRequest,
  FaucetType,
  MainnetChallenge,
  MainnetClaim,
  MainnetClaimEvent,
  MainnetClaimStatus,
  RequestStatus,
  UserLastSeen,
} from '../src/database/model/index.js';
import { LastSeenService, RequestService } from '../src/services/db/index.js';

interface DbConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

const TREASURY_ADVISORY_LOCK_ID = 1_780_000_001;
const dataSources: DataSource[] = [];
const databases: string[] = [];

let container: StartedPostgreSqlContainer | null = null;
let dbConfig: DbConfig | null = null;

beforeAll(async () => {
  try {
    container = await new PostgreSqlContainer('postgres:15-alpine')
      .withDatabase('mainnet_faucet_test')
      .withUsername('test')
      .withPassword('test')
      .start();

    dbConfig = {
      host: container.getHost(),
      port: container.getMappedPort(5432),
      username: container.getUsername(),
      password: container.getPassword(),
      database: container.getDatabase(),
    };
  } catch (error) {
    if (process.env.TEST_DB_HOST) {
      dbConfig = {
        host: process.env.TEST_DB_HOST,
        port: Number(process.env.TEST_DB_PORT ?? 5432),
        username: process.env.TEST_DB_USERNAME ?? process.env.USER ?? 'postgres',
        password: process.env.TEST_DB_PASSWORD ?? '',
        database: process.env.TEST_DB_DATABASE ?? 'postgres',
      };
      return;
    }

    throw new Error(
      `PostgreSQL integration tests require a running Docker daemon or TEST_DB_HOST. Original testcontainers error: ${String(error)}`,
    );
  }
});

afterEach(async () => {
  while (dataSources.length > 0) {
    const dataSource = dataSources.pop()!;
    if (dataSource.isInitialized) await dataSource.destroy();
  }

  while (databases.length > 0) {
    const database = databases.pop()!;
    await dropDatabase(database);
  }
});

afterAll(async () => {
  await container?.stop();
});

describe('mainnet faucet PostgreSQL integration', () => {
  it('keeps legacy enum values and historical requests while accepting Bridge and WVARA without a genesis', async () => {
    const dataSource = await createDataSource('retirement', true);
    await dataSource.runMigrations();
    const repo = dataSource.getRepository(FaucetRequest);
    const address = '0x0000000000000000000000000000000000000001';
    const genesis = '0x525639f713f397dcf839bd022cd821f367ebcf179de7b9253531f8adbe5436d6';
    const historical = [FaucetType.VaraTestnet, FaucetType.BridgeVaraTestnet].flatMap((type) =>
      [RequestStatus.Pending, RequestStatus.Processing, RequestStatus.Completed, RequestStatus.Failed].map(
        (status) => new FaucetRequest({ address, target: genesis, type, status }),
      ),
    );
    await repo.save(historical);
    const before = await repo.find({ order: { id: 'ASC' } });
    const getRepository = vi
      .spyOn(AppDataSource, 'getRepository')
      .mockImplementation(dataSource.getRepository.bind(dataSource));
    const oldBridge = config.bridge.erc20Contracts;
    const oldWvara = config.wvara.address;
    config.bridge.erc20Contracts = [['0x0000000000000000000000000000000000000002', '10']];
    config.wvara.address = '0x0000000000000000000000000000000000000003';
    try {
      const service = new RequestService(new LastSeenService());
      await service.resetProcessing();
      expect(await service.getRequestsToProcess([FaucetType.BridgeErc20, FaucetType.WVara])).toEqual([]);
      expect(await repo.find({ order: { id: 'ASC' } })).toEqual(before);
      await service.newRequest(address, config.bridge.erc20Contracts[0][0], FaucetType.BridgeErc20);
      await service.newRequest(address, config.wvara.address, FaucetType.WVara);
      const active = await service.getRequestsToProcess([FaucetType.BridgeErc20, FaucetType.WVara]);
      expect(active.map(({ type }) => type).sort()).toEqual([FaucetType.BridgeErc20, FaucetType.WVara]);
      expect((await repo.find({ order: { id: 'ASC' } })).slice(0, 8)).toEqual(before);
      const labels = await dataSource.query(
        "SELECT enumlabel FROM pg_enum WHERE enumtypid = 'faucet_request_type_enum'::regtype ORDER BY enumsortorder",
      );
      expect(labels.map(({ enumlabel }: { enumlabel: string }) => enumlabel)).toEqual(['0', '1', '2', '3']);
    } finally {
      getRepository.mockRestore();
      config.bridge.erc20Contracts = oldBridge;
      config.wvara.address = oldWvara;
    }
  });

  it('applies and reverts the mainnet faucet migration', async () => {
    const dataSource = await createDataSource('migration');

    await dataSource.runMigrations();

    const tables = await dataSource.query<{ table_name: string }[]>(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('mainnet_challenge', 'mainnet_claim', 'mainnet_claim_event')
      ORDER BY table_name
    `);
    expect(tables.map(({ table_name }) => table_name)).toEqual([
      'mainnet_challenge',
      'mainnet_claim',
      'mainnet_claim_event',
    ]);

    const enumExists = await dataSource.query<{ exists: boolean }[]>(`
      SELECT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'mainnet_claim_status_enum'
      )
    `);
    expect(enumExists[0].exists).toBe(true);

    const indexes = await loadMainnetIndexes(dataSource);
    expect(indexes.get('IDX_mainnet_claim_wallet')).toMatch(
      /WHERE \("status" <> 'rejected'|WHERE \(status <> 'rejected'/,
    );
    expect(indexes.get('IDX_mainnet_claim_transaction_hash')).toContain('WHERE ("transactionHash" IS NOT NULL)');
    expect(indexes.get('IDX_mainnet_claim_challenge')).toContain('UNIQUE INDEX');
    expect(indexes.get('IDX_mainnet_claim_idempotency')).toContain('UNIQUE INDEX');
    expect(indexes.get('IDX_mainnet_claim_status')).toMatch(/USING btree \("status"\)|USING btree \(status\)/);
    expect(indexes.get('IDX_mainnet_claim_payout_started_at')).toContain('USING btree ("payoutStartedAt")');
    expect(indexes.get('IDX_mainnet_claim_event_claim_created')).toContain('USING btree ("claimId", "createdAt")');

    await dataSource.undoLastMigration();

    const removedTable = await dataSource.query<{ table_name: string | null }[]>(
      `SELECT to_regclass('public.mainnet_claim') AS table_name`,
    );
    expect(removedTable[0].table_name).toBeNull();

    const removedEnum = await dataSource.query<{ exists: boolean }[]>(`
      SELECT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'mainnet_claim_status_enum'
      )
    `);
    expect(removedEnum[0].exists).toBe(false);
  });

  it('enforces partial unique claim indexes with real PostgreSQL constraints', async () => {
    const dataSource = await createMigratedDataSource('indexes');
    const canonicalWallet = `wallet_${randomUUID()}`;
    const transactionHash = `0x${randomUUID().replace(/-/g, '')}`;

    await insertClaim(dataSource, {
      canonicalWallet,
      idempotencyKey: randomUUID(),
      challengeId: randomUUID(),
      status: MainnetClaimStatus.Rejected,
    });
    await insertClaim(dataSource, {
      canonicalWallet,
      idempotencyKey: randomUUID(),
      challengeId: randomUUID(),
      status: MainnetClaimStatus.Queued,
    });

    await expect(
      insertClaim(dataSource, {
        canonicalWallet,
        idempotencyKey: randomUUID(),
        challengeId: randomUUID(),
        status: MainnetClaimStatus.Queued,
      }),
    ).rejects.toMatchObject({ code: '23505', constraint: 'IDX_mainnet_claim_wallet' });

    await expect(
      insertClaim(dataSource, {
        canonicalWallet: `wallet_${randomUUID()}`,
        idempotencyKey: randomUUID(),
        challengeId: randomUUID(),
        transactionHash,
      }),
    ).resolves.toBeUndefined();
    await expect(
      insertClaim(dataSource, {
        canonicalWallet: `wallet_${randomUUID()}`,
        idempotencyKey: randomUUID(),
        challengeId: randomUUID(),
        transactionHash,
      }),
    ).rejects.toMatchObject({ code: '23505', constraint: 'IDX_mainnet_claim_transaction_hash' });

    await expect(
      insertClaim(dataSource, {
        canonicalWallet: `wallet_${randomUUID()}`,
        idempotencyKey: randomUUID(),
        challengeId: randomUUID(),
      }),
    ).resolves.toBeUndefined();
    await expect(
      insertClaim(dataSource, {
        canonicalWallet: `wallet_${randomUUID()}`,
        idempotencyKey: randomUUID(),
        challengeId: randomUUID(),
      }),
    ).resolves.toBeUndefined();
  });

  it('serializes challenge consumption with row-level locks', async () => {
    const dataSource = await createMigratedDataSource('challenge_lock');
    const challengeId = await insertChallenge(dataSource);
    const firstRunner = dataSource.createQueryRunner();
    const secondRunner = dataSource.createQueryRunner();

    await firstRunner.connect();
    await secondRunner.connect();
    try {
      await firstRunner.startTransaction();
      await secondRunner.startTransaction();

      const locked = (await firstRunner.query(`SELECT id, used FROM "mainnet_challenge" WHERE id = $1 FOR UPDATE`, [
        challengeId,
      ])) as { id: string; used: boolean }[];
      expect(locked[0]).toMatchObject({ id: challengeId, used: false });

      await secondRunner.query(`SET LOCAL lock_timeout = '100ms'`);
      await expect(
        secondRunner.query(`SELECT id FROM "mainnet_challenge" WHERE id = $1 FOR UPDATE`, [challengeId]),
      ).rejects.toMatchObject({
        code: '55P03',
      });
      await secondRunner.rollbackTransaction();

      await firstRunner.query(`UPDATE "mainnet_challenge" SET used = true, "usedAt" = now() WHERE id = $1`, [
        challengeId,
      ]);
      await firstRunner.commitTransaction();

      await secondRunner.startTransaction();
      const consumed = (await secondRunner.query(`SELECT used FROM "mainnet_challenge" WHERE id = $1 FOR UPDATE`, [
        challengeId,
      ])) as { used: boolean }[];
      expect(consumed[0].used).toBe(true);
      await secondRunner.commitTransaction();
    } finally {
      if (secondRunner.isTransactionActive) await secondRunner.rollbackTransaction();
      if (firstRunner.isTransactionActive) await firstRunner.rollbackTransaction();
      await secondRunner.release();
      await firstRunner.release();
    }
  });

  it('lets payout workers skip already locked queued claims', async () => {
    const dataSource = await createMigratedDataSource('skip_locked');
    const firstClaimId = randomUUID();
    const secondClaimId = randomUUID();
    const thirdClaimId = randomUUID();

    await insertClaim(dataSource, { id: firstClaimId, idempotencyKey: randomUUID(), challengeId: randomUUID() });
    await insertClaim(dataSource, { id: secondClaimId, idempotencyKey: randomUUID(), challengeId: randomUUID() });
    await insertClaim(dataSource, { id: thirdClaimId, idempotencyKey: randomUUID(), challengeId: randomUUID() });

    const firstRunner = dataSource.createQueryRunner();
    const secondRunner = dataSource.createQueryRunner();
    await firstRunner.connect();
    await secondRunner.connect();
    try {
      await firstRunner.startTransaction();
      await secondRunner.startTransaction();

      const firstBatch = (await firstRunner.query(claimBatchSql(1), [MainnetClaimStatus.Queued])) as { id: string }[];
      const secondBatch = (await secondRunner.query(claimBatchSql(10), [MainnetClaimStatus.Queued])) as {
        id: string;
      }[];

      expect(firstBatch.map(({ id }) => id)).toEqual([firstClaimId]);
      expect(secondBatch.map(({ id }) => id)).toEqual([secondClaimId, thirdClaimId]);
    } finally {
      if (secondRunner.isTransactionActive) await secondRunner.rollbackTransaction();
      if (firstRunner.isTransactionActive) await firstRunner.rollbackTransaction();
      await secondRunner.release();
      await firstRunner.release();
    }
  });

  it('holds the treasury advisory lock for the transaction lifetime', async () => {
    const dataSource = await createMigratedDataSource('advisory_lock');
    const firstRunner = dataSource.createQueryRunner();
    const secondRunner = dataSource.createQueryRunner();
    await firstRunner.connect();
    await secondRunner.connect();
    try {
      await firstRunner.startTransaction();
      await secondRunner.startTransaction();

      await firstRunner.query(`SELECT pg_advisory_xact_lock($1)`, [TREASURY_ADVISORY_LOCK_ID]);
      const blocked = (await secondRunner.query(`SELECT pg_try_advisory_xact_lock($1) AS locked`, [
        TREASURY_ADVISORY_LOCK_ID,
      ])) as { locked: boolean }[];
      expect(blocked[0].locked).toBe(false);

      await firstRunner.commitTransaction();
      const acquired = (await secondRunner.query(`SELECT pg_try_advisory_xact_lock($1) AS locked`, [
        TREASURY_ADVISORY_LOCK_ID,
      ])) as { locked: boolean }[];
      expect(acquired[0].locked).toBe(true);

      await secondRunner.commitTransaction();
    } finally {
      if (secondRunner.isTransactionActive) await secondRunner.rollbackTransaction();
      if (firstRunner.isTransactionActive) await firstRunner.rollbackTransaction();
      await secondRunner.release();
      await firstRunner.release();
    }
  });
});

async function createMigratedDataSource(name: string) {
  const dataSource = await createDataSource(name);
  await dataSource.runMigrations();
  return dataSource;
}

async function createDataSource(name: string, includeLegacy = false) {
  if (!dbConfig) throw new Error('PostgreSQL test database is not configured');

  const database = `mainnet_faucet_${name}_${randomUUID().replace(/-/g, '')}`;
  await createDatabase(database);
  databases.push(database);

  const dataSource = new DataSource({
    type: 'postgres',
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database,
    synchronize: false,
    migrationsRun: false,
    entities: [
      MainnetChallenge,
      MainnetClaim,
      MainnetClaimEvent,
      ...(includeLegacy ? [FaucetRequest, UserLastSeen] : []),
    ],
    migrations: [
      ...(includeLegacy ? [init1746533767543, RequestType1760434006491, Wvara1765801294946] : []),
      MainnetFaucet1783929600000,
    ],
    logging: false,
  });

  await dataSource.initialize();
  dataSources.push(dataSource);

  return dataSource;
}

async function createDatabase(database: string) {
  const admin = await createAdminClient();
  try {
    await admin.query(`CREATE DATABASE "${database}"`);
  } finally {
    await admin.end();
  }
}

async function dropDatabase(database: string) {
  const admin = await createAdminClient();
  try {
    await admin.query(`SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = $1`, [database]);
    await admin.query(`DROP DATABASE IF EXISTS "${database}"`);
  } finally {
    await admin.end();
  }
}

async function createAdminClient() {
  if (!dbConfig) throw new Error('PostgreSQL test database is not configured');

  const client = new Client({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
  });
  await client.connect();
  return client;
}

async function loadMainnetIndexes(dataSource: DataSource) {
  const rows = await dataSource.query<{ indexname: string; indexdef: string }[]>(`
    SELECT indexname, indexdef
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename IN ('mainnet_challenge', 'mainnet_claim', 'mainnet_claim_event')
  `);
  return new Map(rows.map(({ indexname, indexdef }) => [indexname, indexdef]));
}

async function insertChallenge(dataSource: DataSource) {
  const id = randomUUID();
  await dataSource.query(
    `
      INSERT INTO "mainnet_challenge"
        (id, "canonicalWallet", address, genesis, nonce, message, "messageHex", "expiresAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, now() + interval '5 minutes')
    `,
    [id, `wallet_${id}`, `address_${id}`, '0xgenesis', `nonce_${id}`, `message_${id}`, `0x${id.replace(/-/g, '')}`],
  );
  return id;
}

async function insertClaim(dataSource: DataSource, overrides: Partial<MainnetClaim> = {}) {
  const id = overrides.id ?? randomUUID();
  const challengeId = overrides.challengeId ?? randomUUID();
  const idempotencyKey = overrides.idempotencyKey ?? randomUUID();
  const canonicalWallet = overrides.canonicalWallet ?? `wallet_${id}`;

  await dataSource.query(
    `
      INSERT INTO "mainnet_claim"
        (
          id,
          "challengeId",
          "idempotencyKey",
          "canonicalWallet",
          address,
          genesis,
          amount,
          "deviceHash",
          "fullIpHash",
          "subnetHash",
          status,
          "transactionHash",
          "createdAt",
          "updatedAt"
        )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, now(), now())
    `,
    [
      id,
      challengeId,
      idempotencyKey,
      canonicalWallet,
      overrides.address ?? `address_${id}`,
      overrides.genesis ?? '0xgenesis',
      overrides.amount ?? '1000000000000',
      overrides.deviceHash ?? `device_${id}`,
      overrides.fullIpHash ?? `full_ip_${id}`,
      overrides.subnetHash ?? `subnet_${id}`,
      overrides.status ?? MainnetClaimStatus.Queued,
      overrides.transactionHash ?? null,
    ],
  );
}

function claimBatchSql(limit: number) {
  return `
    SELECT id
    FROM "mainnet_claim"
    WHERE status = $1
    ORDER BY "createdAt" ASC, id ASC
    LIMIT ${limit}
    FOR UPDATE SKIP LOCKED
  `;
}
