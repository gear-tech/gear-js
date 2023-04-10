<p align="center">
  <a href="https://gear-tech.io">
    <img src="https://github.com/gear-tech/gear/blob/master/images/logo-grey.png" width="400" alt="GEAR">
  </a>
</p>
<p align=center>
    <a href="https://github.com/gear-tech/gear-js/blob/master/LICENSE"><img src="https://img.shields.io/badge/License-GPL%203.0-success"></a>
</p>
<hr>

## Description

A CLI tool that allows sending transactions to the Gear node based on yaml file.

## Installation

```bash
npm install -g @gear-js/cli
```

## Usage

First of all you need to create a `.yaml` file with all actions you want to perform.

To run workflow use this command
```bash
gear-js workflow path/to/workflow.yaml
```

You can also specify some arguments to be used instead of the unknown parts of the payloads (`$cli token_name`)
```bash
gear-js workflow path/to/workflow.yaml -a token_name=MY_NFT url=https://gear-tech.io
```

To specify the endpoint of the node to connect to, use the CLI argument `--ws`.
```bash
gear-js workflow path/to/wotkflow.yaml --ws wss://rpc-node.gear-tech.io
```

### Structure of the workflow file
1. Accounts
There are a few ways to specify an account:
- Using mnemonic phrase
- Using seed
- Using well-known account such as `Alice` and `Bob` 
```yaml
accounts:
  alice: bottom drive obey lake curtain smoke basket hold race lonely fit walk//Alice
  bob: //Bob
  my_account: '0x...seed'
```
2. Fund accounts
If you need to fund some of specified accounts you need to provide account name that already has balance to fund other accounts.
```yaml
prefunded_account:
  alice

fund_accounts:
  my_account: 1000000000
```

3. Programs
Specify in this section all the programs you want to upload or interact with.

```yaml
programs:
  - id: 0
    address: '0xa5291ad71150456ecf304d12c8e4bc0d01fbcc203b9fa92532bf50c0377f87c4'
    path_to_meta: ./programs/nft.meta.txt

  - name: Non-Fungible Token 1
    id: 1
    path_to_wasm: ./programs/nft.opt.wasm
    path_to_meta: ./programs/nft.meta.txt
    payload: 
      name: GNFT
      symbol: GNFT
      base_uri: https://gear-tech.io
      royalties: null
```

3. Transactions
Specify all the transaction you want to perform.
It's possible to specify unknown parts of the payloads (such as program, code, acc).
- `$program 0` will be replaced by the programId of the uploaded program under id 0
- `$code 1` will be replaced by the code id of the uploaded code under id 1
- `$account alice` will be replaced by the Alice public key
- `$cli token_name` will be replaced by the argument that you provide in the cli interface

```yaml
transactions:
  - type: upload_program
    program: 1
    account: alice

  - type: send_message
    program: 0
    account: bob
    payload:
      Mint:
        transaction_id: 0
        token_metadata: 
          TokenMetadata:
            name: $cli token_name
            description: $program 1
            media: https://
            reference: https://
    value: 0
```
