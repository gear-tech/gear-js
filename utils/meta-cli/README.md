<p align="center">
  <a href="https://gear-tech.io">
    <img src="https://raw.githubusercontent.com/gear-tech/gear/master/images/logo.svg" width="250" alt="GEAR">
  </a>
</p>
<p align=center>
    <a href="https://github.com/gear-tech/gear-js/blob/master/LICENSE"><img src="https://img.shields.io/badge/License-GPL%203.0-success"></a>
</p>
<hr>

## Description

CLI tool to encode / decode payloads and work with .meta.wasm files

## Installation

```sh
npm install -g @gear-js/gear-meta
```

or

```sh
yarn global add @gear-js/gear-meta
```

## Usage

#### All commands description

```sh
gear-meta --help
```

#### Available commands

- **decode** - _Decode payload from hex_
- **encode** - _Encode payload to hex_
- **meta** - _Display metadata from .meta.wasm_
- **type** - _Display type structure for particular type from .meta.wasm_

You can simply run these commands and you will be prompted to enter the neccessary data.
Or you can specify data through options:

- **-t, --type <type>** - _Type to encode or decode the payload. If it will not specified you can select it later_
- **-m, --meta <path>** - _Path to .meta.wasm file with program's metadata_
- **-o --output <path>** - _Output json file. If it doesn't exist it will be created_
- **-j --payloadFromJson** - _If need to take the payload from json_

For `decode` and `encode` commands available all of these options
For `meta` command available `-o --output` option
For `type` command available `-m, --meta` option

#### Examples

```sh
gear-meta encode '{"amount": 8, "currency": "GRT"}' -t init_input -m ./path/to/demo_meta.meta.wasm

# Output:
  # Result:
  # 0x080c475254
```

```sh
gear-meta decode '0x080c475254' -t init_input -m ./path/to/demo_meta.meta.wasm

# Output:
  # Result:
  # { amount: '8', currency: 'GRT' }
```

```sh
gear-meta type handle_input -m ./path/to/demo_meta.meta.wasm

# Output:
  # TypeName:  MessageIn
  # { id: { decimal: 'u64', hex: 'Bytes' } }
```

```sh
gear-meta meta ./path/to/demo_meta.meta.wasm

# Output:
  # Result:
  # {
  #   types: '0x50000824646...0000023800',
  #   init_input: 'MessageInitIn',
  #   init_output: 'MessageInitOut',
  #   async_init_input: 'MessageInitAsyncIn',
  #   async_init_output: 'MessageInitAsyncOut',
  #   handle_input: 'MessageIn',
  #   handle_output: 'MessageOut',
  #   async_handle_input: 'MessageHandleAsyncIn',
  #   async_handle_output: 'MessageHandleAsyncOut',
  #   title: 'Example program with metadata',
  #   meta_state_input: 'Option<Id>',
  #   meta_state_output: 'Vec<Wallet>',
  #   meta_state: undefined
  # }
```
