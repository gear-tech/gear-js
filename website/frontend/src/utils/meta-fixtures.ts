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

export const enumSimple = {
  _enum: {
    AddMessage: { author: 'Text', msg: 'Text' },
    Post: 'Text',
    ViewMessages: 'Null',
  },
};

export const optionEnumSimple = {
  _enum_Option: 'String',
};

export const optionEnumWithFieldsObject = {
  _enum_Option: {
    firstName: 'Text',
    lastName: 'Text',
  },
};

export const optionEnumNested = {
  field: {
    _enum_Option: 'String',
  },
};

export const optionEnumNestedWithFieldsObject = {
  field: {
    _enum_Option: {
      firstName: 'Text',
      lastName: 'Text',
    },
  },
};

export const optionEnumComplex = {
  res: {
    _enum_Option: {
      id: { decimal: 'u64', hex: 'Bytes' },
      person: { surname: 'Text', name: 'Text' },
    },
  },
};

export const resultEnumSimple = {
  exchangeRate: {
    _enum_Result: { ok: 'u8', err: 'u8' },
  },
};

export const resultEnumComplex = {
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
