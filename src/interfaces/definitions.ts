export default {
  types: {
    Message: {
      id: 'H256',
      source: 'H256',
      dest: 'H256',
      payload: 'Vec<u8>',
      gas_limit: 'u64',
      value: 'u128',
      reply: 'Option<(H256, i32)>',
    },
    Node: {
      value: 'Message',
      next: 'Option<H256>',
    },
    IntermediateMessage: {
      _enum: {
        InitProgram: {
          external_origin: 'H256',
          program_id: 'H256',
          code: 'Vec<u8>',
          payload: 'Vec<u8>',
          gas_limit: 'u64',
          value: 'u128',
        },
        DispatchMessage: {
          id: 'H256',
          route: 'MessageRoute',
          payload: 'Vec<u8>',
          gas_limit: 'u64',
          value: 'u128',
        },
      },
    },
    MessageError: {
      _enum: ['ValueTransfer', 'Dispatch'],
    },
    Reason: {
      _enum: ['ValueTransfer', 'Dispatch', 'BlockGasLimitExceeded'],
    },
  },
};
