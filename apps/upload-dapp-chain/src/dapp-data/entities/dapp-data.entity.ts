import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class DappData {
  @PrimaryColumn()
  name: string; // nft | nft_marketplace

  @Column()
  id: string;

  @Column()
  repo: string;

  @Column({ nullable: true })
  codeHash: string;

  @Column({ nullable: true })
  metaWasmBase64: string;

  @Column({ nullable: true })
  optWasmBase64: string;

  @Column({ nullable: true })
  updatedAt: Date;
}
