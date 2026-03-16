import { config } from './config';

export const hasProps = (obj: object, props: string[]) => {
  expect(Object.keys(obj)).toHaveLength(props.length);

  props.forEach((prop) => {
    expect(obj).toHaveProperty(prop);
  });
};

export const waitNBlocks = async (count: number) =>
  new Promise((resolve) => setTimeout(resolve, count * config.blockTime * 1_000));

/** Asserts value is a `0x`-prefixed hex string. */
export const expectHex = (value: unknown) => {
  expect(typeof value).toBe('string');
  expect(value as string).toMatch(/^0x[0-9a-f]*/i);
};

/**
 * Asserts value is numeric (number or bigint).
 * JSON-RPC returns plain numbers; bigint is accepted for future-proofing.
 */
export const expectNumeric = (value: unknown) => {
  expect(['number', 'bigint']).toContain(typeof value);
};

/** Asserts value is null or a `{ hash: string; len: number }` MaybeHash. */
export const expectMaybeHash = (value: unknown) => {
  if (value === null) return;
  expect(typeof value).toBe('string');
};

/** Asserts a Dispatch object has the expected shape and field types. */
export const expectDispatch = (d: unknown) => {
  expect(typeof (d as any).id).toBe('string');
  expect(['Init', 'Handle', 'Reply', 'Signal']).toContain((d as any).kind);
  expect(typeof (d as any).source).toBe('string');
  expectNumeric((d as any).value);
  expect(typeof (d as any).call).toBe('boolean');
  expect(['Canonical', 'Injected']).toContain((d as any).messageType);
  // PayloadLookup: either { Direct: Hex } or { Stored: Hash }
  const payload = (d as any).payload;
  expect(typeof payload).toBe('object');
  expect('Direct' in payload || 'Stored' in payload).toBe(true);
  if ('Direct' in payload) expectHex(payload.Direct);
  if ('Stored' in payload) expectHex(payload.Stored);
};

/** Asserts a StateTransition object has the expected shape and field types. */
export const expectStateTransition = (t: unknown) => {
  const tr = t as any;
  expectHex(tr.actorId);
  expectHex(tr.newStateHash);
  expect(typeof tr.exited).toBe('boolean');
  expectHex(tr.inheritor);
  expectNumeric(tr.valueToReceive);
  expect(typeof tr.valueToReceiveNegativeSign).toBe('boolean');
  expect(Array.isArray(tr.valueClaims)).toBe(true);
  expect(Array.isArray(tr.messages)).toBe(true);

  for (const claim of tr.valueClaims) {
    expect(typeof claim.messageId).toBe('string');
    expectHex(claim.destination);
    expectNumeric(claim.value);
  }

  for (const msg of tr.messages) {
    expect(typeof msg.id).toBe('string');
    expectHex(msg.destination);
    expect(Array.isArray(msg.payload)).toBe(true);
    expectNumeric(msg.value);
    expect(typeof msg.call).toBe('boolean');
  }
};

/** Asserts a BlockRequestEvent has the expected shape. */
export const expectBlockRequestEvent = (e: unknown) => {
  const event = e as any;
  const hasRouter = 'Router' in event;
  const hasMirror = 'Mirror' in event;
  expect(hasRouter || hasMirror).toBe(true);

  if (hasRouter) {
    const inner = event.Router;
    const variants = [
      'CodeValidationRequested',
      'ComputationSettingsChanged',
      'ProgramCreated',
      'StorageSlotChanged',
      'ValidatorsCommittedForEra',
    ];
    const variant = variants.find((v) => v in inner);
    expect(variant).toBeDefined();
  }

  if (hasMirror) {
    expectHex(event.Mirror.actorId);
    expect(typeof event.Mirror.event).toBe('object');
    const variants = [
      'OwnedBalanceTopUpRequested',
      'ExecutableBalanceTopUpRequested',
      'MessageQueueingRequested',
      'ReplyQueueingRequested',
      'ValueClaimingRequested',
    ];
    const variant = variants.find((v) => v in event.Mirror.event);
    expect(variant).toBeDefined();
  }
};
