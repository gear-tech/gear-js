import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

import { MainnetClaimStatus } from './enums.js';

@Entity()
@Index(['canonicalWallet'], { unique: true, where: `"status" != 'rejected'` })
@Index(['idempotencyKey'], { unique: true })
@Index(['challengeId'], { unique: true })
@Index(['transactionHash'], { unique: true, where: '"transactionHash" IS NOT NULL' })
@Index(['deviceHash'])
@Index(['fullIpHash'])
@Index(['subnetHash'])
@Index(['status'])
@Index(['payoutStartedAt'])
export class MainnetClaim {
  constructor(props: Partial<MainnetClaim>) {
    Object.assign(this, props);
  }

  @PrimaryColumn('uuid')
  public id: string;

  @Column('uuid')
  public challengeId: string;

  @Column()
  public idempotencyKey: string;

  @Column()
  public canonicalWallet: string;

  @Column()
  public address: string;

  @Column()
  public genesis: string;

  @Column({ type: 'numeric' })
  public amount: string;

  @Column()
  public deviceHash: string;

  @Column()
  public fullIpHash: string;

  @Column()
  public subnetHash: string;

  @Column({ type: 'varchar', nullable: true })
  public country: string | null;

  @Column({ type: 'varchar', nullable: true })
  public asn: string | null;

  @Column({ default: false })
  public isVpn: boolean;

  @Column({ default: false })
  public isProxy: boolean;

  @Column({ default: false })
  public isTor: boolean;

  @Column({ default: false })
  public isDatacenter: boolean;

  @Column({
    type: 'enum',
    enum: MainnetClaimStatus,
    enumName: 'mainnet_claim_status_enum',
    default: MainnetClaimStatus.Created,
  })
  public status: MainnetClaimStatus;

  @Column({ type: 'varchar', nullable: true })
  public publicReasonCode: string | null;

  @Column({ type: 'varchar', nullable: true })
  public internalReasonCode: string | null;

  @Column({ type: 'varchar', nullable: true })
  public transactionHash: string | null;

  @Column({ type: 'varchar', nullable: true })
  public blockHash: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  public payoutStartedAt: Date | null;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public updatedAt: Date;
}
