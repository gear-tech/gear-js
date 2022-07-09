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
