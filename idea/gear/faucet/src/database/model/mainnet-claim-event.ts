import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

import { MainnetClaimStatus } from './enums.js';

@Entity()
@Index(['claimId', 'createdAt'])
export class MainnetClaimEvent {
  constructor(props: Partial<MainnetClaimEvent>) {
    Object.assign(this, props);
  }

  @PrimaryColumn('uuid')
  public id: string;

  @Column('uuid')
  public claimId: string;

  @Column({ type: 'enum', enum: MainnetClaimStatus, enumName: 'mainnet_claim_status_enum', nullable: true })
  public fromStatus: MainnetClaimStatus | null;

  @Column({ type: 'enum', enum: MainnetClaimStatus, enumName: 'mainnet_claim_status_enum' })
  public toStatus: MainnetClaimStatus;

  @Column({ type: 'varchar', nullable: true })
  public reasonCode: string | null;

  @Column({ type: 'jsonb', nullable: true })
  public metadata: Record<string, string> | null;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date;
}
