import { Account } from 'context/types';

export const TEST_ACCOUNT: Account = {
  address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
  meta: {
    genesisHash: null,
    name: 'Rich Alice',
    source: 'polkadot-js',
  },
  type: 'sr25519',
  balance: {
    value: '1',
    unit: 'MUnit',
  },
  decodedAddress: '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d',
};

export const TEST_API = {
  reply: {
    submit: jest.fn(),
    signAndSend: jest.fn(),
  },
  message: {
    submit: jest.fn(),
    signAndSend: jest.fn(),
  },
  balance: { findOut: jest.fn() },
  gearEvents: {
    subscribeToNewBlocks: jest.fn(),
    subscribeToBalanceChange: jest.fn(),
  },
  runtimeVersion: {
    specName: {
      toHuman: jest.fn(),
    },
    specVersion: {
      toHuman: jest.fn(),
    },
  },
  programState: {
    read: jest.fn(),
  },
};
