const abi = [
  {
    type: 'function',
    name: 'fnManagerAddCheckers',
    inputs: [
      { name: 'checkers', type: 'bytes32[]', internalType: 'bytes32[]' },
      { name: '_value', type: 'uint128', internalType: 'uint128' },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'fnManagerCheckPointsSet',
    inputs: [
      { name: 'max_iter', type: 'uint32', internalType: 'uint32' },
      { name: 'batch_size', type: 'uint32', internalType: 'uint32' },
      { name: 'continue_checking', type: 'bool', internalType: 'bool' },
      { name: '_value', type: 'uint128', internalType: 'uint128' },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'fnManagerGenerateAndStorePoints',
    inputs: [
      { name: 'width', type: 'uint32', internalType: 'uint32' },
      { name: 'height', type: 'uint32', internalType: 'uint32' },
      {
        name: 'x_min',
        type: 'tuple',
        internalType: 'struct IManager.FixedPoint',
        components: [
          { name: 'num', type: 'int64', internalType: 'int64' },
          { name: 'scale', type: 'uint32', internalType: 'uint32' },
        ],
      },
      {
        name: 'x_max',
        type: 'tuple',
        internalType: 'struct IManager.FixedPoint',
        components: [
          { name: 'num', type: 'int64', internalType: 'int64' },
          { name: 'scale', type: 'uint32', internalType: 'uint32' },
        ],
      },
      {
        name: 'y_min',
        type: 'tuple',
        internalType: 'struct IManager.FixedPoint',
        components: [
          { name: 'num', type: 'int64', internalType: 'int64' },
          { name: 'scale', type: 'uint32', internalType: 'uint32' },
        ],
      },
      {
        name: 'y_max',
        type: 'tuple',
        internalType: 'struct IManager.FixedPoint',
        components: [
          { name: 'num', type: 'int64', internalType: 'int64' },
          { name: 'scale', type: 'uint32', internalType: 'uint32' },
        ],
      },
      { name: 'points_per_call', type: 'uint32', internalType: 'uint32' },
      { name: 'continue_generation', type: 'bool', internalType: 'bool' },
      {
        name: 'check_points_after_generation',
        type: 'bool',
        internalType: 'bool',
      },
      { name: 'max_iter', type: 'uint32', internalType: 'uint32' },
      { name: 'batch_size', type: 'uint32', internalType: 'uint32' },
      { name: '_value', type: 'uint128', internalType: 'uint128' },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'fnManagerRestart',
    inputs: [{ name: '_value', type: 'uint128', internalType: 'uint128' }],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'fnManagerResultCalculated',
    inputs: [
      { name: 'indexes', type: 'uint32[]', internalType: 'uint32[]' },
      { name: 'results', type: 'uint32[]', internalType: 'uint32[]' },
      { name: '_value', type: 'uint128', internalType: 'uint128' },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'fnManagerSendNextBatch',
    inputs: [
      { name: 'checker', type: 'bytes32', internalType: 'bytes32' },
      { name: 'max_iter', type: 'uint32', internalType: 'uint32' },
      { name: 'batch_size', type: 'uint32', internalType: 'uint32' },
      { name: '_value', type: 'uint128', internalType: 'uint128' },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'initialize',
    inputs: [{ name: '_mirror', type: 'address', internalType: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'mirror',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'onMessageSent',
    inputs: [
      { name: 'id', type: 'bytes32', internalType: 'bytes32' },
      { name: 'destination', type: 'address', internalType: 'address' },
      { name: 'payload', type: 'bytes', internalType: 'bytes' },
      { name: 'value', type: 'uint128', internalType: 'uint128' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'onReplySent',
    inputs: [
      { name: 'destination', type: 'address', internalType: 'address' },
      { name: 'payload', type: 'bytes', internalType: 'bytes' },
      { name: 'value', type: 'uint128', internalType: 'uint128' },
      { name: 'replyTo', type: 'bytes32', internalType: 'bytes32' },
      { name: 'replyCode', type: 'bytes4', internalType: 'bytes4' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'sendMessage',
    inputs: [
      { name: '_payload', type: 'bytes', internalType: 'bytes' },
      { name: '_value', type: 'uint128', internalType: 'uint128' },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'event',
    name: 'ErrorReply',
    inputs: [
      { name: 'payload', type: 'bytes', indexed: false, internalType: 'bytes' },
      {
        name: '_destination',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: '_value',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
      {
        name: '_replyTo',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
      {
        name: '_replyCode',
        type: 'bytes4',
        indexed: false,
        internalType: 'bytes4',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ManagerAddCheckersReply',
    inputs: [
      { name: 'payload', type: 'bytes', indexed: false, internalType: 'bytes' },
      {
        name: '_destination',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: '_value',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
      {
        name: '_replyTo',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
      {
        name: '_replyCode',
        type: 'bytes4',
        indexed: false,
        internalType: 'bytes4',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ManagerCheckPointsSetReply',
    inputs: [
      { name: 'payload', type: 'bytes', indexed: false, internalType: 'bytes' },
      {
        name: '_destination',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: '_value',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
      {
        name: '_replyTo',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
      {
        name: '_replyCode',
        type: 'bytes4',
        indexed: false,
        internalType: 'bytes4',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ManagerGenerateAndStorePointsReply',
    inputs: [
      { name: 'payload', type: 'bytes', indexed: false, internalType: 'bytes' },
      {
        name: '_destination',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: '_value',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
      {
        name: '_replyTo',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
      {
        name: '_replyCode',
        type: 'bytes4',
        indexed: false,
        internalType: 'bytes4',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ManagerRestartReply',
    inputs: [
      { name: 'payload', type: 'bytes', indexed: false, internalType: 'bytes' },
      {
        name: '_destination',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: '_value',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
      {
        name: '_replyTo',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
      {
        name: '_replyCode',
        type: 'bytes4',
        indexed: false,
        internalType: 'bytes4',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ManagerResultCalculatedReply',
    inputs: [
      { name: 'payload', type: 'bytes', indexed: false, internalType: 'bytes' },
      {
        name: '_destination',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: '_value',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
      {
        name: '_replyTo',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
      {
        name: '_replyCode',
        type: 'bytes4',
        indexed: false,
        internalType: 'bytes4',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ManagerSendNextBatchReply',
    inputs: [
      { name: 'payload', type: 'bytes', indexed: false, internalType: 'bytes' },
      {
        name: '_destination',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: '_value',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
      {
        name: '_replyTo',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
      {
        name: '_replyCode',
        type: 'bytes4',
        indexed: false,
        internalType: 'bytes4',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OnMessageEvent',
    inputs: [
      { name: 'payload', type: 'bytes', indexed: false, internalType: 'bytes' },
      { name: '_id', type: 'bytes32', indexed: false, internalType: 'bytes32' },
      {
        name: '_destination',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: '_value',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OnReplyEvent',
    inputs: [
      { name: 'payload', type: 'bytes', indexed: false, internalType: 'bytes' },
      {
        name: '_destination',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: '_value',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
      {
        name: '_replyTo',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
      {
        name: '_replyCode',
        type: 'bytes4',
        indexed: false,
        internalType: 'bytes4',
      },
    ],
    anonymous: false,
  },
];

export default abi;
