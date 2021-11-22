export const data1 = { id: { decimal: 'u64', hex: 'Bytes' } };
export const data2 = {
  exchangeRate: { _enum_Result: { ok: 'u8', err: 'u8' } },
  sum: 'u8',
};

export const data5 = [
  {
    AddMessage: {
      author: 'Text',
      msg: 'Text',
    },
  },
  {
    AddMessage: {
      author: 'Text',
      msg: 'Text',
    },
  },
];
export const simpleStruct = {
  AddMessage: { author: 'Text', msg: 'Text' },
};
export const simpleDeepStruct = {
  AddMessage: {
    author: 'Text',
    msg: 'Text',
    To: {
      name: 'Text',
      from: 'Text',
    },
  },
};
export const simpleEnum = {
  _enum: {
    AddMessage: { author: 'Text', msg: 'Text' },
    ViewMessages: 'Null',
  },
};
export const simpleEnumOption = {
  field: {
    _enum_Option: 'String',
  },
};
export const complexEnumOption = {
  res: {
    _enum_Option: {
      id: { decimal: 'u64', hex: 'Bytes' },
      person: { surname: 'Text', name: 'Text' },
    },
  },
};
export const simpleEnumResult = {
  exchangeRate: {
    _enum_Result: { ok: 'u8', err: 'u8' },
  },
};
export const complexEnumResult = {
  exchangeRate: {
    _enum_Result: {
      ok: 'u8',
      err: { _enum_Option: 'String' },
    },
  },
};
