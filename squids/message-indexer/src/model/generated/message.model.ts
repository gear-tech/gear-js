import { Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_ } from 'typeorm';
import { MessageType } from './_messageType';
import { MessageEntryPoint } from './_messageEntryPoint';
import { MessageReadReason } from './_messageReadReason';

@Entity_()
export class Message {
  constructor(props?: Partial<Message>) {
    Object.assign(this, props);
  }

    @PrimaryColumn_()
      id!: string;

    @Column_('text', { nullable: false })
      payload!: string;

    @Column_('text', { nullable: false })
      destination!: string;

    @Column_('text', { nullable: false })
      source!: string;

    @Column_('text', { nullable: true })
      replyToMessageId!: string | undefined | null;

    @Column_('text', { nullable: false })
      value!: string;

    @Column_('text', { nullable: true })
      reply!: string | undefined | null;

    @Column_('int4', { nullable: true })
      expiration!: number | undefined | null;

    @Column_('varchar', { length: 15, nullable: false })
      type!: MessageType;

    @Column_('text', { nullable: false })
      blockHash!: string;

    @Column_('date', { nullable: false })
      timestamp!: Date;

    @Column_('varchar', { length: 6, nullable: true })
      entry!: MessageEntryPoint | undefined | null;

    @Column_('varchar', { length: 9, nullable: true })
      readReason!: MessageReadReason | undefined | null;

    @Column_('bool', { nullable: true })
      processedWithPanic!: boolean | undefined | null;

    @Column_('int4', { nullable: true })
      exitCode!: number | undefined | null;

    @Column_('bool', { nullable: true })
      isInMailBox!: boolean | undefined | null;

    @Column_('text', { nullable: true })
      gasLimit!: string | undefined | null;
}
