import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Wasm {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'bytea', nullable: true })
  file: Buffer;
}
