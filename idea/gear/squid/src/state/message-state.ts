import type { HexString } from '@gear-js/api';
import { hexToU8a } from '@polkadot/util';
import type { Store } from '@subsquid/typeorm-store';
import type { DataCache } from 'gear-idea-common';
import { cacheKey } from 'gear-idea-indexer-db';
import { getFnNamePrefix, getServiceNamePrefix, ZERO_ADDRESS } from 'sails-js';
import { SailsMessageHeader } from 'sails-js/parser';
import { In } from 'typeorm';

import type { MessageStatus } from '../common/index.js';

import { Event, MessageFromProgram, type MessageReadReason, MessageToProgram } from '../model/index.js';
import type { ProcessorContext } from '../processor.js';
import { findChildMessageId } from '../util.js';

function parseSailsHeader(payload: string | null) {
  if (!payload) return { ok: false, header: undefined };
  return SailsMessageHeader.tryFromBytes(hexToU8a(payload));
}

function getServiceAndFn(payload: string | null) {
  if (payload === null) {
    return [null, null];
  }

  let service: string | null = null;
  let name: string | null = null;
  try {
    service = getServiceNamePrefix(payload as HexString) || null;
    if (service === null || /[^\x20-\x7E]/.test(service)) {
      return [null, null];
    }
    name = getFnNamePrefix(payload as HexString) || null;
    if (name === null || /[^\x20-\x7E]/.test(name)) {
      return [null, null];
    }
  } catch (_) {
    return [null, null];
  }

  return [service, name];
}

export class MessageState {
  private _messagesFromProgram: Map<string, MessageFromProgram>;
  private _messagesToProgram: Map<string, MessageToProgram>;
  private _events: Map<string, Event>;
  private _cachedMessages: { [key: string]: number };
  private _updatedParentIds: Set<string>;
  private _removedParentIds: Set<string>;
  private _readReasons: Map<string, MessageReadReason>;
  private _ctx: ProcessorContext<Store>;
  private readonly _cache: DataCache;
  private readonly _genesisHash: string;

  constructor(cache: DataCache, genesisHash: string) {
    this._cache = cache;
    this._genesisHash = genesisHash;
    this._messagesFromProgram = new Map();
    this._messagesToProgram = new Map();
    this._events = new Map();
    this._cachedMessages = {};
    this._updatedParentIds = new Set();
    this._removedParentIds = new Set();
    this._readReasons = new Map();
  }

  async newBatch(ctx: ProcessorContext<Store>) {
    this._ctx = ctx;
    this._messagesFromProgram.clear();
    this._messagesToProgram.clear();
    this._events.clear();
    this._readReasons.clear();
    this._updatedParentIds.clear();
    this._removedParentIds.clear();

    const temp = Object.entries(await this._cache.hGetAll(this._genesisHash));
    this._cachedMessages = {};
    temp.forEach(([key, value]) => {
      this._cachedMessages[key] = Number(value);
    });
  }

  async save() {
    await this._updateReadReasons();

    await this._ctx.store.save(Array.from(this._messagesFromProgram.values()));
    await this._ctx.store.save(Array.from(this._messagesToProgram.values()));
    await this._ctx.store.save(Array.from(this._events.values()));

    if (this._messagesFromProgram.size || this._messagesToProgram.size || this._events.size) {
      this._ctx.log.info(
        {
          from: this._messagesFromProgram.size || undefined,
          to: this._messagesToProgram.size || undefined,
          events: this._events.size || undefined,
        },
        'Messages saved',
      );
    }
  }

  async persistRedis() {
    if (this._removedParentIds.size > 0) {
      await this._cache.hDel(this._genesisHash, Array.from(this._removedParentIds));
    }
    if (this._updatedParentIds.size > 0) {
      const updates = Object.fromEntries(
        Array.from(this._updatedParentIds).map((id) => [id, this._cachedMessages[id]]),
      );
      await this._cache.hSet(this._genesisHash, updates);
    }
    await this._incrementCounts();
  }

  private async _incrementCounts() {
    const fromSource = new Map<string, number>();
    const toDest = new Map<string, number>();
    const eventSource = new Map<string, number>();

    for (const msg of this._messagesFromProgram.values()) {
      fromSource.set(msg.source, (fromSource.get(msg.source) ?? 0) + 1);
    }
    for (const msg of this._messagesToProgram.values()) {
      toDest.set(msg.destination, (toDest.get(msg.destination) ?? 0) + 1);
    }
    for (const event of this._events.values()) {
      eventSource.set(event.source, (eventSource.get(event.source) ?? 0) + 1);
    }

    const g = this._genesisHash;
    const entries = [
      ...Array.from(fromSource, ([addr, n]) => [cacheKey.messagesFromSource(g, addr), n] as [string, number]),
      ...Array.from(toDest, ([addr, n]) => [cacheKey.messagesToDestination(g, addr), n] as [string, number]),
      ...Array.from(eventSource, ([addr, n]) => [cacheKey.eventsSource(g, addr), n] as [string, number]),
    ];

    await this._cache.incrementManyIfExists(entries);
  }

  addMsgToProgram(msg: MessageToProgram) {
    const { ok, header } = parseSailsHeader(msg.payload);

    msg.isSailsIdlV2 = ok;

    if (ok && header) {
      msg.header = `0x${Buffer.from(header.toBytes()).toString('hex')}`;
      const routeIdxBuf = Buffer.allocUnsafe(4);
      routeIdxBuf.writeUInt32LE(header.routeIdx, 0);
      msg.routeIdx = `0x${routeIdxBuf.toString('hex')}`;
    } else {
      const [service, name] = getServiceAndFn(msg.payload);
      msg.service = service;
      msg.fn = name;
    }

    this._saveParentMsgId(msg.id);
    this._messagesToProgram.set(msg.id, msg);
  }

  addMsgFromProgram(msg: MessageFromProgram) {
    if (msg.payload) {
      const { ok, header } = parseSailsHeader(msg.payload);

      msg.isSailsIdlV2 = ok;

      if (ok && header) {
        msg.header = `0x${Buffer.from(header.toBytes()).toString('hex')}`;
        const routeIdxBuf = Buffer.allocUnsafe(4);
        routeIdxBuf.writeUInt32LE(header.routeIdx, 0);
        msg.routeIdx = `0x${routeIdxBuf.toString('hex')}`;
      } else {
        const [service, name] = getServiceAndFn(msg.payload);
        msg.service = service;
        msg.fn = name;
      }
    }

    if (msg.destination === ZERO_ADDRESS && msg.service && msg.fn) {
      this._addEvent(msg);
    } else {
      this._messagesFromProgram.set(msg.id, msg);
    }
  }

  setReadStatus(id: string, reason: MessageReadReason) {
    this._readReasons.set(id, reason);
  }

  async setDispatchStatuses(messages: { id: string; status: MessageStatus }[]) {
    await this._queryMsgsToProgram(messages.map(({ id }) => id));

    for (const { id, status } of messages) {
      const msg = this._messagesToProgram.get(id);
      if (msg) {
        msg.processedWithPanic = status !== 'Success';
      }
      this._removeParentMsgId(id);
    }
  }

  async getMessageId(childId: string) {
    const finder = Object.entries(this._cachedMessages).map(([parentId, nonce]) => {
      return findChildMessageId(parentId, childId, Number(nonce));
    });

    return Promise.any(finder)
      .then(({ parentId, nonce }) => {
        return this._saveParentMsgId(parentId, nonce);
      })
      .catch<null>(() => null);
  }

  private _saveParentMsgId(parentId: string, nonce = 0) {
    this._cachedMessages[parentId] = nonce;
    this._updatedParentIds.add(parentId);
    this._removedParentIds.delete(parentId);
    return parentId;
  }

  private _removeParentMsgId(parentId: string) {
    delete this._cachedMessages[parentId];
    this._removedParentIds.add(parentId);
    this._updatedParentIds.delete(parentId);
  }

  private async _queryMsgsToProgram(ids: string[]) {
    const msgsToQuery = ids.filter((id) => !this._messagesToProgram.has(id));
    if (msgsToQuery.length > 0) {
      const msgs = await this._ctx.store.find(MessageToProgram, { where: { id: In(msgsToQuery) } });
      for (const msg of msgs) {
        this._messagesToProgram.set(msg.id, msg);
      }
    }
  }

  private async _queryMsgsFromProgram(ids: string[]) {
    const msgsToQuery = ids.filter((id) => !this._messagesFromProgram.has(id));
    if (msgsToQuery.length > 0) {
      const msgs = await this._ctx.store.find(MessageFromProgram, { where: { id: In(msgsToQuery) } });
      for (const msg of msgs) {
        this._messagesFromProgram.set(msg.id, msg);
      }
    }
  }

  private async _updateReadReasons() {
    await this._queryMsgsFromProgram(Array.from(this._readReasons.keys()));
    for (const [id, reason] of this._readReasons.entries()) {
      const msg = this._messagesFromProgram.get(id);
      if (msg) {
        msg.readReason = reason;
      }
    }
  }

  private _addEvent(msg: MessageFromProgram) {
    if (msg.service === null || msg.fn === null) {
      throw new Error(`Failed to parse event from message ${msg.id}`);
    }
    this._events.set(
      msg.id,
      new Event({
        timestamp: msg.timestamp,
        blockHash: msg.blockHash,
        blockNumber: msg.blockNumber,
        id: msg.id,
        parentId: msg.parentId,
        source: msg.source,
        payload: msg.payload,
        service: msg.service,
        name: msg.fn,
      }),
    );
  }
}
