<br/>
<p align="center">
  <a href="https://gear-tech.io">
    <img src="https://gear-tech.io/images/logo-black.svg" width="240" alt="GEAR">
  </a>
</p>

<p align="center">
  <b>Gear JSONRPC API</b>
</p>

Gear-tech API based on nodejs [Nest](https://github.com/nestjs/nest) framework uses TypeScript.

Description jsonrpc api of gear backend
This api follows the json-rpc 2.0 specification. More information available at http://www.jsonrpc.org/specification.

<strong>Version 1.0</strong>

---

- [login.github](#login.github)
- [login.telegram](#login.telegram)
- [user.profile](#user.profile)
- [user.addPublicKey](#user.addPublicKey)
- [user.getBalance](#user.getBalance)
- [program.data](#program.data)
- [program.allUser](#program.allUser)
- [program.all](#program.all)
- [message.all](#message.all)
- [message.countUnread](#message.countUnread)
- [balance.transfer](#balance.transfer)
- [blocks.newBlocks](#blocks.newBlocks)
- [program.upload](#program.upload)
- [system.totalIssuance](#system.totalIssuance)
- [message.send](#message.send)
- [message.gasSpent](#message.gasSpent)
- [message.payloadType](#message.payloadType)
- [events.subscribe](#events.subscribe)
- [message.markAsRead](#message.markAsRead)

---

<a name="login.github"></a>

## login.github

Login by github

### Parameters

| Name        | Type   | Constraints | Description                                 |
| ----------- | ------ | ----------- | ------------------------------------------- |
| params      | object |             |                                             |
| params.code | string |             | Code recieved after authorization on github |

### Result

| Name                | Type   | Constraints | Description                          |
| ------------------- | ------ | ----------- | ------------------------------------ |
| result              | object |             |                                      |
| result.access_token | string |             | Bearer token of the created session. |

### Errors

| Code   | Message                   | Description                                |
| ------ | ------------------------- | ------------------------------------------ |
| -32602 | Invalid method parameters | The provided method parameters are invalid |

### Examples

#### Request

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "method": "login.github",
  "params": {
    "code": "42da98492849823u9"
  }
}
```

#### Response

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "result": {
    "access_token": "123456890"
  }
}
```

<a name="login.telegram"></a>

## login.telegram

Login by telegram

### Parameters

| Name              | Type   | Constraints | Description                                         |
| ----------------- | ------ | ----------- | --------------------------------------------------- |
| params            | object |             |                                                     |
| params.id         | string |             | Id recieved after authorization on telegram         |
| params.first_name | string |             | First name recieved after authorization on telegram |
| params.last_name  | string |             | Last name recieved after authorization on telegram  |
| params.username   | string |             | Username recieved after authorization on telegram   |
| params.photo_url  | string |             | Photo url recieved after authorization on telegram  |
| params.auth_date  | string |             | Auth date recieved after authorization on telegram  |
| params.hash       | string |             | Hash recieved after authorization on telegram       |

### Result

| Name                | Type   | Constraints | Description                          |
| ------------------- | ------ | ----------- | ------------------------------------ |
| result              | object |             |                                      |
| result.access_token | string |             | Bearer token of the created session. |

### Errors

| Code   | Message                   | Description                                |
| ------ | ------------------------- | ------------------------------------------ |
| -32602 | Invalid method parameters | The provided method parameters are invalid |

### Examples

#### Request

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "method": "login.telegram",
  "params": {
    "id": "132321",
    "first_name": "Ivan",
    "last_name": "Ivanov",
    "username": "ivan_navi",
    "photo_url": "http://photo.url",
    "auth_date": "12.12.12",
    "hash": "hsdiufhisduhfidshfshfi47h39gfh8rewhf857"
  }
}
```

#### Response

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "result": {
    "access_token": "123456890"
  }
}
```

<a name="user.profile"></a>

## user.profile

Getting user profile

### Result

| Name              | Type   | Constraints | Description |
| ----------------- | ------ | ----------- | ----------- |
| result            | object |             | User data   |
| result?.email     | string |             |             |
| result?.name      | string |             | Fullname    |
| result?.username  | string |             | Username    |
| result?.photoUrl  | string |             | Photo url   |
| result?.publicKey | string |             | Public key  |

### Errors

| Code   | Message     | Description                          |
| ------ | ----------- | ------------------------------------ |
| -32003 | Unathorized | The provided credentials are invalid |

### Examples

#### Request

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "method": "user.profile"
}
```

#### Response

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "result": {
    "email": "user@gear.io",
    "name": "Ivan Ivanov",
    "username": "ivan_navi",
    "photoUrl": "http://photo.url",
    "publicKey": "5GHJ54GHgh4"
  }
}
```

<a name="user.addPublicKey"></a>

## user.addPublicKey

Add user public key

### Parameters

| Name                 | Type   | Constraints | Description    |
| -------------------- | ------ | ----------- | -------------- |
| params               | object |             |                |
| params?.publicKey    | string |             | Public Key     |
| params?.publicKeyRaw | string |             | Raw Public Key |

### Result

| Name              | Type   | Constraints | Description |
| ----------------- | ------ | ----------- | ----------- |
| result            | object |             | Public Key  |
| result?.publicKey | string |             | Public Key  |

### Errors

| Code   | Message     | Description                          |
| ------ | ----------- | ------------------------------------ |
| -32003 | Unathorized | The provided credentials are invalid |

### Examples

#### Request

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "method": "user.addPublicKey",
  "params": {
    "publicKey": "5FHR5Ac45FSwAjpWMtsnPFsnxaWoEPs343kbqcAAnu8fNeQk",
    "publicKeyRaw": "0x8e66638d3bdcd46d3bdbb115ce1b71a972fd05e3ac431fa482480952e135a55d"
  }
}
```

#### Response

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "result": {
    "publicKey": "5FHR5Ac45FSwAjpWMtsnPFsnxaWoEPs343kbqcAAnu8fNeQk"
  }
}
```

<a name="user.getBalance"></a>

## user.getBalance

Getting user balance

### Result

| Name               | Type   | Constraints | Description |
| ------------------ | ------ | ----------- | ----------- |
| result             | object |             |             |
| result.freeBalance | string |             |             |

### Errors

| Code   | Message     | Description                          |
| ------ | ----------- | ------------------------------------ |
| -32003 | Unathorized | The provided credentials are invalid |

### Examples

#### Request

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "method": "user.getBalance"
}
```

#### Response

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "result": {
    "freeBalance": "2"
  }
}
```

<a name="program.data"></a>

## program.data

Getting uploaded program data

### Parameters

| Name        | Type   | Constraints | Description     |
| ----------- | ------ | ----------- | --------------- |
| params      | object |             |                 |
| params.hash | string |             | Hash of program |

### Result

| Name                 | Type    | Constraints | Description                                            |
| -------------------- | ------- | ----------- | ------------------------------------------------------ |
| result               | object  |             |                                                        |
| result.hash          | string  |             | program hash                                           |
| result.blockHash     | string  |             | hash of block with program                             |
| result.programNumber | string  |             | Number of program in order                             |
| result.name          | string  |             | Program name                                           |
| result.callCount     | integer |             | Number of program call                                 |
| result.uploadedAt    | string  |             | Date when program was uploaded                         |
| result?.title        | string  |             | Title of program from metadata                         |
| result?.incomingType | string  |             | Type of expected message                               |
| result?.expectedType | string  |             | Type of reponse message                                |
| result?.initType     | string  |             | Type of initializing message                           |
| result?.initOutType  | string  |             | Type of message responding to the initializing message |
| result.initStatus    | string  |             | Program initializtaion status                          |

### Errors

| Code   | Message                   | Description                                |
| ------ | ------------------------- | ------------------------------------------ |
| -32003 | Unathorized               | The provided credentials are invalid       |
| -32602 | Invalid method parameters | The provided method parameters are invalid |

### Examples

#### Request

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "method": "program.data",
  "params": {
    "hash": "0x746583756837658348"
  }
}
```

#### Response

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "result": {
    "hash": "0x90b4a76995cdfb347425f3800e60fe4e44b110ad4944dcdc1c95d9689f65b666",
    "blockHash": "0xceb60548a4f7778aa05daffa89b301363bb375442526d4ec9e7715a4f573f91a",
    "programNumber": "0xceb60548a4f7778aa05daffa89b301363bb375442526d4ec9e7715a4f573f91a",
    "name": "demo.wasm",
    "callCount": 3,
    "uploadedAt": "Fri Jun 18 2021 16:17:01 GMT+0300 (Moscow Standard Time)",
    "initStatus": "in progress"
  }
}
```

<a name="program.allUser"></a>

## program.allUser

Getting all user's uploaded program

### Result

| Name                    | Type    | Constraints | Description                                            |
| ----------------------- | ------- | ----------- | ------------------------------------------------------ |
| result                  | array   |             |                                                        |
| result[0]               | object  |             |                                                        |
| result[0].hash          | string  |             | program hash                                           |
| result[0].blockHash     | string  |             | hash of block with program                             |
| result[0].programNumber | string  |             | Number of program in order                             |
| result[0].name          | string  |             | Program name                                           |
| result[0].callCount     | integer |             | Number of program call                                 |
| result[0].uploadedAt    | string  |             | Date when program was uploaded                         |
| result[0]?.title        | string  |             | Title of program from metadata                         |
| result[0]?.incomingType | string  |             | Type of expected message                               |
| result[0]?.expectedType | string  |             | Type of reponse message                                |
| result[0]?.initType     | string  |             | Type of initializing message                           |
| result[0]?.initOutType  | string  |             | Type of message responding to the initializing message |
| result[0].initStatus    | string  |             | Program initializtaion status                          |

### Errors

| Code   | Message     | Description                          |
| ------ | ----------- | ------------------------------------ |
| -32003 | Unathorized | The provided credentials are invalid |

### Examples

#### Request

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "method": "program.allUser"
}
```

#### Response

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "result": [
    {
      "hash": "0x90b4a76995cdfb347425f3800e60fe4e44b110ad4944dcdc1c95d9689f65b666",
      "blockHash": "0xceb60548a4f7778aa05daffa89b301363bb375442526d4ec9e7715a4f573f91a",
      "programNumber": "0xceb60548a4f7778aa05daffa89b301363bb375442526d4ec9e7715a4f573f91a",
      "name": "demo.wasm",
      "callCount": 3,
      "uploadedAt": "Fri Jun 18 2021 16:17:01 GMT+0300 (Moscow Standard Time)",
      "initStatus": "in progress"
    }
  ]
}
```

<a name="program.all"></a>

## program.all

Getting all uploaded program

### Result

| Name                    | Type    | Constraints | Description                                            |
| ----------------------- | ------- | ----------- | ------------------------------------------------------ |
| result                  | array   |             |                                                        |
| result[0]               | object  |             |                                                        |
| result[0].hash          | string  |             | program hash                                           |
| result[0].blockHash     | string  |             | hash of block with program                             |
| result[0].programNumber | string  |             | Number of program in order                             |
| result[0].name          | string  |             | Program name                                           |
| result[0].callCount     | integer |             | Number of program call                                 |
| result[0].uploadedAt    | string  |             | Date when program was uploaded                         |
| result[0]?.title        | string  |             | Title of program from metadata                         |
| result[0]?.incomingType | string  |             | Type of expected message                               |
| result[0]?.expectedType | string  |             | Type of reponse message                                |
| result[0]?.initType     | string  |             | Type of initializing message                           |
| result[0]?.initOutType  | string  |             | Type of message responding to the initializing message |
| result[0].initStatus    | string  |             | Program initializtaion status                          |

### Errors

| Code   | Message     | Description                          |
| ------ | ----------- | ------------------------------------ |
| -32003 | Unathorized | The provided credentials are invalid |

### Examples

#### Request

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "method": "program.all"
}
```

#### Response

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "result": [
    {
      "hash": "0x90b4a76995cdfb347425f3800e60fe4e44b110ad4944dcdc1c95d9689f65b666",
      "blockHash": "0xceb60548a4f7778aa05daffa89b301363bb375442526d4ec9e7715a4f573f91a",
      "programNumber": "0xceb60548a4f7778aa05daffa89b301363bb375442526d4ec9e7715a4f573f91a",
      "name": "demo.wasm",
      "callCount": 3,
      "uploadedAt": "Fri Jun 18 2021 16:17:01 GMT+0300 (Moscow Standard Time)",
      "initStatus": "in progress"
    }
  ]
}
```

<a name="message.all"></a>

## message.all

Getting all user's messages

### Parameters

| Name   | Type | Constraints | Description |
| ------ | ---- | ----------- | ----------- |
| params |      |             |             |

### Result

| Name                   | Type    | Constraints | Description                  |
| ---------------------- | ------- | ----------- | ---------------------------- |
| result                 | array   |             |                              |
| result[0]              | object  |             |                              |
| result[0]?.id          | string  |             | Message id                   |
| result[0]?.responseId  | string  |             | Response type                |
| result[0]?.date        | string  |             | Date and time of message     |
| result[0]?.program     | string  |             | Program hash                 |
| result[0]?.destination | string  |             | Destination (user publicKey) |
| result[0]?.payload     | string  |             | Message payload              |
| result[0]?.response    | string  |             | Response payload             |
| result[0]?.isRead      | boolean |             | Has the message been read    |
| result[0]?.required    |         |             |                              |

### Errors

| Code   | Message     | Description                          |
| ------ | ----------- | ------------------------------------ |
| -32003 | Unathorized | The provided credentials are invalid |

### Examples

#### Request

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "method": "message.all"
}
```

#### Response

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "result": [
    {
      "id": "0xfc93a49b14b4e7e2e3990d7ca0853111c8abb04895663bf84d68b9cf12604c18",
      "responseId": "0xfc93a49b14b4e7e2e3990d7ca0853111c8abb04895663bf84d68b9cf12604c18",
      "date": "2021-08-09T12:07:54.064Z",
      "program": "0xfc93a49b14b4e7e2e3990d7ca0853111c8abb04895663bf84d68b9cf12604c18",
      "destination": "0xfc93a49b14b4e7e2e3990d7ca0853111c8abb04895663bf84d68b9cf12604c18",
      "payload": "PING",
      "response": "PONG",
      "isRead": false
    }
  ]
}
```

<a name="message.countUnread"></a>

## message.countUnread

Getting count of unread messages

### Result

| Name   | Type   | Constraints | Description         |
| ------ | ------ | ----------- | ------------------- |
| result | number |             | Count unread events |

### Errors

| Code   | Message     | Description                          |
| ------ | ----------- | ------------------------------------ |
| -32003 | Unathorized | The provided credentials are invalid |

### Examples

#### Request

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "method": "message.countUnread"
}
```

#### Response

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890"
}
```

<a name="balance.transfer"></a>

## balance.transfer

Transfer balance from Alice.

### Parameters

| Name         | Type    | Constraints | Description                                  |
| ------------ | ------- | ----------- | -------------------------------------------- |
| params       | object  |             |                                              |
| params.value | integer |             | The number of units that need to be transfer |

### Result

| Name            | Type   | Constraints   | Description                           |
| --------------- | ------ | ------------- | ------------------------------------- |
| result          | object |               | Information about success transaction |
| result?.message | string | minLength="1" |                                       |

### Errors

| Code   | Message                   | Description                                |
| ------ | ------------------------- | ------------------------------------------ |
| -32003 | Unathorized               | The provided credentials are invalid       |
| -32602 | Invalid method parameters | The provided method parameters are invalid |
| -32011 | Invalid transaction       | Error occured when transaction failed      |

### Examples

#### Request

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "method": "balance.transfer",
  "params": {
    "value": 1234567
  }
}
```

#### Response

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "result": {
    "message": "Transfer balance success"
  }
}
```

<a name="blocks.newBlocks"></a>

## blocks.newBlocks

Subscribe to new blocks

### Result

| Name          | Type   | Constraints | Description  |
| ------------- | ------ | ----------- | ------------ |
| result        | object |             |              |
| result.hash   | string |             | Block hash   |
| result.number | string |             | Block number |

### Errors

| Code   | Message     | Description                          |
| ------ | ----------- | ------------------------------------ |
| -32003 | Unathorized | The provided credentials are invalid |

### Examples

#### Request

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "method": "blocks.newBlocks"
}
```

#### Response

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "result": {
    "hash": "0xceb60548a4f7778aa05daffa89b301363bb375442526d4ec9e7715a4f573f91a",
    "number": "2"
  }
}
```

<a name="program.upload"></a>

## program.upload

Upload new program

### Parameters

| Name                     | Type    | Constraints | Description               |
| ------------------------ | ------- | ----------- | ------------------------- |
| params                   | object  |             |                           |
| params.file              |         |             | File buffer               |
| params.filename          | string  |             | File name                 |
| params.gasLimit          | integer |             | Gas limit                 |
| params.value             | integer |             | Init value                |
| params.initPayload       | string  |             | Init payload (hex)        |
| params.meta              | object  |             | Program types             |
| params.meta?.init_input  |         |             |                           |
| params.meta?.init_output |         |             |                           |
| params.meta?.input       |         |             |                           |
| params.meta?.output      |         |             |                           |
| params.meta?.types       |         |             |                           |
| params.keyPairJson       | string  |             | JSON Encoded KeyPair data |

### Result

| Name               | Type   | Constraints | Description             |
| ------------------ | ------ | ----------- | ----------------------- |
| result             | object |             |                         |
| result.status      | string |             | Transaction status      |
| result.blockHash   | string |             | Block hash with program |
| result.programHash | string |             | Program Hash            |

### Errors

| Code   | Message                       | Description                                      |
| ------ | ----------------------------- | ------------------------------------------------ |
| -32003 | Unathorized                   | The provided credentials are invalid             |
| -32602 | Invalid method parameters     | The provided method parameters are invalid       |
| -32011 | Invalid transaction           | Error occured when transaction failed            |
| -32012 | Program initialization falied | Error occured when program initialization failed |

### Examples

#### Request

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "method": "program.upload",
  "params": {
    "filename": "demo.wasm",
    "gasLimit": 2000,
    "value": 2000,
    "initPayload": "0x1234",
    "meta": {
      "init_input": "String",
      "init_output": "Vec<u8>",
      "input": "Person",
      "output": "Result<u8, u8>",
      "types": {
        "Person": {
          "name": "String",
          "surname": "String"
        }
      }
    }
  }
}
```

#### Response

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "result": {
    "status": "InBlock",
    "blockHash": "0xf3a23f7de0415463894039910a8976a7e21cba3e7e620ac10fc6b25ec805eae9",
    "programHash": "0x4467ffec533014607103dcede9c2e828ecbc8ae1469b18cbb1861e1fecfbe9fe"
  }
}
```

<a name="system.totalIssuance"></a>

## system.totalIssuance

Getting total issuance

### Result

| Name                 | Type   | Constraints | Description          |
| -------------------- | ------ | ----------- | -------------------- |
| result               | object |             |                      |
| result.totalIssuance | string |             | Total issuance value |

### Errors

| Code   | Message     | Description                          |
| ------ | ----------- | ------------------------------------ |
| -32003 | Unathorized | The provided credentials are invalid |

### Examples

#### Request

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "method": "system.totalIssuance"
}
```

#### Response

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "result": {
    "totalIssuance": "4.3425 MUnit"
  }
}
```

<a name="message.send"></a>

## message.send

Sending message

### Parameters

| Name                | Type    | Constraints | Description                       |
| ------------------- | ------- | ----------- | --------------------------------- |
| params              | object  |             |                                   |
| params.destination  | string  |             | Program destination address (hex) |
| params.gasLimit     | integer |             | Gas limit                         |
| params.value        | integer |             | Init value                        |
| params.payload      | string  |             | Init payload                      |
| params?.keyPairJson | string  |             | JSON Encoded KeyPair data         |

### Result

| Name              | Type   | Constraints | Description                     |
| ----------------- | ------ | ----------- | ------------------------------- |
| result            | object |             |                                 |
| result?.status    | string |             | Transaction status              |
| result?.blockHash | string |             | Block hash with transaction     |
| result?.data      | string |             | Program response to the message |
| result?.required  |        |             |                                 |

### Errors

| Code   | Message                   | Description                                |
| ------ | ------------------------- | ------------------------------------------ |
| -32003 | Unathorized               | The provided credentials are invalid       |
| -32602 | Invalid method parameters | The provided method parameters are invalid |
| -32011 | Invalid transaction       | Error occured when transaction failed      |

### Examples

#### Request

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "method": "message.send",
  "params": {
    "destination": "0xfc93a49b14b4e7e2e3990d7ca0853111c8abb04895663bf84d68b9cf12604c18",
    "gasLimit": 2000,
    "value": 2000,
    "payload": "PING"
  }
}
```

#### Response

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "result": {
    "status": "Log",
    "blockHash": "0xf3a23f7de0415463894039910a8976a7e21cba3e7e620ac10fc6b25ec805eae9",
    "data": "PONG"
  }
}
```

<a name="message.gasSpent"></a>

## message.gasSpent

Getting minimal gaslLimit for payload for the program

### Parameters

| Name               | Type   | Constraints | Description                       |
| ------------------ | ------ | ----------- | --------------------------------- |
| params             | object |             |                                   |
| params.destination | string |             | Program destination address (hex) |
| params.payload     | string |             | Init payload                      |

### Result

| Name             | Type   | Constraints | Description |
| ---------------- | ------ | ----------- | ----------- |
| result           | object |             |             |
| result?.gasSpent | number |             | GasSpent    |
| result?.required |        |             |             |

### Errors

| Code   | Message                   | Description                                |
| ------ | ------------------------- | ------------------------------------------ |
| -32003 | Unathorized               | The provided credentials are invalid       |
| -32602 | Invalid method parameters | The provided method parameters are invalid |

### Examples

#### Request

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "method": "message.gasSpent",
  "params": {
    "destination": "0xfc93a49b14b4e7e2e3990d7ca0853111c8abb04895663bf84d68b9cf12604c18",
    "payload": "PING"
  }
}
```

#### Response

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "result": {
    "gasSpent": 123213312
  }
}
```

<a name="message.payloadType"></a>

## message.payloadType

Getting payload type

### Parameters

| Name               | Type   | Constraints | Description                       |
| ------------------ | ------ | ----------- | --------------------------------- |
| params             | object |             |                                   |
| params.destination | string |             | Program destination address (hex) |

### Result

| Name                | Type   | Constraints | Description  |
| ------------------- | ------ | ----------- | ------------ |
| result              | object |             |              |
| result?.payloadType | string |             | Payload type |
| result?.required    |        |             |              |

### Errors

| Code   | Message                   | Description                                |
| ------ | ------------------------- | ------------------------------------------ |
| -32003 | Unathorized               | The provided credentials are invalid       |
| -32602 | Invalid method parameters | The provided method parameters are invalid |

### Examples

#### Request

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "method": "message.payloadType",
  "params": {
    "destination": "0xfc93a49b14b4e7e2e3990d7ca0853111c8abb04895663bf84d68b9cf12604c18"
  }
}
```

#### Response

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "result": {
    "payloadType": "{\"value\": \"u64\", \"annotation\": \"String\"}"
  }
}
```

<a name="events.subscribe"></a>

## events.subscribe

Subscribe to events

### Result

| Name                | Type   | Constraints | Description                                        |
| ------------------- | ------ | ----------- | -------------------------------------------------- |
| result              | object |             |                                                    |
| result?.event       | string |             | Event type                                         |
| result?.id          | string |             | Message id (Log)                                   |
| result?.program     | string |             | Program hash (Log, InitSuccess, InitFailed)        |
| result?.response    | string |             | Response payload (Log)                             |
| result?.programName | string |             | Name of uploaded program (InitSuccess, InitFailed) |
| result?.date        | string |             | Date and time of event                             |
| result?.required    |        |             |                                                    |

### Errors

| Code   | Message                   | Description                                |
| ------ | ------------------------- | ------------------------------------------ |
| -32003 | Unathorized               | The provided credentials are invalid       |
| -32602 | Invalid method parameters | The provided method parameters are invalid |

### Examples

#### Request

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "method": "events.subscribe"
}
```

#### Response

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "result": {
    "event": "Log",
    "id": "0xfc93a49b14b4e7e2e3990d7ca0853111c8abb04895663bf84d68b9cf12604c18",
    "program": "0xfc93a49b14b4e7e2e3990d7ca0853111c8abb04895663bf84d68b9cf12604c18",
    "response": "PONG",
    "programName": "demo_ping",
    "date": "2021-08-09T12:07:54.064Z"
  }
}
```

<a name="message.markAsRead"></a>

## message.markAsRead

Mark message as read

### Parameters

| Name       | Type   | Constraints | Description |
| ---------- | ------ | ----------- | ----------- |
| params     | object |             |             |
| params?.id | string |             | Message id  |

### Errors

| Code   | Message                   | Description                                |
| ------ | ------------------------- | ------------------------------------------ |
| -32003 | Unathorized               | The provided credentials are invalid       |
| -32602 | Invalid method parameters | The provided method parameters are invalid |

### Examples

#### Request

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "method": "message.markAsRead",
  "params": {
    "id": "0xfc93a49b14b4e7e2e3990d7ca0853111c8abb04895663bf84d68b9cf12604c18"
  }
}
```

#### Response

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890"
}
```
