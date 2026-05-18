// Fixed data points sourced from squid/dump.sql.
// If these values change it means the dump was replaced — update them accordingly.

export const GENESIS = '0xfe1b4c55fd4d668101126434206571a7838a8b6b93a6d1b95d607e78e6c53763';

// ── Codes ─────────────────────────────────────────────────────────────────────

export const CODE_1_ID = '0xc0d72f2ed5d60816f6dcb5e0a521f768e9d842caac9c953f0ae08df98deb8507';
export const CODE_2_ID = '0xa477e1c66a60d5a25f3fd8d752126775b2a3e451178c58030707c2ab95cc6e82';
export const CODE_UPLOADER = '0x46517ac536e39f93184971036283dead3c4a1bd7602490d5e6acf3946db31606';

// ── Programs ──────────────────────────────────────────────────────────────────

// status: active, owner: PROGRAM_OWNER, codeId: CODE_1_ID
export const PROGRAM_ACTIVE_ID = '0x07f76871e4868533d2b964b21a895b2c338d7bb728e6746cde061d244fde1626';
// status: terminated, same owner and code
export const PROGRAM_TERMINATED_ID = '0xb9580cbf6f9b1d3eb80862924868fdf7dc8feed4bf96a0671f46340631bded53';
export const PROGRAM_OWNER = '0xe978f1b1d3dab1efa436971bdc92543f16e3bd1e1ec58896527d2c3ad76aadad';

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
