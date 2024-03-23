# @gear-js/voucher-indexer

# API

This document describes the API of the `@gear-js/voucher-indexer` service.

## Overview

## Endpoints

### GET /api/voucher/:id

Get a voucher by its ID.

#### Request

- **id** (string): The ID of the voucher.

#### Response

- **200**: The voucher was found.
- **404**: The voucher was not found.

```json
{
  "id": "0x123",
  "owner": "0x456",
  "spender": "0x789",
  "amount": "11000000000000",
  "balance": "10000000000000",
  "programs": ["0xabc", "0xdef"],
  "codeUploading": false,
  "expiryAtBlock": 1000,
  "expiryAt": "2021-01-01T00:00:00Z",
  "issuedAtBlock": 100,
  "issuedAt": "2020-01-01T00:00:00Z",
  "updatedAtBlock": 200,
  "updatedAt": "2020-01-02T00:00:00Z",
  "isDeclined": false
}
```

### POST /api/vouchers

Get a list of vouchers.

#### Request

- **owner** (string): The owner of the vouchers.
- **spender** (string): The spender of the vouchers.
- **programs** (string[]): The programs of the vouchers.
- **codeUploading** (boolean): Whether the vouchers are in code uploading state.
- **declined** (boolean): Whether the vouchers are declined.
- **expired** (boolean): Whether the vouchers are expired.
- **limit** (number): The maximum number of vouchers to return.
- **offset** (number): The offset of the vouchers to return.

#### Response

- **200**: The vouchers were found.

```json
{
  "vouchers": [
    {
      "id": "0x123",
      "owner": "0x456",
      "spender": "0x789",
      "amount": "11000000000000",
      "balance": "10000000000000",
      "programs": ["0xabc", "0xdef"],
      "codeUploading": false,
      "expiryAtBlock": 1000,
      "expiryAt": "2021-01-01T00:00:00Z",
      "issuedAtBlock": 100,
      "issuedAt": "2020-01-01T00:00:00Z",
      "updatedAtBlock": 200,
      "updatedAt": "2020-01-02T00:00:00Z",
      "isDeclined": false
    }
  ],
  "count": 1
}
```
