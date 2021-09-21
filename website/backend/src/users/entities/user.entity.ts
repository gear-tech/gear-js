import { json } from 'express';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, unique: true })
  telegramId: string;

  @Column({ nullable: true, unique: true })
  githubId: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  photoUrl: string;

  @Column({ nullable: true })
  authDate: string;

  @Column({ nullable: true })
  authKey: string;

  @Column({ nullable: true })
  accessToken: string;

  @Column({ nullable: true })
  publicKey: string;
}
