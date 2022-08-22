import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class DappData {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string; // nft | nft_marketplace

  @Column()
  release: string;

  @Column()
  repo: string;

  @Column({ nullable: true })
  metaWasmBase64: string;
}
