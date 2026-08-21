import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class MainnetChallenge {
  constructor(props: Partial<MainnetChallenge>) {
    Object.assign(this, props);
  }

  @PrimaryColumn('uuid')
  public id: string;

  @Index()
  @Column()
  public canonicalWallet: string;

  @Column()
  public address: string;

  @Column()
  public genesis: string;

  @Column()
  public nonce: string;

  @Column({ type: 'text' })
  public message: string;

  @Column()
  public messageHex: string;

  @Column({ type: 'timestamptz' })
  public expiresAt: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date;

  @Column({ default: false })
  public used: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  public usedAt: Date | null;
}
