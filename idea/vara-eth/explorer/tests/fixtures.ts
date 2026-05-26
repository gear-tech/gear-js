// Fixed data points sourced from dump.sql.
// If these values change it means the dump was replaced — update them accordingly.

// ── Addresses ─────────────────────────────────────────────────────────────────

export const SENDER_1 = '0xab83545b2463e7bab6e8cc31394730e7d98c4fea'; // ethereum_tx sender
export const SENDER_2 = '0xbb644dd8b6498ee8f6dbaf538cccd1bcd47326c9'; // ethereum_tx sender
export const CONTRACT_1 = '0xe549b0afeda978271ff7e712232b9f7f39a0b060'; // ethereum_tx contract_address
export const DEST_1 = '0xda4e9d4ec673284e5108e31f1c7be0b8e6ece2d5'; // message/reply source_address

// ── Codes ─────────────────────────────────────────────────────────────────────

export const CODE_1_ID = '0xb12247b9fb9ac431da2949403d29b7c99488e98597db09a1d19e8812e06982cd';
export const CODE_2_ID = '0xf88e56ad4ee91457f558c213681393a87732a32bd28441dd40ea5dcfa79483b6';
export const CODE_3_ID = '0x2299304fe4b897f081843cf937273b458f1719a7f9cd600dae4494eb92f2ac8a';

// ── Programs (20-byte Ethereum addresses) ───────────────────────────────────────

export const PROGRAM_1_ID = '0xebf617f7cc1974a74d04d9e2fe510e287442c67b'; // code relation null because code_id not in dump
export const PROGRAM_2_ID = '0xe965f213f4aeadd7569ece21b8413b187dc3c986';
export const PROGRAM_3_ID = '0x519bc68e2ecaa23d2d6bae439e69b440b5593090';

// All dumped programs reference this code_id (not present in the 3 copied code rows)
export const PROGRAM_CODE_ID = '0x6ccd363e0b7210a23b7b51b984bd8ba6fc1827cc8649a1ee4665f10802be2150';

// ── Batches ─────────────────────────────────────────────────────────────────────

export const BATCH_1_ID = '0xda1a1a4bdd08aad4417e356ecbb361bf2ec484b2f53e4f2358edd1c5923be8b0';
export const BATCH_2_ID = '0x0128f97fdb5ab4d0b6c25b688807fa4211684aeb755a1268e2ff375ab78c03d4';

// ── State transitions (8-byte IDs) ──────────────────────────────────────────────

export const ST_1_ID = '0xa6b02400c4b30627'; // programId: PROGRAM_1_ID, exited: false
export const ST_2_ID = '0xe58bf718e4d86333'; // programId: PROGRAM_1_ID, exited: false
export const ST_3_ID = '0xd715da47cdd8fb2c'; // programId: PROGRAM_2_ID, exited: false
export const ST_4_ID = '0x8a56fce781d7eb2a'; // programId: PROGRAM_3_ID, exited: false

// ── Ethereum transactions ───────────────────────────────────────────────────────

export const ETHEREUM_TX_1_ID = '0x126622af08e9266bcb486a245ce9681caeba28564cb01d9b4140792d37347ce5'; // blockNumber: 2435545
export const ETHEREUM_TX_2_ID = '0x952d6d938572bb78a49986857ab8d4ab798b07f94294cb9933a0ed6cb61e62a7'; // blockNumber: 2436046
export const ETHEREUM_TX_3_ID = '0x16486485507e26b3d6d5a488f1872292652fe5e3741262972b00bcf9b65f3bb3'; // blockNumber: 2436547

// ── Message requests ────────────────────────────────────────────────────────────

export const MSG_REQ_1_ID = '0x25cb5ea63cc4551464684bb96c99c584a90bccf79ed207bdc416890b5cde38b9'; // programId: PROGRAM_1_ID, blockNumber: 2441046
export const MSG_REQ_2_ID = '0x78253917d102c64b644d9539b1ad90e5768d0fc33572815823acc44ace713cfc'; // programId: PROGRAM_3_ID, blockNumber: 2441114
export const MSG_REQ_3_ID = '0x166d061102046f1df2bd45aaa581b184f3511b9c82fcaca624ee6b327eed5c3d'; // programId: NOT in dump → program relation null
export const MSG_REQ_4_ID = '0xe7766e5010ec16a962faa92557ebb232e004e1064350264705742d650a781306'; // programId: PROGRAM_3_ID, blockNumber: 2441136
export const MSG_REQ_5_ID = '0x15f10a4c3e073084b55c3fb097b337ef988cdcb44d7503ede204ff315ca8198e'; // programId: NOT in dump → program relation null

// Message request source address from dump (used for filters)
export const MSG_REQ_SOURCE_ADDRESS = '0xda4e9d4ec673284e5108e31f1c7be0b8e6ece2d5';

// ── Messages sent ─────────────────────────────────────────────────────────────

export const MSG_SENT_1_ID = '0x52d742fc1f6fcb495166e7631e230f5ef38c59902313d6bd49fc461a9247f4ed'; // sourceProgramId: PROGRAM_3_ID
export const MSG_SENT_2_ID = '0x7001dca3c1a71bdba11b1a7f1b1b92486b56213540a01a2c4e997cdc7e2d3d63'; // sourceProgramId: NOT in dump → sourceProgram relation null
export const MSG_SENT_3_ID = '0x9aaf5a2b94e5d772d29295c888dc88f118cee8d5a793691575decbe0609b1105'; // sourceProgramId: PROGRAM_3_ID
export const MSG_SENT_4_ID = '0xe3a0d6242d85cbbcc22620ee7cbe4d2b41323854f4635f20609bf53927aa33dc'; // sourceProgramId: PROGRAM_3_ID
export const MSG_SENT_5_ID = '0x2b752b5acaa0d2941db42948b8bbcf7d81180ae029ba06fbaa0a6f83ab668e96'; // sourceProgramId: PROGRAM_3_ID

// ── Reply requests ──────────────────────────────────────────────────────────────

export const REPLY_REQ_1_ID = '0x0e25bd587698b23fcec3f6b87537b1eb13d7701df58523a7e335c731fc06c62d'; // programId: NOT in dump → program relation null
export const REPLY_REQ_2_ID = '0x8efbdaf6bd06bfeb1f247db046e4473417ef2b09ec5269a2f5f11f5f641ce28a'; // programId: NOT in dump → program relation null
export const REPLY_REQ_3_ID = '0x25c53b6f0a7d56aad275171efc5ef2861abedee18a6246943e8d9ba78eb7fc0a'; // programId: NOT in dump → program relation null
export const REPLY_REQ_4_ID = '0x1c23a0735ef2a0c065ba16d36612553422d97445d7ca964495c1cd82c3104d3b'; // programId: NOT in dump → program relation null

// ── Replies sent ──────────────────────────────────────────────────────────────

export const REPLY_SENT_1_ID = '0xa4775d1e2d5d4732632982660c43e14bae69482d3084efb1dca958ea61541594'; // sourceProgramId: PROGRAM_1_ID, repliedToId: MSG_REQ_1_ID
export const REPLY_SENT_2_ID = '0xe0b586a954ccaeb387d42c040271402654c73a7b40f25eb621bba202df8bc5af'; // sourceProgramId: PROGRAM_3_ID, repliedToId: MSG_REQ_2_ID
export const REPLY_SENT_3_ID = '0xe0cf9214f53c0a8489049f756e6859f13f362903662ee8901ff92c941654d7c7'; // sourceProgramId: NOT in dump → sourceProgram relation null
export const REPLY_SENT_4_ID = '0x387e9551abe3568f95152ca5da245ce2ca3f39a02c7cf828ab83f1936ee8a842'; // sourceProgramId: PROGRAM_3_ID, repliedToId: MSG_REQ_4_ID

// ── Injected transactions ─────────────────────────────────────────────────────
// NOTE: injected_transaction table is empty in the current dump.
// Tests verify empty-list behavior and 404 on unknown IDs.

// ── Non-existent IDs (used for "not found" tests) ───────────────────────────────
export const UNKNOWN_ID = '0x' + 'ff'.repeat(32);
