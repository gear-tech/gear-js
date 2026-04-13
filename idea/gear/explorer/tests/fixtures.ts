// Fixed data points sourced from squid/dump.sql.
// If these values change it means the dump was replaced — update them accordingly.

export const GENESIS = '0xfe1b4c55fd4d668101126434206571a7838a8b6b93a6d1b95d607e78e6c53763';

// ── Codes ─────────────────────────────────────────────────────────────────────

export const CODE_1_ID = '0x9b2d73f5c84907f90dfe93c5b8070597e2f9cca79505f5238f45649e2fe955a2';
export const CODE_2_ID = '0x4889e8166071650e7d6c8a35bb165faebdddd08e3d0844acc626c0bbe60e590d';
export const CODE_UPLOADER = '0xdc95b56fb734a986ee834268e2012d17b8afc5e0d1b1974bd013df7512abc466';

// ── Programs ──────────────────────────────────────────────────────────────────

// status: active, owner: PROGRAM_OWNER, codeId: CODE_1_ID
export const PROGRAM_ACTIVE_ID = '0x987cf50312043a55cf011652a7c7e2422d111c3881deb9300a022958ce7e172c';
// status: terminated, same owner and code
export const PROGRAM_TERMINATED_ID = '0xb9580cbf6f9b1d3eb80862924868fdf7dc8feed4bf96a0671f46340631bded53';
export const PROGRAM_OWNER = '0xdc95b56fb734a986ee834268e2012d17b8afc5e0d1b1974bd013df7512abc466';

// ── Messages to program ───────────────────────────────────────────────────────

// entry: init, dest: PROGRAM_ACTIVE_ID, source: PROGRAM_OWNER, service: "Token A", fn: "TKNA", processedWithPanic: false
export const MSG_TO_1_ID = '0x6630518599cb72c2237b7fa4cb7972917cd8cf1253d7328feab73571dc0cc6ac';
// entry: init, dest: PROGRAM_TERMINATED_ID, source: PROGRAM_OWNER, service: "Token B", fn: "TKNB", processedWithPanic: true
export const MSG_TO_2_ID = '0x3a6425167fa01d3dafdbc392382f08b45479fff73891b5a7aafe7b6d811da9bb';

// ── Messages from program ─────────────────────────────────────────────────────

// source: PROGRAM_ACTIVE_ID, dest: PROGRAM_OWNER, parentId: MSG_TO_1_ID, exitCode: 0
export const MSG_FROM_1_ID = '0x459436171f4f39ab11ec2b4bce1a9b4685f2895f8b595eab9e1bfd31b7f67ee3';
// source: PROGRAM_TERMINATED_ID, dest: PROGRAM_OWNER, parentId: MSG_TO_2_ID, exitCode: 1
export const MSG_FROM_2_ID = '0xf8694308506b7da2c61e6448248c4818fd62276a519b5a85cebc014bf0668955';

// ── Non-existent IDs (used for "not found" tests) ─────────────────────────────

export const UNKNOWN_ID = `0x${'ff'.repeat(32)}`;
export const UNKNOWN_GENESIS = `0x${'00'.repeat(32)}`;
