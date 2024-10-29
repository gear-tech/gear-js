import { SubmittableExtrinsic } from '@polkadot/api/types';
import { GearApi } from './GearApi';
import { ISubmittableResult } from '@polkadot/types/types';
import { HexString, Proof } from 'types';

export class GearEthBridge {
  constructor(private api: GearApi) {}

  async authoritySetHash(): Promise<HexString | null> {
    const result = await this.api.query.gearEthBridge.authoritySetHash();

    try {
      const hash = result.unwrap();
      return hash.toHex();
    } catch {
      return null;
    }
  }

  async clearTimer(): Promise<number> {
    const result = await this.api.query.gearEthBridge.clearTimer();
    return result.unwrapOrDefault().toNumber();
  }

  async isInitialized(): Promise<boolean> {
    const result = await this.api.query.gearEthBridge.initialized();
    return result.toHuman();
  }

  async getMessageNonce(): Promise<bigint> {
    const result = await this.api.query.gearEthBridge.messageNonce();

    return result.toBigInt();
  }

  async isPaused(): Promise<boolean> {
    const result = await this.api.query.gearEthBridge.paused();
    return result.toHuman();
  }

  async getQueue(): Promise<Array<HexString>> {
    const result = await this.api.query.gearEthBridge.queue();
    return result.toArray().map((hash) => hash.toHex());
  }

  async isQueueChanged(): Promise<boolean> {
    const result = await this.api.query.gearEthBridge.queueChanged();
    return result.toHuman();
  }

  async getQueueMerkleRoot(): Promise<HexString | null> {
    const result = await this.api.query.gearEthBridge.queueMerkleRoot();
    try {
      const hash = result.unwrap();
      return hash.toHex();
    } catch {
      return null;
    }
  }

  async getSessionsTimer(): Promise<number> {
    const result = await this.api.query.gearEthBridge.sessionsTimer();
    return result.toNumber();
  }

  sendEthMessage(
    destination: HexString | Uint8Array,
    payload: HexString | Uint8Array,
  ): SubmittableExtrinsic<'promise', ISubmittableResult> {
    return this.api.tx.gearEthBridge.sendEthMessage(destination, payload);
  }

  async merkleProof(hash: HexString | Uint8Array, at?: HexString | Uint8Array): Promise<Proof> {
    return this.api.rpc.gearEthBridge.merkleProof(hash, at);
  }

  get maxPayloadSize(): number {
    return this.api.consts.gearEthBridge.maxPayloadSize.toNumber();
  }

  get queueCapacity(): number {
    return this.api.consts.gearEthBridge.queueCapacity.toNumber();
  }

  get sessionsPerEra(): number {
    return this.api.consts.gearEthBridge.sessionsPerEra.toNumber();
  }
}
