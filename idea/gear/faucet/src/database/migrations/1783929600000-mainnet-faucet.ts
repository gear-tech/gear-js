import type { MigrationInterface, QueryRunner } from 'typeorm';

export class MainnetFaucet1783929600000 implements MigrationInterface {
  name = 'MainnetFaucet1783929600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."mainnet_claim_status_enum" AS ENUM('created', 'validated', 'rejected', 'queued', 'submitting', 'submitted', 'in_block', 'reconciliation_required', 'finalized', 'failed_retryable', 'failed_terminal')`,
    );
    await queryRunner.query(
      `CREATE TABLE "mainnet_challenge" ("id" uuid NOT NULL, "canonicalWallet" character varying NOT NULL, "address" character varying NOT NULL, "genesis" character varying NOT NULL, "nonce" character varying NOT NULL, "message" text NOT NULL, "messageHex" character varying NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "used" boolean NOT NULL DEFAULT false, "usedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_mainnet_challenge" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "mainnet_claim" ("id" uuid NOT NULL, "challengeId" uuid NOT NULL, "idempotencyKey" character varying NOT NULL, "canonicalWallet" character varying NOT NULL, "address" character varying NOT NULL, "genesis" character varying NOT NULL, "amount" numeric NOT NULL, "deviceHash" character varying NOT NULL, "fullIpHash" character varying NOT NULL, "subnetHash" character varying NOT NULL, "country" character varying, "asn" character varying, "isVpn" boolean NOT NULL DEFAULT false, "isProxy" boolean NOT NULL DEFAULT false, "isTor" boolean NOT NULL DEFAULT false, "isDatacenter" boolean NOT NULL DEFAULT false, "status" "public"."mainnet_claim_status_enum" NOT NULL DEFAULT 'created', "publicReasonCode" character varying, "internalReasonCode" character varying, "transactionHash" character varying, "blockHash" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_mainnet_claim" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "mainnet_claim" ADD "payoutStartedAt" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(
      `CREATE TABLE "mainnet_claim_event" ("id" uuid NOT NULL, "claimId" uuid NOT NULL, "fromStatus" "public"."mainnet_claim_status_enum", "toStatus" "public"."mainnet_claim_status_enum" NOT NULL, "reasonCode" character varying, "metadata" jsonb, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_mainnet_claim_event" PRIMARY KEY ("id"), CONSTRAINT "FK_mainnet_claim_event_claim" FOREIGN KEY ("claimId") REFERENCES "mainnet_claim"("id") ON DELETE CASCADE)`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_mainnet_challenge_wallet" ON "mainnet_challenge" ("canonicalWallet")`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_mainnet_claim_wallet" ON "mainnet_claim" ("canonicalWallet") WHERE "status" != 'rejected'`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_mainnet_claim_idempotency" ON "mainnet_claim" ("idempotencyKey")`,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_mainnet_claim_challenge" ON "mainnet_claim" ("challengeId")`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_mainnet_claim_transaction_hash" ON "mainnet_claim" ("transactionHash") WHERE "transactionHash" IS NOT NULL`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_mainnet_claim_device" ON "mainnet_claim" ("deviceHash")`);
    await queryRunner.query(`CREATE INDEX "IDX_mainnet_claim_full_ip" ON "mainnet_claim" ("fullIpHash")`);
    await queryRunner.query(`CREATE INDEX "IDX_mainnet_claim_subnet" ON "mainnet_claim" ("subnetHash")`);
    await queryRunner.query(`CREATE INDEX "IDX_mainnet_claim_status" ON "mainnet_claim" ("status")`);
    await queryRunner.query(`CREATE INDEX "IDX_mainnet_claim_created_at" ON "mainnet_claim" ("createdAt")`);
    await queryRunner.query(
      `CREATE INDEX "IDX_mainnet_claim_payout_started_at" ON "mainnet_claim" ("payoutStartedAt")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_mainnet_claim_event_claim_created" ON "mainnet_claim_event" ("claimId", "createdAt")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_mainnet_claim_event_claim_created"`);
    await queryRunner.query(`DROP TABLE "mainnet_claim_event"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_mainnet_claim_payout_started_at"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_mainnet_claim_created_at"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_mainnet_claim_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_mainnet_claim_subnet"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_mainnet_claim_full_ip"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_mainnet_claim_device"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_mainnet_claim_transaction_hash"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_mainnet_claim_challenge"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_mainnet_claim_idempotency"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_mainnet_claim_wallet"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_mainnet_challenge_wallet"`);
    await queryRunner.query(`DROP TABLE "mainnet_claim"`);
    await queryRunner.query(`DROP TABLE "mainnet_challenge"`);
    await queryRunner.query(`DROP TYPE "public"."mainnet_claim_status_enum"`);
  }
}
