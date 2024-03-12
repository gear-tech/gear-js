# @gear-js/api-gateway


# JSON-RPC API Documentation

This document describes the JSON-RPC API for our service.

## Overview

Our service uses JSON-RPC 2.0 for communication. All requests should be POST requests with a JSON body.

## Methods

### `networkData.available`

Checks if the network data is indexed

<details>
<summary>Details</summary>

#### Parameters

- `genesis` (string): The genesis of the network.

#### Response

- `result` (boolean): Returns `true` if the network is indexed, `false` otherwise.

#### Example

Request:

```json
{
  "jsonrpc": "2.0",
  "method": "networkData.available",
  "params": {
    "genesis": "0x..."
  },
  "id": 1
}
```

Response:

```json
{
  "jsonrpc": "2.0",
  "result": true,
  "id": 1
}
```

</details>

### `testBalance.available`

Checks if there is a service allowing to get test balance on the network

<details>
<summary>Click to expand!</summary>

#### Parameters

- `genesis` (string): The network genesis

#### Response

- `result` (boolean): Returns `true` if a service allowing to get test balance on the network is available, `false` otherwise.

#### Example

Request:

```json
{
  "jsonrpc": "2.0",
  "method": "testBalance.available",
  "params": {
    "genesis": "0x..."
  },
  "id": 1
}
```

Response:

```json
{
  "jsonrpc": "2.0",
  "result": true,
  "id": 1
}
```

</details>

### `code.all`

Get list of codes.

<details>
<summary>Click to expand!</summary>

#### Parameters

- `genesis` (string): The network genesis
- `limit` (number, default - 20): The maximum number of items to return.
- `offset` (number, default - 0): The number of items to skip before starting to return items.
- `query` (string, optional): A query string to search by part of the id or part of the name.
- `name` (string, optional): The name of the code.
- `fromDate` (string, optional): The start date for the range within which to search for codes. The date should be in ISO 8601 format (YYYY-MM-DD)
- `toDate` (string, optional): The end date for the range within which to search for codes. The date should be in ISO 8601 format (YYYY-MM-DD).
- `uploadedBy` (string, optional): The public key of the user who uploaded the code. Use this to filter codes by uploader.

#### Response

- `result` (array): An array of code objects. Each object contains details about a code, such as its id, name, upload date, and uploader.

#### Example

Request:

```json
{
  "jsonrpc": "2.0",
  "method": "code.all",
  "params": {
    "genesis": "0x...",
    "query": "ab123c",
    "fromDate": "2022-01-01",
    "toDate": "2022-12-31",
    "uploadedBy": "0x...",
    "limit": 10,
    "offset": 0
  },
  "id": 1
}
```

Response:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "count": 2,
    "listCode": [
      {
        "id": "0x570d184cb5ff2b845b63ce7f94c2a191b658bb6e42eab94627397f969e9be6e8",
        "uploadedBy": "0xd6ba31b063bb5772340340a01d07da39718c848efcfb86d051d49c8fec030cba",
        "name": "0x570d184cb5ff2b845b63ce7f94c2a191b658bb6e42eab94627397f969e9be6e8",
        "status": "Active",
        "expiration": null,
        "metahash": "0xdedd8663580779a9c869640c044c960bfa6750daf64c74bd3fff762d2697b32d",
        "hasState": true,
      },
      {
        "id": "0xc9998ec8b51bccc4e3077099649c99beebc0d609f21d1d565d7de92b82a1973b",
        "uploadedBy": "0xd6ba31b063bb5772340340a01d07da39718c848efcfb86d051d49c8fec030cba",
        "name": "my_code",
        "status": "Inactive",
        "expiration": null,
        "metahash": "0x97ac512079f4877503d16ede380b23ceefb2cc340cd9313c911a3110336f8c76",
        "hasState": false,
      },
    ]
  },
  "id": 1
}
```

</details>


### `code.data`

Retrieves detailed information about a specific code.

<details>
<summary>Click to expand!</summary>

#### Parameters

- `genesis` (string): The network genesis
- `id` (string): The id of the code for which to retrieve details.

#### Response

- `result` (object): An object containing detailed information about the code.

#### Example

Request:

```json
{
  "jsonrpc": "2.0",
  "method": "code.all",
  "params": {
    "genesis": "0x...",
    "id": "0x570d184cb5ff2b845b63ce7f94c2a191b658bb6e42eab94627397f969e9be6e8",
  },
  "id": 1
}
```

Response:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "id": "0x570d184cb5ff2b845b63ce7f94c2a191b658bb6e42eab94627397f969e9be6e8",
    "uploadedBy": "0xd6ba31b063bb5772340340a01d07da39718c848efcfb86d051d49c8fec030cba",
    "name": "0x570d184cb5ff2b845b63ce7f94c2a191b658bb6e42eab94627397f969e9be6e8",
    "status": "Active",
    "expiration": null,
    "metahash": "0xdedd8663580779a9c869640c044c960bfa6750daf64c74bd3fff762d2697b32d",
    "hasState": true
  },
  "id": 1
}
```

</details>


### `code.name.add`

Assigns a name to a code.

<details>
<summary>Click to expand!</summary>

#### Parameters

- `genesis` (string): The network genesis.
- `id` (string): The id of the code to which to assign a name.
- `name` (string): The name to assign to the code.

#### Response

- `result` (object): An object containing detailed information about the code.

#### Example

Request:

```json
{
  "jsonrpc": "2.0",
  "method": "code.name.add",
  "params": {
    "genesis": "0x...",
    "id": "0x570d184cb5ff2b845b63ce7f94c2a191b658bb6e42eab94627397f969e9be6e8",
    "name": "my_code"
  },
  "id": 1
}
```

Response:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "id": "0x570d184cb5ff2b845b63ce7f94c2a191b658bb6e42eab94627397f969e9be6e8",
    "uploadedBy": "0xd6ba31b063bb5772340340a01d07da39718c848efcfb86d051d49c8fec030cba",
    "name": "my_code",
    "status": "Active",
    "expiration": null,
    "metahash": "0xdedd8663580779a9c869640c044c960bfa6750daf64c74bd3fff762d2697b32d",
    "hasState": true
  },
  "id": 1
}
```

</details>

### `program.all`

Get list of programs.

<details>
<summary>Click to expand!</summary>

#### Parameters

- `genesis` (string): The network genesis
- `limit` (number, default - 20): The maximum number of items to return.
- `offset` (number, default - 0): The number of items to skip before starting to return items.
- `query` (string, optional): A query string to search by part of the id or part of the name.
- `fromDate` (string, optional): The start date for the range within which to search for programs. The date should be in ISO 8601 format (YYYY-MM-DD)
- `toDate` (string, optional): The end date for the range within which to search for programs. The date should be in ISO 8601 format (YYYY-MM-DD).
- `owner` (string, optional): The public key of the user who created the program. Use this to filter programs by uploader.
- `codeId` (string, optional): The id of the code that the program uses.
- `status` (string | string[], optional): The status of the program. Use this to filter programs by status. Possible values are `active`, `inactive`, `programSet`, `exited`, `paused`.

#### Response

- `result` (array): An array of program objects. Each object contains details about a program, such as its id, name, upload date, and uploader.

#### Example

Request:

```json
{
  "jsonrpc": "2.0",
  "method": "program.all",
  "params": {
    "genesis": "0x...",
    "query": "ab123c",
    "fromDate": "2022-01-01",
    "toDate": "2022-12-31",
    "limit": 10,
    "offset": 0
  },
  "id": 1
}
```

Response:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "count": 2,
    "programs": [
      {
        "id": "0x5835bda08cc9757ea6011ae5bc3f4d8c0357581bb07c3ff195cdac08bbe1deb5",
        "owner": "0xd6ba31b063bb5772340340a01d07da39718c848efcfb86d051d49c8fec030cba",
        "name": "0x5835bda08cc9757ea6011ae5bc3f4d8c0357581bb07c3ff195cdac08bbe1deb5",
        "status": "active",
        "codeId":"0xc9998ec8b51bccc4e3077099649c99beebc0d609f21d1d565d7de92b82a1973b",
        "metahash": "0xdedd8663580779a9c869640c044c960bfa6750daf64c74bd3fff762d2697b32d",
        "hasState": true,
      },
      {
        "id": "0x3f7f4e6365438d5f9f029aab677609901fc94718629a84a845634fafb7679f03",
        "owner": "0xd6ba31b063bb5772340340a01d07da39718c848efcfb86d051d49c8fec030cba",
        "name": "my_program",
        "status": "inactive",
        "codeId": "0x570d184cb5ff2b845b63ce7f94c2a191b658bb6e42eab94627397f969e9be6e8",
        "metahash": "0x97ac512079f4877503d16ede380b23ceefb2cc340cd9313c911a3110336f8c76",
        "hasState": false,
      },
    ]
  },
  "id": 1
}
```

</details>


### `program.data`

Retrieves detailed information about a specific program.

<details>
<summary>Click to expand!</summary>

#### Parameters

- `genesis` (string): The network genesis
- `id` (string): The id of the program for which to retrieve details.

#### Response

- `result` (object): An object containing detailed information about the program.

#### Example

Request:

```json
{
  "jsonrpc": "2.0",
  "method": "program.data",
  "params": {
    "genesis": "0x...",
    "id": "0x5835bda08cc9757ea6011ae5bc3f4d8c0357581bb07c3ff195cdac08bbe1deb5", 
  },
  "id": 1
}
```

Response:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "id": "0x5835bda08cc9757ea6011ae5bc3f4d8c0357581bb07c3ff195cdac08bbe1deb5",
    "owner": "0xd6ba31b063bb5772340340a01d07da39718c848efcfb86d051d49c8fec030cba",
    "name": "0x5835bda08cc9757ea6011ae5bc3f4d8c0357581bb07c3ff195cdac08bbe1deb5",
    "status": "active",
    "codeId":"0xc9998ec8b51bccc4e3077099649c99beebc0d609f21d1d565d7de92b82a1973b",
    "metahash": "0xdedd8663580779a9c869640c044c960bfa6750daf64c74bd3fff762d2697b32d",
    "hasState": true,
  },
  "id": 1
}
```

</details>



### `program.name.add`

Assigns a name to a program.

<details>
<summary>Click to expand!</summary>

#### Parameters

- `genesis` (string): The network genesis.
- `id` (string): The id of the program to which to assign a name.
- `name` (string): The name to assign to the program.

#### Response

- `result` (object): An object containing detailed information about the program.

#### Example

Request:

```json
{
  "jsonrpc": "2.0",
  "method": "program.name.add",
  "params": {
    "genesis": "0x...",
    "id": "0x5835bda08cc9757ea6011ae5bc3f4d8c0357581bb07c3ff195cdac08bbe1deb5",
    "name": "my_program"
  },
  "id": 1
}
```

Response:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "id": "0x5835bda08cc9757ea6011ae5bc3f4d8c0357581bb07c3ff195cdac08bbe1deb5",
    "owner": "0xd6ba31b063bb5772340340a01d07da39718c848efcfb86d051d49c8fec030cba",
    "name": "my_program",
    "status": "active",
    "codeId":"0xc9998ec8b51bccc4e3077099649c99beebc0d609f21d1d565d7de92b82a1973b",
    "metahash": "0xdedd8663580779a9c869640c044c960bfa6750daf64c74bd3fff762d2697b32d",
    "hasState": true, 
  },
  "id": 1
}
```

</details>


### `message.all`

Get list of messages.

<details>
<summary>Click to expand!</summary>

#### Parameters

- `genesis` (string): The network genesis
- `limit` (number, default - 20): The maximum number of items to return.
- `offset` (number, default - 0): The number of items to skip before starting to return items.
- `fromDate` (string, optional): The start date for the range within which to search for programs. The date should be in ISO 8601 format (YYYY-MM-DD)
- `toDate` (string, optional): The end date for the range within which to search for programs. The date should be in ISO 8601 format (YYYY-MM-DD).
- `destination` (string, optional): The public key of the recipient of the message.
- `source` (string, optional): The public key of the sender of the message.
- `mailbox` (boolean, optional): If true, returns only messages that are in the mailbox of the recipient.
- `type` (string, optional): The type of the message. Possible values are `UserMessageSent`, `MessageQueued`
- `withPrograms` (boolean, optional): If true, returns messages and list of program names.

#### Response

- `result` (array): An array of message objects. Each object contains details about a message, such as its id, source, destination, etc.

#### Example

Request:

```json
{
  "jsonrpc": "2.0",
  "method": "message.all",
  "params": {
    "genesis": "0x...",
    "fromDate": "2022-01-01",
    "toDate": "2022-12-31",
    "source": "0x5835bda08cc9757ea6011ae5bc3f4d8c0357581bb07c3ff195cdac08bbe1deb5",
    "destination": "0xb77bc0d1303cb352169fc44abb980e1fb84cf771618b9b939a9652b3d2744282",
    "limit": 10,
    "offset": 0,
    "withPrograms": true
  },
  "id": 1
}
```

Response:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "count": 2,
    "messages": [
      {
        "id": "0x5835bda08cc9757ea6011ae5bc3f4d8c0357581bb07c3ff195cdac08bbe1deb5",
        "blockHash": "0xcd768540b85127b3605907f11c94bf850076639afafe2771014fb2e63ff13f3d",
        "genesis": "0x5835bda08cc9757ea6011ae5bc3f4d8c0357581bb07c3ff195cdac08bbe1deb5",
        "timestamp": "1698746421000",
        "destination":"0xc9998ec8b51bccc4e3077099649c99beebc0d609f21d1d565d7de92b82a1973b",
        "source": "0xdedd8663580779a9c869640c044c960bfa6750daf64c74bd3fff762d2697b32d",
        "payload": "0x",
        "entry": "handle",
        "expiration": null,
        "replyToMessageId": null,
        "exitCode": null,
        "processedWithPanic": false,
        "value": "0",
        "type": "MessageQueued",
        "readReason": null,
      },
      {
        "id": "0xdc0329e1723e75bdc7984d2c608241390851d3212d6163109c20f80ebe18ecdc",
        "blockHash": "0xcd768540b85127b3605907f11c94bf850076639afafe2771014fb2e63ff13f3d",
        "genesis": "0x5835bda08cc9757ea6011ae5bc3f4d8c0357581bb07c3ff195cdac08bbe1deb5",
        "timestamp": "1698746421000",
        "destination":"0xdedd8663580779a9c869640c044c960bfa6750daf64c74bd3fff762d2697b32d",
        "source": "0xc9998ec8b51bccc4e3077099649c99beebc0d609f21d1d565d7de92b82a1973b",
        "payload": "0x",
        "entry": null,
        "expiration": null,
        "replyToMessageId": "0x5835bda08cc9757ea6011ae5bc3f4d8c0357581bb07c3ff195cdac08bbe1deb5",
        "exitCode": null,
        "processedWithPanic": false,
        "value": "0",
        "type": "UserMessageSent",
        "readReason": null,
      },
    ],
    "programNames": {
      "0xc9998ec8b51bccc4e3077099649c99beebc0d609f21d1d565d7de92b82a1973b": "my_program"
    }
  },
  "id": 1
}
```

</details>


### `message.data`

Retrieves detailed information about a specific message.

<details>
<summary>Click to expand!</summary>

#### Parameters

- `genesis` (string): The network genesis
- `id` (string): The id of the program for which to retrieve details.,
- `withMetahash` (boolean, optional): If true, returns the metahash that can be used to get metadata to decode the payload of the message.

#### Response

- `result` (object): An object containing detailed information about the message.

#### Example

Request:

```json
{
  "jsonrpc": "2.0",
  "method": "message.data",
  "params": {
    "genesis": "0x...",
    "id": "0xdc0329e1723e75bdc7984d2c608241390851d3212d6163109c20f80ebe18ecdc", 
  },
  "id": 1
}
```

Response:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "id": "0xdc0329e1723e75bdc7984d2c608241390851d3212d6163109c20f80ebe18ecdc",
    "blockHash": "0xcd768540b85127b3605907f11c94bf850076639afafe2771014fb2e63ff13f3d",
    "genesis": "0x5835bda08cc9757ea6011ae5bc3f4d8c0357581bb07c3ff195cdac08bbe1deb5",
    "timestamp": "1698746421000",
    "destination":"0xdedd8663580779a9c869640c044c960bfa6750daf64c74bd3fff762d2697b32d",
    "source": "0xc9998ec8b51bccc4e3077099649c99beebc0d609f21d1d565d7de92b82a1973b",
    "payload": "0x",
    "entry": null,
    "expiration": null,
    "replyToMessageId": "0x5835bda08cc9757ea6011ae5bc3f4d8c0357581bb07c3ff195cdac08bbe1deb5",
    "exitCode": null,
    "processedWithPanic": false,
    "value": "0",
    "type": "UserMessageSent",
    "readReason": null,
  },
  "id": 1
}
```

</details>

### `meta.get`

Retrieves metadata for a specific metahash.

<details>
<summary>Click to expand!</summary>

#### Parameters

- `hash` (string): The metahash for which to retrieve metadata.

#### Response

- `result` (object): An object containing metadata for the metahash.

#### Example

Request:

```json
{
  "jsonrpc": "2.0",
  "method": "meta.get",
  "params": {
    "hash": "0xdc0329e1723e75bdc7984d2c608241390851d3212d6163109c20f80ebe18ecdc", 
  },
  "id": 1
}
```

Response:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "hash": "0xdc0329e1723e75bdc7984d2c608241390851d3212d6163109c20f80ebe18ecdc",
    "hex": "0x",
  },
  "id": 1
}
```

</details>

### `meta.add`

Adds metadata for a specific metahash.

<details>
<summary>Click to expand!</summary>

#### Parameters

- `hash` (string): The metahash for which to retrieve metadata.
- `hex` (string): The metadata in hex format.

#### Response

- `result` (object): An object containing metadata and metahash

#### Example

Request:

```json
{
  "jsonrpc": "2.0",
  "method": "meta.add",
  "params": {
    "hash": "0xdc0329e1723e75bdc7984d2c608241390851d3212d6163109c20f80ebe18ecdc", 
    "hex": "0x"
  },
  "id": 1
}
```

Response:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "hash": "0xdc0329e1723e75bdc7984d2c608241390851d3212d6163109c20f80ebe18ecdc",
    "hex": "0x",
  },
  "id": 1
}
```

</details>


