import { expect } from 'vitest';

export type Agent = ReturnType<typeof import('supertest').default>;

export const getList = (agent: Agent, path: string, query: Record<string, unknown> = {}) =>
  agent.get(path).query(query).set('Accept', 'application/json').timeout(5000);

export const getOne = (agent: Agent, path: string) => agent.get(path).set('Accept', 'application/json').timeout(5000);

// ── Response shape assertions ──────────────────────────────────────────────────

export function assertPaginated(body: any) {
  expect(body).toHaveProperty('data');
  expect(body).toHaveProperty('total');
  expect(body).toHaveProperty('limit');
  expect(body).toHaveProperty('offset');
  expect(Array.isArray(body.data)).toBe(true);
  expect(typeof body.total).toBe('number');
  expect(typeof body.limit).toBe('number');
  expect(typeof body.offset).toBe('number');
  return body;
}

export function assertNotFound(body: any) {
  expect(body).toHaveProperty('statusCode', 404);
  expect(body).toHaveProperty('message');
  expect(typeof body.message).toBe('string');
}

// ── Runtime type validators ────────────────────────────────────────────────────

/** Assert value is a 0x-prefixed hex string, optionally of a specific byte length */
export function assertHex(value: any, byteLength?: number) {
  expect(typeof value).toBe('string');
  expect(value).toMatch(/^0x[0-9a-f]*$/i);
  if (byteLength !== undefined) {
    expect(value.length - 2).toBe(byteLength * 2);
  }
}

/** Assert value is a plain string (not necessarily hex) */
export function assertString(value: any) {
  expect(typeof value).toBe('string');
}

/** Assert value is a non-negative decimal string representing a bigint */
export function assertBigintString(value: any) {
  expect(typeof value).toBe('string');
  expect(value).toMatch(/^\d+$/);
}

/** Assert value is an ISO 8601 date string */
export function assertDateString(value: any) {
  expect(typeof value).toBe('string');
  expect(value).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?$/);
  expect(Number.isNaN(Date.parse(value))).toBe(false);
}

/** Assert value is a boolean */
export function assertBoolean(value: any) {
  expect(typeof value).toBe('boolean');
}

// ── DTO validators ────────────────────────────────────────────────────────────

/** Validate a CodeResponseDto (list item or detail) */
export function validateCodeDto(c: any) {
  expect(Object.keys(c).sort()).toEqual(['createdAt', 'id', 'status']);
  assertHex(c.id, 32);
  assertString(c.status);
  assertDateString(c.createdAt);
}

/** Validate a ProgramResponseDto when loaded as a nested relation */
export function validateProgramDto(p: any, expectCode = false) {
  const keys = ['blockNumber', 'createdAt', 'id', 'txHash'];
  if (p.abiInterfaceAddress !== undefined) keys.push('abiInterfaceAddress');
  if (expectCode) keys.push('code');
  expect(Object.keys(p).sort()).toEqual(keys.sort());

  assertHex(p.id); // IDs are 20-byte Ethereum addresses, not 32-byte
  assertBigintString(p.blockNumber);
  assertHex(p.txHash);
  assertDateString(p.createdAt);

  if (p.abiInterfaceAddress !== undefined) {
    expect(p.abiInterfaceAddress === null || typeof p.abiInterfaceAddress === 'string').toBe(true);
    if (p.abiInterfaceAddress !== null) assertHex(p.abiInterfaceAddress);
  }

  if (expectCode && p.code != null) {
    validateCodeDto(p.code);
  }
}

/** Validate a BatchResponseDto */
export function validateBatchDto(b: any) {
  expect(Object.keys(b).sort()).toEqual([
    'blockHash',
    'blockTimestamp',
    'committedAt',
    'committedAtBlock',
    'expiry',
    'id',
    'previousCommittedBatchHash',
  ]);
  assertHex(b.id, 32);
  assertHex(b.blockHash);
  assertHex(b.previousCommittedBatchHash);
  assertBigintString(b.expiry);
  assertBigintString(b.blockTimestamp);
  assertBigintString(b.committedAtBlock);
  assertDateString(b.committedAt);
}

/** Validate a TransactionListResponseDto */
export function validateTransactionListDto(t: any) {
  expect(Object.keys(t).sort()).toEqual(['blockNumber', 'contractAddress', 'createdAt', 'id', 'selector', 'sender']);
  assertHex(t.id, 32);
  assertHex(t.contractAddress);
  assertHex(t.sender);
  assertHex(t.selector);
  assertBigintString(t.blockNumber);
  assertDateString(t.createdAt);
}

/** Validate a TransactionDetailResponseDto */
export function validateTransactionDetailDto(t: any) {
  expect(Object.keys(t).sort()).toEqual([
    'blockNumber',
    'contractAddress',
    'createdAt',
    'data',
    'id',
    'selector',
    'sender',
  ]);
  assertHex(t.id, 32);
  assertHex(t.contractAddress);
  assertHex(t.sender);
  assertHex(t.selector);
  assertHex(t.data);
  assertBigintString(t.blockNumber);
  assertDateString(t.createdAt);
}

/** Validate a StateTransitionResponseDto */
export function validateStateTransitionDto(st: any, expectRelations = false) {
  const keys = ['createdAt', 'exited', 'hash', 'id', 'inheritor', 'programId', 'valueToReceive'];
  if (expectRelations && st.program !== undefined) keys.push('program');
  if (expectRelations && st.batch !== undefined) keys.push('batch');
  expect(Object.keys(st).sort()).toEqual(keys.sort());

  assertHex(st.id); // 8-byte in current dump
  assertHex(st.hash);
  assertHex(st.programId); // 20-byte Ethereum address
  assertBoolean(st.exited);

  if (st.valueToReceive !== null) assertBigintString(st.valueToReceive);
  else expect(st.valueToReceive).toBeNull();

  if (st.inheritor !== null) assertHex(st.inheritor);
  else expect(st.inheritor).toBeNull();

  assertDateString(st.createdAt);

  if (expectRelations && st.program !== undefined && st.program !== null) validateProgramDto(st.program);
  if (expectRelations && st.batch !== undefined && st.batch !== null) validateBatchDto(st.batch);
}

/** Validate a MessageRequestResponseDto */
export function validateMessageRequestDto(m: any, expectRelation = false) {
  const keys = [
    'blockNumber',
    'callReply',
    'createdAt',
    'id',
    'payload',
    'programId',
    'sourceAddress',
    'txHash',
    'value',
  ];
  if (expectRelation && m.program !== undefined) keys.push('program');
  expect(Object.keys(m).sort()).toEqual(keys.sort());

  assertHex(m.id, 32);
  assertHex(m.sourceAddress);
  assertHex(m.programId);
  assertHex(m.txHash);
  assertBoolean(m.callReply);
  assertBigintString(m.value);
  assertBigintString(m.blockNumber);
  assertHex(m.payload);
  assertDateString(m.createdAt);

  if (expectRelation && m.program != null) validateProgramDto(m.program);
}

/** Validate a MessageSentResponseDto */
export function validateMessageSentDto(m: any, expectRelation = false) {
  const keys = ['createdAt', 'destination', 'id', 'isCall', 'payload', 'sourceProgramId', 'stateTransitionId', 'value'];
  if (expectRelation && m.sourceProgram !== undefined) keys.push('sourceProgram');
  expect(Object.keys(m).sort()).toEqual(keys.sort());

  assertHex(m.id, 32);
  assertHex(m.sourceProgramId);
  assertHex(m.destination);
  assertHex(m.stateTransitionId);
  assertBigintString(m.value);
  assertBoolean(m.isCall);
  assertHex(m.payload);
  assertDateString(m.createdAt);

  if (expectRelation && m.sourceProgram != null) validateProgramDto(m.sourceProgram);
}

/** Validate a ReplyRequestResponseDto */
export function validateReplyRequestDto(r: any, expectRelation = false) {
  const keys = ['blockNumber', 'createdAt', 'id', 'payload', 'programId', 'sourceAddress', 'txHash', 'value'];
  if (expectRelation && r.program !== undefined) keys.push('program');
  expect(Object.keys(r).sort()).toEqual(keys.sort());

  assertHex(r.id, 32);
  assertHex(r.sourceAddress);
  assertHex(r.programId);
  assertHex(r.txHash);
  assertBigintString(r.value);
  assertBigintString(r.blockNumber);
  assertHex(r.payload);
  assertDateString(r.createdAt);

  if (expectRelation && r.program != null) validateProgramDto(r.program);
}

/** Validate a ReplySentResponseDto */
export function validateReplySentDto(r: any, expectRelation = false) {
  const keys = [
    'createdAt',
    'destination',
    'id',
    'isCall',
    'payload',
    'repliedToId',
    'replyCode',
    'sourceProgramId',
    'stateTransitionId',
    'value',
  ];
  if (expectRelation && r.sourceProgram !== undefined) keys.push('sourceProgram');
  expect(Object.keys(r).sort()).toEqual(keys.sort());

  assertHex(r.id, 32);
  assertHex(r.repliedToId);
  assertHex(r.sourceProgramId);
  assertHex(r.destination);
  assertHex(r.stateTransitionId);
  assertString(r.replyCode);
  assertBoolean(r.isCall);
  assertBigintString(r.value);
  assertHex(r.payload);
  assertDateString(r.createdAt);

  if (expectRelation && r.sourceProgram != null) validateProgramDto(r.sourceProgram);
}

/** Validate an InjectedTransactionResponseDto */
export function validateInjectedTransactionDto(t: any) {
  expect(Object.keys(t).sort()).toEqual([
    'createdAt',
    'destination',
    'id',
    'payload',
    'referenceBlock',
    'salt',
    'senderAddress',
    'signature',
    'value',
  ]);
  assertHex(t.id, 32);
  assertHex(t.destination);
  assertHex(t.senderAddress);
  assertHex(t.referenceBlock);
  assertHex(t.salt);
  assertHex(t.signature);
  assertBigintString(t.value);
  assertHex(t.payload);
  assertDateString(t.createdAt);
}
