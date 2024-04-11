## 0.37.2

_04/11/2024_

### Changes
https://github.com/gear-tech/gear-js/pull/1528
- Subscribe to blocks and gear events starting from a particular block

## 0.37.1

_04/10/2024_

### Changes
https://github.com/gear-tech/gear-js/pull/1522
- Subsribe to gear events only on finalized blocks

## 0.37.0

_03/12/2024_

### Changes
https://github.com/gear-tech/gear-js/pull/1503
- Support calculateReplyForHandle rpc call according https://github.com/gear-tech/gear/pull/3790
- Support new aliases for calculateGas rpc calls
- Fix payload type
- Bump polkadot-js dependencies to `10.12.2`

## 0.36.7

_02/26/2024_

### Changes
https://github.com/gear-tech/gear-js/pull/1490
- Refactor types

## 0.36.6

_02/15/2024_

### Changes
https://github.com/gear-tech/gear-js/pull/1487
- Add add `gr_env_vars` stub

## 0.36.5

_02/12/2024_

### Changes
https://github.com/gear-tech/gear-js/pull/1486
- Add ability to decline voucher using voucher funds

## 0.36.4

_02/12/2024_

### Changes
https://github.com/gear-tech/gear-js/pull/1485
- Add method to decline a voucher according to https://github.com/gear-tech/gear/pull/3725

## 0.36.3

_02/06/2024_

### Changes
https://github.com/gear-tech/gear-js/pull/1481
- Add method to get all voucher issued by account
- Improve vouchers query

https://github.com/gear-tech/gear-js/pull/1483
- Fix reading state without meta

## 0.36.2

_01/25/2024_

### Changes
https://github.com/gear-tech/gear-js/pull/1477
- Return support of old vouchers

## 0.36.1

_01/23/2024_

### Changes
https://github.com/gear-tech/gear-js/pull/1476
- Add `codeUploadin` field to `VoucherDetails`

## 0.36.0

_01/23/2024_

### Changes
https://github.com/gear-tech/gear-js/pull/1447
- Read storage of memory pages according to https://github.com/gear-tech/gear/pull/3166

https://github.com/gear-tech/gear-js/pull/1451
<i><b>Breaking changes</b></i>
- Fix `api.getExtrinsicFailedError` method. It now returns an object with the formatted docs, method and name of the error

https://github.com/gear-tech/gear-js/pull/1467
- Support new vouchers according to https://github.com/gear-tech/gear/pull/3606
- Bump polkadot dependencies to `10.11.2`

https://github.com/gear-tech/gear-js/pull/1472
- Support `uploadCode` call for vouchers according to https://github.com/gear-tech/gear/pull/3672.

## 0.35.2

_10/31/2023_

### Changes
https://github.com/gear-tech/gear-js/pull/1443
- Use runtime version for api versioning instead of genesis

## 0.35.0

_10/24/2023_

### Changes
https://github.com/gear-tech/gear-js/pull/1436
- Support `gearVoucher.call` extrinsic according to https://github.com/gear-tech/gear/pull/3401
- Support `keepAlive` field in `sendMessage`, `sendReply`, `uploadProgram` and `createProgram` extrinsics accoriding to https://github.com/gear-tech/gear/pull/3425
- Bump `polkadot-js` version to 10.10.1
- Support different APIs for Vara and Vara Testnet Network

## 0.34.0

_09/29/2023_

### Changes
https://github.com/gear-tech/gear-js/pull/1416
- Update prefix for programId generation according to https://github.com/gear-tech/gear/pull/3010
- Support 2 approaches to programId generation depending on the network
https://github.com/gear-tech/gear-js/pull/1404
- Support `inflationInfo` rpc call

## 0.33.6

_09/25/2023_

### Changes
https://github.com/gear-tech/gear-js/pull/1410
- Fix payload encoding in state.readUsingWasm method.

## 0.33.5

_09/18/2023_

### Changes
https://github.com/gear-tech/gear-js/pull/1403
- Export generated types from api

## 0.33.4

_09/16/2023_

### Changes
https://github.com/gear-tech/gear-js/pull/1400
- Fix payload encoding in state.read method.

## 0.33.3

_09/14/2023_

### Changes
https://github.com/gear-tech/gear-js/pull/1395
- Support `readStateBatch` rpc call.
- Generate augemented types

## 0.33.2

_09/11/2023_

### Changes
https://github.com/gear-tech/gear-js/pull/1381
- Add `valuePerGas` parameter

## 0.33.1

_09/06/2023_

### Changes
https://github.com/gear-tech/gear-js/pull/1375
- Fix `readStateUsingWasm`

## 0.33.0

_08/29/2023_

### Changes

https://github.com/gear-tech/gear-js/pull/1353
- Remove `sendMessageWithVoucher` and `sendReplyWithVoucher` methods according to https://github.com/gear-tech/gear/pull/3083.
- Add optional `prepaid` and `account` fields to `api.message.send` and `api.message.sendReply` method arguments. They are used to send messages with the issued voucher.

https://github.com/gear-tech/gear-js/pull/1349
- Add `payload` parameter to `api.programState.read` and `api.programState.readUsingWasm` methods according to https://github.com/gear-tech/gear/pull/3059 and https://github.com/gear-tech/gear/pull/3173
- Support new `ProgramMetadata` version.

https://github.com/gear-tech/gear-js/pull/1361
- Support type definition for tuple structs

## 0.32.4

_07/25/2023_

https://github.com/gear-tech/gear-js/pull/1337
### Changes

- Update option regexp

## 0.32.3

_07/11/2023_

https://github.com/gear-tech/gear-js/pull/1322
### Changes

- Update option regexp

## 0.32.2

_07/10/2023_

https://github.com/gear-tech/gear-js/pull/1320
### Changes

- Add gr_reply_deposit syscall

## 0.32.1

_07/03/2023_

https://github.com/gear-tech/gear-js/pull/1313
### Changes

- Make meta types nullable

## 0.32.0

_06/28/2023_

https://github.com/gear-tech/gear-js/pull/1298
https://github.com/gear-tech/gear-js/pull/1301
https://github.com/gear-tech/gear-js/pull/1302
https://github.com/gear-tech/gear-js/pull/1303
https://github.com/gear-tech/gear-js/pull/1305
https://github.com/gear-tech/gear-js/pull/1306
https://github.com/gear-tech/gear-js/pull/1307

### Changes

- New approach to generate program IDs
- Support `resumeSessionInit`, `resumeSessionPush` and `resumeSessionCommit` extrinsics according to https://github.com/gear-tech/gear/pull/2622
- Refactor `statusCode` field according to https://github.com/gear-tech/gear/pull/2823.
- Remove `exitCode` argument from `calculateGas.reply` method
- Refactor default types
- Support `gearVoucher` pallet and `sendMessageWithVoucher` and `sendReplyWithVoucher` extrinsics according to https://github.com/gear-tech/gear/pull/2777
- Add `runtime_wasmBlobVersion` rpc call according to https://github.com/gear-tech/gear/pull/2760
- New approach to metadata according to https://github.com/gear-tech/gear/pull/2829
- Bump `polkadot-js` to `10.9.1`

## 0.31.2

_05/26/2023_

https://github.com/gear-tech/gear-js/pull/1289

### Changes

- Fix registration of complex nested types from metadata.

## 0.31.1

_05/19/2023_

https://github.com/gear-tech/gear-js/pull/1283

### Changes

- Add `api.program.payRent` method to execute `programPayRent` extrinsic accorind to https://github.com/gear-tech/gear/pull/2535
- Bump polkadot-js pkgs to `10.7.1` version
- Update `ProgramChanged` event according to https://github.com/gear-tech/gear/pull/2507
- Add methods to get paused programs info

## 0.31.0

_04/29/2023_

https://github.com/gear-tech/gear-js/pull/1278

### Changes

- Remove ability to work with old metadata
- Bump polkadot-js pkgs to `10.4.1` version

## 0.30.6

_04/17/2023_

https://github.com/gear-tech/gear-js/pull/1262

### Changes

- Bump polkadot-js pkgs to `10.3.4` version

## 0.30.4

_03/31/2023_

https://github.com/gear-tech/gear-js/pull/1248

### Changes

- Bump polkadot-js packages

## 0.30.3

_03/30/2023_

https://github.com/gear-tech/gear-js/pull/1244

### Changes

- Add syscalls `gr_signal_from`, `gr_reply_push_input`, `gr_reply_input_wgas`, `gr_reply_input`, `gr_send_push_input`, `gr_send_input_wgas`, `gr_send_input`

## 0.30.2

_03/24/2023_

https://github.com/gear-tech/gear-js/pull/1241

### Changes

- Use Bytes as default type, if meta or type wasn't specified.
- Handle error in `program.metaHex` method

## 0.30.1

_03/10/2023_

https://github.com/gear-tech/gear-js/pull/1226

### Changes

- Send payload as array of bytes instead of hex to avoid problem with endianness.

## 0.30.0

_02/15/2023_

https://github.com/gear-tech/gear-js/pull/1204

### Changes

- Bump `@polkadot/api` to `9.14.1`.

## 0.29.5

_02/14/2023_

https://github.com/gear-tech/gear-js/pull/1201

### Changes

- Rename events, error and their enum variants accoriding to https://github.com/gear-tech/gear/pull/2163

## 0.29.4

_02/14/2023_

https://github.com/gear-tech/gear-js/pull/1199

### Changes

- Add `gr_oom_panic` syscall

## 0.29.2

_02/11/2023_

https://github.com/gear-tech/gear-js/pull/1194

### Changes

- Add `gr_panic` syscall

## 0.29.1

_01/31/2023_

https://github.com/gear-tech/gear-js/pull/1174

### Changes

- Add ability to get metahash by codeId and from wasm

## 0.29.0

_01/30/2023_

https://github.com/gear-tech/gear-js/pull/1172

### Changes

- Update reading program storage accoriding to https://github.com/gear-tech/gear/pull/2017
- Remove `Hex` type. Use `HexString` from `@polkadot/util/types` instead

## 0.28.8

_01/25/2023_

https://github.com/gear-tech/gear-js/pull/1161

### Changes

- Fix enum variants type definition

## 0.28.7

_01/23/2023_

https://github.com/gear-tech/gear-js/pull/1157

### Changes

- Set `kind` to `primitive` for types from `primitive_types` crate

## 0.28.6

_01/19/2023_

https://github.com/gear-tech/gear-js/pull/1154

### Changes

- Add separate type `actorid`

## 0.28.5

_01/12/2023_

https://github.com/gear-tech/gear-js/pull/1150

### Changes

- Don't use instanceof to figure out which class an object belongs to

## 0.28.4

_01/10/2023_

https://github.com/gear-tech/gear-js/pull/1149

### Changes

- Add variant `option` to TypeKind variants

## 0.28.3

_12/20/2022_

https://github.com/gear-tech/gear-js/pull/1146

### Changes

- Add new meta to methods for gas calculation

## 0.28.1

_12/16/2022_

https://github.com/gear-tech/gear-js/pull/1135

### Changes

- New approach to reading state and using metadata

## 0.27.7

_11/29/2022_

https://github.com/gear-tech/gear-js/pull/1126

### Changes

- Update syscalls

## 0.27.6

_11/24/2022_

https://github.com/gear-tech/gear-js/pull/1111

### Changes

- Update `Entry` and `DispatchKind` types

## 0.27.5

_11/21/2022_

https://github.com/gear-tech/gear-js/pull/1102

### Changes

- Update `gr_read` syscall

## 0.27.4

_11/18/2022_

https://github.com/gear-tech/gear-js/pull/1100

### Changes

- Update `UserMessageSent` and `MessageWaited` events data according to https://github.com/gear-tech/gear/pull/1730 and https://github.com/gear-tech/gear/pull/1833

## 0.27.3

_11/13/2022_

https://github.com/gear-tech/gear-js/pull/1088

### Changes

- Add `gr_reservation_send_commit`, `gr_reservation_send`, `gr_reservation_reply`, `gr_reservation_reply_commit` syscalls

## 0.27.2

_11/12/2022_

https://github.com/gear-tech/gear-js/pull/1084

### Changes

- Increase the value of initial size by 1 when reading the state

## 0.27.1

_11/09/2022_

https://github.com/gear-tech/gear-js/pull/1075

### Changes

- Add new `gr_reserve_gas`, `gr_unreserve_gas`, `gr_random` syscalls to `importObj`

## 0.27.0

_10/25/2022_

https://github.com/gear-tech/gear-js/pull/1046
https://github.com/gear-tech/gear-js/pull/1045

### Changes

- Update `ActiveProgram` type according to https://github.com/gear-tech/gear/pull/1505
- Rename `generateCodeId` function to `generateCodeHash`
- Add oportunity to generate codeHas from Uint8Array and hex

## 0.26.2

_10/17/2022_

https://github.com/gear-tech/gear-js/pull/1041

### Changes

- Update `ActiveProgram` type according to https://github.com/gear-tech/gear/pull/1474

## 0.26.1

_10/11/2022_

https://github.com/gear-tech/gear-js/pull/1031

### Changes

- Rename `gr_msg_id` syscall to `gr_message_id`

## 0.26.0

_10/06/2022_

https://github.com/gear-tech/gear-js/pull/1030

### Changes

- Bump @polkadot/api to 9.5.1

## 0.25.9

_10/06/2022_

https://github.com/gear-tech/gear-js/pull/1023

### Changes

- Add method to get all code ids existed on chain

## 0.25.8

_10/03/2022_

https://github.com/gear-tech/gear-js/pull/1012

### Changes

- Add new syscalls

## 0.25.7

_09/17/2022_

https://github.com/gear-tech/gear-js/pull/996

### Changes

- Add Exited variant to Program enum

## 0.25.6

_09/13/2022_

https://github.com/gear-tech/gear-js/pull/988

### Changes

- Add function to convert type name

## 0.25.5

_09/12/2022_

https://github.com/gear-tech/gear-js/pull/982

### Changes

- Add method to subscribe to `UserMessageSent` events by actorId

## 0.25.4

_09/12/2022_

https://github.com/gear-tech/gear-js/pull/981

### Changes

- Add new TypeInfo parser

## 0.25.3

_09/08/2022_

https://github.com/gear-tech/gear-js/pull/979

### Changes

- Use api.derive to subscription to new blocks

## 0.25.2

_08/17/2022_

https://github.com/gear-tech/gear-js/pull/933
https://github.com/gear-tech/gear-js/pull/937

### Changes

- Add `waited` field to `GasInfo` type according to https://github.com/gear-tech/gear/pull/1276
- Add rpc call to calculate gas for create_program extrinsic according to https://github.com/gear-tech/gear/pull/1330

## 0.25.1

_08/18/2022_

https://github.com/gear-tech/gear-js/pull/935

### Changes

- Describe Null type in `createPayloadTypeStructure` function

## 0.25.0

_08/06/2022_

https://github.com/gear-tech/gear-js/pull/901

### Breaking Changes

- Support `create_program` extrinsic according to https://github.com/gear-tech/gear/pull/1241
  _Use the `api.program.create` method for this_
- Remove `MessageReply` class. From now on, use `api.message.sendReply` method to send reply
- Rename `api.message.submit` to `api.message.send`
- Rename `api.program.submit` to `api.program.upload`
- Rename `api.code.submit` to `api.code.upload`
- Rename `submitted` field in `GearTransaction` class to `extrinsic`
- Update `GasInfo` type according to https://github.com/gear-tech/gear/pull/1211

## 0.24.2

_07/27/2022_

https://github.com/gear-tech/gear-js/pull/894

### Changes

- Fix type of `paymentInfo` method's argument.

---

## 0.24.1

_07/22/2022_

https://github.com/gear-tech/gear-js/pull/872

### Changes

- Add oportunity to call `gr_block_height` syscall in meta_state function

---

## 0.24.0

_07/19/2022_

https://github.com/gear-tech/gear-js/pull/848

### Changes

- Update `reply` field of `Message` type according to https://github.com/gear-tech/gear/pull/1198
  _Type of `reply` field is Struct with fields `replyTo` and `exitCode` instead of Tuple from now on_
- Update type of waitlist and mailbox item according to https://github.com/gear-tech/gear/pull/1197
  _From this moment the types are Tuple with 2 elements, the first one remained the same and the 2nd one is object with `start` and `finish` fields that show block's number when message gets into **mailbox / waitlist** and last block's number when message gets out of **mailbox / waitlist**_
- Also `waitlist.read` and `mailbox.read` methods now return Codec types without keys.

---

## 0.23.6

_07/19/2022_

https://github.com/gear-tech/gear-js/pull/845

### Changes

- Adjust simple enum generation

---

## 0.23.5

_07/18/2022_

https://github.com/gear-tech/gear-js/pull/843

### Changes

- Fix getting program pages according to https://github.com/gear-tech/gear/pull/1193

---

## 0.23.4

_07/18/2022_

https://github.com/gear-tech/gear-js/pull/840

### Changes

- Rename `api.program.is` method to `api.program.exists`
- Add validation of gasLimit, value and codeId before sending transactions
- `api.code.submit` method is now async
- Add get some runtime constants (`existentialDeposit`, `blockGasLimit`, `mailboxTreshold`, `waitlistCost`)
- Add eslint config

---

## 0.23.3

_07/12/2022_

https://github.com/gear-tech/gear-js/pull/822

### Changes

- Add specific types for gas limit and value
- Update build process

---

## 0.23.2

_07/12/2022_

https://github.com/gear-tech/gear-js/pull/819

### Changes

- Improve types
- Update build process

---

## 0.23.1

_07/08/2022_

https://github.com/gear-tech/gear-js/pull/811

### Changes

- Add `api.program.is` method to check whether the address belongs to some program.

---

## 0.23.0

_07/08/2022_

https://github.com/gear-tech/gear-js/pull/806

### Changes

- Build library using rollup
- Add eslint config
- Specify specific types instead any
- Bump `@polkadot/api` to 8.11.3

---

## 0.22.3

_07/05/2022_

https://github.com/gear-tech/gear-js/pull/794

### Changes

- Rename the stateChanged field to stateChanges in the MessagesDispatchedData class
- Set type of expiration in the UserMessageSentData class to Option<BlockNumber>

---

## 0.22.2

_06/27/2022_

https://github.com/gear-tech/gear-js/pull/770

### Changes

- Change GasInfo interface (_Replace `to_send` with `reserved`_)
- Fix gas tests

---

## 0.22.1

_06/21/2022_

https://github.com/gear-tech/gear-js/pull/754

### Breaking Changes

- Update subscription to Transfer balance events
- Update GearBalance class.

_From now on, it's necessary to use 2 separate methods (`transfer` and `singAndSend`) to send transaction_

---

## 0.22.0

_06/21/2022_

https://github.com/gear-tech/gear-js/pull/753

### Breaking Changes

- Updated event data sturcture.
- Remove events and event data classes, and add interfaces instead

---

## 0.21.0

_06/17/2022_

https://github.com/gear-tech/gear-js/pull/743

### Breaking Changes

- Update calculation gas logic follow https://github.com/gear-tech/gear/pull/1051

  _From now on, gas calculation returns the object GasInfo instead of the u64 value_

---

## 0.20.1

_06/13/2022_

https://github.com/gear-tech/gear-js/pull/725

### Changes

- Throw error while reading the state in case if program does not exist in the storage

---

## 0.20.0

_06/03/2022_

https://github.com/gear-tech/gear-js/pull/692

### Breaking Changes

- Update all events follow https://github.com/gear-tech/gear/pull/1000

---

## 0.19.2

_05/31/2022_

https://github.com/gear-tech/gear-js/pull/681

### Changes

- Add method to get transaction fee

---

## 0.19.1

_05/30/2022_

https://github.com/gear-tech/gear-js/pull/676

### Changes

- Add GearWaitlist class to read waitlist of programs

---

## 0.19.0

_05/20/2022_

https://github.com/gear-tech/gear-js/pull/658

### Changes

- Update pallet name with mailbox

---

## 0.18.3

_05/16/2022_

https://github.com/gear-tech/gear-js/pull/648

### Changes

- Add ability to specify code in `submitProgram` and `submitCode` as Uint8Array

---

## 0.18.2

_05/16/2022_

https://github.com/gear-tech/gear-js/pull/647

### Changes

- Add `gr_error` syscall to wasm importObj

---

## 0.18.1

_05/11/2022_

https://github.com/gear-tech/gear-js/pull/634

### Changes

- Bump @polkadot/api to 8.3.2
- Test creating BTreeSet type
