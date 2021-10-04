const assert = require('assert');
const { CreateType } = require('../lib');

describe('Create custom types test', () => {
  function checkPayload(payload, decoded) {
    Object.getOwnPropertyNames(payload).forEach((key) => {
      if (typeof payload[key] === 'object') {
        if (decoded[key]) {
          assert(payload[key], decoded[key]);
        } else {
          return false;
        }
      } else {
        if (!(payload[key] === decoded[key])) {
          return false;
        }
      }
    });
    return true;
  }
  const meta = {
    types: {
      Id: { decimal: 'u64', hex: 'Vec<u8>' },
      MessageIn: { id: 'Id' },
      MessageInitIn: { amount: 'u8', currency: 'Vec<u8>' },
      MessageInitOut: { exchange_rate: 'Result<u8,u8>', sum: 'u8' },
      MessageOut: { res: 'Vec<Result<Wallet,Vec<u8>>>' },
      Person: {
        name: 'String',
        patronymic: 'Option<String>',
        surname: 'String'
      },
      Wallet: { id: 'Id', person: 'Person' }
    }
  };
  it('MessageInitIn', () => {
    const payload = { amount: 8, currency: 'USD' };
    const encoded = CreateType.encode('MessageIn', payload, meta);
    const decoded = CreateType.decode('MessageIn', encoded, meta);
    assert.ok(checkPayload(payload, decoded.toJSON()));
  });
  it('MessageInitOut', () => {
    const payload = {
      exchange_rate: {
        err: 1
      },
      sum: 31
    };
    const encoded = CreateType.encode('MessageIn', payload, meta);
    const decoded = CreateType.decode('MessageIn', encoded, meta);
    assert.ok(checkPayload(payload, decoded.toJSON()));
  });
  it('MessageIn', () => {
    const payload = { decimal: 1234, hex: '0x514365' };
    const encoded = CreateType.encode('MessageIn', payload, meta);
    const decoded = CreateType.decode('MessageIn', encoded, meta);
    assert.ok(checkPayload(payload, decoded.toJSON()));
  });

  it('MessageOut', () => {
    const payload = {
      res: [
        {
          ok: {
            id: {
              decimal: 1,
              hex: '0x31'
            },
            person: {
              name: 'Name',
              patronymic: null,
              surname: 'Surname'
            }
          }
        }
      ]
    };
    const encoded = CreateType.encode('MessageOut', payload, meta);
    const decoded = CreateType.decode('MessageOut', encoded, meta);
    assert.ok(checkPayload(payload, decoded.toJSON()));
  });
});
