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
    Post: 'Text',
    ViewMessages: 'Null',
  },
};

export const enumOptionSimple = {
  _enum_Option: 'String',
};

export const enumOptionWithFieldsObject = {
  _enum_Option: {
    firstName: 'Text',
    lastName: 'Text',
  },
};

export const nestedEnumOption = {
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
      ok: {
        firstName: 'Text',
        secondName: 'Text',
      },
      err: { _enum_Option: 'String' },
    },
  },
};
