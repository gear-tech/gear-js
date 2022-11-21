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
