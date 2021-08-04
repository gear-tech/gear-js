# GEAR JSONRPC API

Description jsonrpc api of gear backend
This api follows the json-rpc 2.0 specification. More information available at http://www.jsonrpc.org/specification.

<strong>Version 1.0</strong>

---

- [login.github](#login.github)
- [login.telegram](#login.telegram)
- [user.profile](#user.profile)
- [user.generateKeypair](#user.generateKeypair)
- [user.getBalance](#user.getBalance)
- [program.data](#program.data)
- [program.all](#program.all)
- [balance.transfer](#balance.transfer)
- [blocks.newBlocks](#blocks.newBlocks)
- [program.upload](#program.upload)
- [system.totalIssuance](#system.totalIssuance)
- [message.send](#message.send)

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

<a name="user.generateKeypair"></a>

## user.generateKeypair

Generate keypair for signing trasactions

### Result

| Name   | Type   | Constraints | Description                |
| ------ | ------ | ----------- | -------------------------- |
| result | object |             | JSON encdoded keypair data |

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
  "method": "user.generateKeypair"
}
```

#### Response

```json
{
  "jsonrpc": "2.0",
  "id": "1234567890",
  "result": {}
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

| Name                 | Type    | Constraints | Description                    |
| -------------------- | ------- | ----------- | ------------------------------ |
| result               | object  |             |                                |
| result.hash          | string  |             | program hash                   |
| result.blockHash     | string  |             | hash of block with program     |
| result.programNumber | string  |             | Number of program in order     |
| result.name          | string  |             | Program name                   |
| result.callCount     | integer |             | Number of program call         |
| result.uploadedAt    | string  |             | Date when program was uploaded |

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
    "uploadedAt": "Fri Jun 18 2021 16:17:01 GMT+0300 (Moscow Standard Time)"
  }
}
```

<a name="program.all"></a>

## program.all

Getting all uploaded program

### Result

| Name                    | Type    | Constraints | Description                    |
| ----------------------- | ------- | ----------- | ------------------------------ |
| result                  | array   |             |                                |
| result[0]               | object  |             |                                |
| result[0].hash          | string  |             | program hash                   |
| result[0].blockHash     | string  |             | hash of block with program     |
| result[0].programNumber | string  |             | Number of program in order     |
| result[0].name          | string  |             | Program name                   |
| result[0].callCount     | integer |             | Number of program call         |
| result[0].uploadedAt    | string  |             | Date when program was uploaded |

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
      "uploadedAt": "Fri Jun 18 2021 16:17:01 GMT+0300 (Moscow Standard Time)"
    }
  ]
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

| Name                 | Type    | Constraints | Description                      |
| -------------------- | ------- | ----------- | -------------------------------- |
| params               | object  |             |                                  |
| params.file          |         |             | File buffer                      |
| params.filename      | string  |             | File name                        |
| params.gasLimit      | integer |             | Gas limit                        |
| params.value         | integer |             | Init value                       |
| params?.initPayload  | string  |             | Init payload (hex)               |
| params?.initType     | string  |             | Type of initial payload          |
| params?.incomingType | string  |             | Type of incoming message         |
| params?.expectedType | string  |             | Expected type of reponse message |
| params?.keyPairJson  | string  |             | JSON Encoded KeyPair data        |

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
    "initType": "utf8",
    "incomingType": "utf8",
    "expectedType": "utf8"
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
