import { getPreformattedText } from 'helpers';
import { getPayloadValue } from 'components/common/Form/FormPayload/helpers';
import { TypeStructure, FormPayloadValues } from 'components/common/Form/FormPayload/types';
import { FormValues } from './types';

export const INIT_FORM_VALUES: FormValues = {
  payload: '',
};

export const INPUT_TYPE_STRUCTURE: TypeStructure = {
  type: 'Enum',
  name: 'Action',
  // @ts-ignore
  value: {
    Option: {
      type: 'Option',
      name: 'Option<Person>',
      value: {
        type: 'Struct',
        name: 'Person',
        value: {
          firstName: {
            type: 'Primitive',
            name: 'Text',
            value: 'Text',
          },
          secondName: {
            type: 'Primitive',
            name: 'Text',
            value: 'Text',
          },
          age: {
            type: 'Option',
            name: 'Option<i8>',
            value: {
              type: 'Primitive',
              name: 'i8',
              value: 'i8',
            },
          },
        },
      },
    },
    Result: {
      type: 'Result',
      name: 'Result<Text, i32>',
      value: {
        ok: {
          type: 'Primitive',
          name: 'Text',
          value: 'Text',
        },
        err: {
          type: 'Primitive',
          name: 'i32',
          value: 'i32',
        },
      },
    },
    Vec: {
      type: 'Vec',
      name: 'Vec<Person>',
      value: {
        type: 'Struct',
        name: 'Person',
        value: {
          firstName: {
            type: 'Primitive',
            name: 'Text',
            value: 'Text',
          },
          secondName: {
            type: 'Primitive',
            name: 'Text',
            value: 'Text',
          },
          age: {
            type: 'Option',
            name: 'Option<i8>',
            value: {
              type: 'Primitive',
              name: 'i8',
              value: 'i8',
            },
          },
        },
      },
    },
    Struct: {
      type: 'Struct',
      name: 'Person',
      value: {
        firstName: {
          type: 'Primitive',
          name: 'Text',
          value: 'Text',
        },
        secondName: {
          type: 'Primitive',
          name: 'Text',
          value: 'Text',
        },
        age: {
          type: 'Option',
          name: 'Option<i8>',
          value: {
            type: 'Primitive',
            name: 'i8',
            value: 'i8',
          },
        },
      },
    },
    Tuple: {
      type: 'Tuple',
      name: '(ActorId,Text)',
      value: [
        {
          type: 'Primitive',
          name: 'ActorId',
          value: 'ActorId',
        },
        {
          type: 'Primitive',
          name: 'Text',
          value: 'Text',
        },
      ],
    },
    Array: {
      type: 'Array',
      name: '[u16;4]',
      value: {
        type: 'Primitive',
        name: 'u16',
        value: 'u16',
      },
      count: 4,
    },
    BTreeMap: {
      type: 'BTreeMap',
      name: 'BTreeMap<Text, u128>',
      value: {
        key: {
          type: 'Primitive',
          name: 'Text',
          value: 'Text',
        },
        value: {
          type: 'Primitive',
          name: 'u128',
          value: 'u128',
        },
      },
    },
    BTreeSet: {
      type: 'BTreeSet',
      name: 'BTreeSet<u8>',
      value: {
        type: 'Primitive',
        name: 'u8',
        value: 'u8',
      },
    },
  },
};

export const INPUT_MANUAL_PAYLOAD = {
  _enum: {
    Option: {
      _Option: {
        firstName: 'Text',
        secondName: 'Text',
        age: {
          _Option: 'i8',
        },
      },
    },
    Result: {
      _Result: {
        ok: 'Text',
        err: 'i32',
      },
    },
    Vec: {
      _Vec: {
        firstName: 'Text',
        secondName: 'Text',
        age: {
          _Option: 'i8',
        },
      },
    },
    Struct: {
      firstName: 'Text',
      secondName: 'Text',
      age: {
        _Option: 'i8',
      },
    },
    Tuple: ['ActorId', 'Text'],
    Array: ['u16', 4],
    BTreeMap: {
      _BTreeMap: ['Text', 'u128'],
    },
    BTreeSet: {
      _BTreeSet: 'u8',
    },
  },
};

export const INPUT_FILE_CONTENT = JSON.stringify({
  name: 'NAME',
  symbol: 'S',
  baseUri: 'URL',
  royalties: {
    accounts: ['10', '200'],
    percent: '200',
  },
});

export const INPUT_PAYLOAD_VALUES: FormPayloadValues = {
  payload: getPayloadValue(INPUT_TYPE_STRUCTURE),
  manualPayload: getPreformattedText(INPUT_MANUAL_PAYLOAD),
  typeStructure: INPUT_TYPE_STRUCTURE,
};
