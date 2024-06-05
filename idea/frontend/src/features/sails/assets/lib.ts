/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { GearApi, decodeAddress } from '@gear-js/api';
import { TypeRegistry } from '@polkadot/types';
import { TransactionBuilder, getServiceNamePrefix, getFnNamePrefix, ZERO_ADDRESS } from 'sails-js';

export type Error =
  | 'notAuthorized'
  | 'zeroResourceId'
  | 'resourceAlreadyExists'
  | 'resourceNotFound'
  | 'wrongResourceType'
  | 'partNotFound';

export type Resource = { basic: BasicResource } | { slot: SlotResource } | { composed: ComposedResource };

export interface BasicResource {
  src: string;
  thumb: string | null;
  metadata_uri: string;
}

export interface SlotResource {
  src: string;
  thumb: string;
  metadata_uri: string;
  base: string;
  slot: number;
}

export interface ComposedResource {
  src: string;
  thumb: string;
  metadata_uri: string;
  base: string;
  parts: Array<number>;
}

export class Program {
  public readonly registry: TypeRegistry;
  public readonly rmrkResource: RmrkResource;

  constructor(public api: GearApi, public programId?: `0x${string}`) {
    const types: Record<string, any> = {
      Error: {
        _enum: [
          'NotAuthorized',
          'ZeroResourceId',
          'ResourceAlreadyExists',
          'ResourceNotFound',
          'WrongResourceType',
          'PartNotFound',
        ],
      },
      Resource: { _enum: { Basic: 'BasicResource', Slot: 'SlotResource', Composed: 'ComposedResource' } },
      BasicResource: { src: 'String', thumb: 'Option<String>', metadata_uri: 'String' },
      SlotResource: { src: 'String', thumb: 'String', metadata_uri: 'String', base: '[u8;32]', slot: 'u32' },
      ComposedResource: { src: 'String', thumb: 'String', metadata_uri: 'String', base: '[u8;32]', parts: 'Vec<u32>' },
    };

    this.registry = new TypeRegistry();
    this.registry.setKnownTypes({ types });
    this.registry.register(types);

    this.rmrkResource = new RmrkResource(this);
  }

  newCtorFromCode(code: Uint8Array | Buffer): TransactionBuilder<null> {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      'upload_program',
      'New',
      'String',
      'String',
      code,
    );

    this.programId = builder.programId;
    return builder;
  }

  newCtorFromCodeId(codeId: `0x${string}`) {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      'create_program',
      'New',
      'String',
      'String',
      codeId,
    );

    this.programId = builder.programId;
    return builder;
  }
}

export class RmrkResource {
  constructor(private _program: Program) {}

  public addPartToResource(resource_id: number, part_id: number): TransactionBuilder<{ ok: number } | { err: Error }> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<{ ok: number } | { err: Error }>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['RmrkResource', 'AddPartToResource', resource_id, part_id],
      '(String, String, u8, u32)',
      'Result<u32, Error>',
      this._program.programId,
    );
  }

  public addResourceEntry(
    resource_id: number,
    resource: Resource,
  ): TransactionBuilder<{ ok: [number, Resource] } | { err: Error }> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<{ ok: [number, Resource] } | { err: Error }>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['RmrkResource', 'AddResourceEntry', resource_id, resource],
      '(String, String, u8, Resource)',
      'Result<(u8, Resource), Error>',
      this._program.programId,
    );
  }

  public async resource(
    resource_id: number,
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<{ ok: Resource } | { err: Error }> {
    const payload = this._program.registry
      .createType('(String, String, u8)', ['RmrkResource', 'Resource', resource_id])
      .toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    const result = this._program.registry.createType('(String, String, Result<Resource, Error>)', reply.payload);
    return result[2].toJSON() as unknown as { ok: Resource } | { err: Error };
  }

  public subscribeToResourceAddedEvent(
    callback: (data: { resource_id: number }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'RmrkResource' && getFnNamePrefix(payload) === 'ResourceAdded') {
        callback(
          this._program.registry.createType('(String, String, {"resource_id":"u8"})', message.payload)[2].toJSON() as {
            resource_id: number;
          },
        );
      }
    });
  }

  public subscribeToPartAddedEvent(
    callback: (data: { resource_id: number; part_id: number }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'RmrkResource' && getFnNamePrefix(payload) === 'PartAdded') {
        callback(
          this._program.registry
            .createType('(String, String, {"resource_id":"u8","part_id":"u32"})', message.payload)[2]
            .toJSON() as { resource_id: number; part_id: number },
        );
      }
    });
  }
}
