import { FormValues } from './types';

import { getPreformattedText } from 'helpers';
import { getPayloadValue } from 'components/common/FormPayload/helpers';
import { TypeStructure, FormPayloadValues } from 'components/common/FormPayload/types';

export const INIT_FORM_VALUES: FormValues = {
  payload: '',
};

export const INPUT_TYPE_STRUCTURE: TypeStructure = {
  type: 'Enum',
  name: 'Action',
  //@ts-ignore
  value: {
    Test1: {
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
    Test2: {
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
    Test3: {
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
    Test4: {
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
    Test5: {
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
    Test6: {
      type: 'Array',
      name: '[u16;4]',
      value: {
        type: 'Primitive',
        name: 'u16',
        value: 'u16',
      },
      count: 4,
    },
    Test7: {
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
    Test8: {
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
    Test1: {
      _Option: {
        firstName: 'Text',
        secondName: 'Text',
        age: {
          _Option: 'i8',
        },
      },
    },
    Test2: {
      _Result: {
        ok: 'Text',
        err: 'i32',
      },
    },
    Test3: {
      _Vec: {
        firstName: 'Text',
        secondName: 'Text',
        age: {
          _Option: 'i8',
        },
      },
    },
    Test4: {
      firstName: 'Text',
      secondName: 'Text',
      age: {
        _Option: 'i8',
      },
    },
    Test5: ['ActorId', 'Text'],
    Test6: ['u16', 4],
    Test7: {
      _BTreeMap: ['Text', 'u128'],
    },
    Test8: {
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
