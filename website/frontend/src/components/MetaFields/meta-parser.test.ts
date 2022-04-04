import { parseMeta, prepareToSend } from './meta-parser';

import {
  simpleDeepStruct,
  simpleStruct,
  enumSimple,
  optionEnumSimple,
  optionEnumComplex,
  optionEnumNested,
  optionEnumWithFieldsObject,
  resultEnumSimple,
  resultEnumComplex,
  simpleNestedStruct,
  daoMeta,
  nestedEnum,
} from './meta-fixtures';

describe('test parser', () => {
  // TODO add edge case tests e.g for null, empty array, empty objects

  it('simple struct', () => {
    expect(parseMeta(simpleStruct)).toEqual({
      __root: {
        __type: '__fieldset',
        __name: '__root',
        __path: '__root',
        __select: false,
        __fields: {
          amount: {
            label: 'amount',
            type: 'u8',
            name: '__root.amount',
          },
          currency: {
            label: 'currency',
            type: 'Text',
            name: '__root.currency',
          },
        },
      },
      __values: {
        amount: '',
        currency: '',
      },
    });
  });

  it('nested simple struct', () => {
    expect(parseMeta(simpleNestedStruct)).toEqual({
      __root: {
        __type: '__fieldset',
        __name: '__root',
        __path: '__root',
        __select: false,
        __fields: {
          AddMessage: {
            __type: '__fieldset',
            __name: 'AddMessage',
            __path: '__root.AddMessage',
            __select: false,
            __fields: {
              author: {
                label: 'author',
                type: 'Text',
                name: '__root.AddMessage.author',
              },
              msg: {
                label: 'msg',
                type: 'Text',
                name: '__root.AddMessage.msg',
              },
            },
          },
        },
      },
      __values: {
        AddMessage: {
          author: '',
          msg: '',
        },
      },
    });
  });

  it('simple deep struct', () => {
    expect(parseMeta(simpleDeepStruct)).toEqual({
      __root: {
        __type: '__fieldset',
        __name: '__root',
        __path: '__root',
        __select: false,
        __fields: {
          AddMessage: {
            __type: '__fieldset',
            __name: 'AddMessage',
            __path: '__root.AddMessage',
            __select: false,
            __fields: {
              To: {
                __type: '__fieldset',
                __name: 'To',
                __path: '__root.AddMessage.To',
                __select: false,
                __fields: {
                  name: {
                    type: 'Text',
                    name: '__root.AddMessage.To.name',
                    label: 'name',
                  },
                  from: {
                    type: 'Text',
                    name: '__root.AddMessage.To.from',
                    label: 'from',
                  },
                },
              },
              author: {
                type: 'Text',
                name: '__root.AddMessage.author',
                label: 'author',
              },
              msg: {
                type: 'Text',
                name: '__root.AddMessage.msg',
                label: 'msg',
              },
            },
          },
        },
      },
      __values: {
        AddMessage: {
          To: {
            name: '',
            from: '',
          },
          author: '',
          msg: '',
        },
      },
    });
  });

  it('simple enum', () => {
    expect(parseMeta(enumSimple)).toEqual({
      __root: {
        __type: '__fieldset',
        __name: '__root',
        __path: '__root',
        __select: true,
        __fields: {
          AddMessage: {
            __type: '__fieldset',
            __name: 'AddMessage',
            __path: '__root.AddMessage',
            __select: false,
            __fields: {
              author: {
                type: 'Text',
                name: '__root.AddMessage.author',
                label: 'author',
              },
              msg: {
                type: 'Text',
                name: '__root.AddMessage.msg',
                label: 'msg',
              },
            },
          },
          Post: {
            type: 'Text',
            name: '__root.Post',
            label: 'Post',
          },
          ViewMessages: {
            type: 'Null',
            name: '__root.ViewMessages',
            label: 'ViewMessages',
          },
        },
      },
      __values: {
        AddMessage: {
          author: '',
          msg: '',
        },
        Post: '',
        ViewMessages: 'Null',
      },
    });
  });

  it('nested enum', () => {
    expect(parseMeta(nestedEnum)).toEqual({
      __root: {
        __fields: {
          Action: {
            __fields: {
              AddMessage: {
                label: 'AddMessage',
                name: '__root.Action.AddMessage',
                type: 'MessageIn',
              },
              ViewMessages: {
                label: 'ViewMessages',
                name: '__root.Action.ViewMessages',
                type: 'Null',
              },
            },
            __name: 'Action',
            __path: '__root.Action',
            __select: true,
            __type: '__fieldset',
          },
          MessageIn: {
            __fields: {
              author: {
                label: 'author',
                name: '__root.MessageIn.author',
                type: 'Text',
              },
              msg: {
                label: 'msg',
                name: '__root.MessageIn.msg',
                type: 'Text',
              },
            },
            __name: 'MessageIn',
            __path: '__root.MessageIn',
            __select: false,
            __type: '__fieldset',
          },
        },
        __name: '__root',
        __path: '__root',
        __select: false,
        __type: '__fieldset',
      },
      __values: {
        Action: {
          AddMessage: '',
          ViewMessages: 'Null',
        },
        MessageIn: {
          author: '',
          msg: '',
        },
      },
    });
  });

  it('dao enum', () => {
    expect(parseMeta(daoMeta)).toEqual({
      __root: {
        __fields: {
          Abort: {
            label: 'Abort',
            name: '__root.Abort',
            type: 'u128',
          },
          CancelProposal: {
            label: 'CancelProposal',
            name: '__root.CancelProposal',
            type: 'u128',
          },
          ProcessProposal: {
            label: 'ProcessProposal',
            name: '__root.ProcessProposal',
            type: 'u128',
          },
          RageQuit: {
            label: 'RageQuit',
            name: '__root.RageQuit',
            type: 'u128',
          },
          RequestForMembership: {
            label: 'RequestForMembership',
            name: '__root.RequestForMembership',
            type: 'u128',
          },
          SetAdmin: {
            label: 'SetAdmin',
            name: '__root.SetAdmin',
            type: 'ActorId',
          },
          SubmitFundingProposal: {
            __fields: {
              amount: {
                label: 'amount',
                name: '__root.SubmitFundingProposal.amount',
                type: 'u128',
              },
              applicant: {
                label: 'applicant',
                name: '__root.SubmitFundingProposal.applicant',
                type: 'ActorId',
              },
              details: {
                label: 'details',
                name: '__root.SubmitFundingProposal.details',
                type: 'Text',
              },
              quorum: {
                label: 'quorum',
                name: '__root.SubmitFundingProposal.quorum',
                type: 'u128',
              },
            },
            __name: 'SubmitFundingProposal',
            __path: '__root.SubmitFundingProposal',
            __select: false,
            __type: '__fieldset',
          },
          SubmitMembershipProposal: {
            __fields: {
              applicant: {
                label: 'applicant',
                name: '__root.SubmitMembershipProposal.applicant',
                type: 'ActorId',
              },
              details: {
                label: 'details',
                name: '__root.SubmitMembershipProposal.details',
                type: 'Text',
              },
              quorum: {
                label: 'quorum',
                name: '__root.SubmitMembershipProposal.quorum',
                type: 'u128',
              },
              sharesRequested: {
                label: 'sharesRequested',
                name: '__root.SubmitMembershipProposal.sharesRequested',
                type: 'u128',
              },
              tokenTribute: {
                label: 'tokenTribute',
                name: '__root.SubmitMembershipProposal.tokenTribute',
                type: 'u128',
              },
            },
            __name: 'SubmitMembershipProposal',
            __path: '__root.SubmitMembershipProposal',
            __select: false,
            __type: '__fieldset',
          },
          SubmitVote: {
            __fields: {
              proposalId: {
                label: 'proposalId',
                name: '__root.SubmitVote.proposalId',
                type: 'u128',
              },
              vote: {
                __fields: {
                  '0': {
                    label: '0',
                    name: '__root.SubmitVote.vote.0',
                    type: 'Yes',
                  },
                  '1': {
                    label: '1',
                    name: '__root.SubmitVote.vote.1',
                    type: 'No',
                  },
                },
                __name: 'vote',
                __path: '__root.SubmitVote.vote',
                __select: true,
                __type: '__fieldset',
              },
            },
            __name: 'SubmitVote',
            __path: '__root.SubmitVote',
            __select: false,
            __type: '__fieldset',
          },
          UpdateDelegateKey: {
            label: 'UpdateDelegateKey',
            name: '__root.UpdateDelegateKey',
            type: 'ActorId',
          },
        },
        __name: '__root',
        __path: '__root',
        __select: true,
        __type: '__fieldset',
      },
      __values: {
        Abort: '',
        CancelProposal: '',
        ProcessProposal: '',
        RageQuit: '',
        RequestForMembership: '',
        SetAdmin: '',
        SubmitFundingProposal: {
          amount: '',
          applicant: '',
          details: '',
          quorum: '',
        },
        SubmitMembershipProposal: {
          applicant: '',
          details: '',
          quorum: '',
          sharesRequested: '',
          tokenTribute: '',
        },
        SubmitVote: {
          proposalId: '',
          vote: {
            '0': '',
            '1': '',
          },
        },
        UpdateDelegateKey: '',
      },
    });
  });

  it('simple option enum', () => {
    expect(parseMeta(optionEnumSimple)).toEqual({
      __root: {
        __name: '__root',
        __path: '__root',
        __type: 'enum_option',
        __select: true,
        __fields: {
          [`__field-0`]: {
            type: 'String',
            name: '__root.__field-0',
            label: '__field-0',
          },
          __null: {
            name: '__root.__null',
            label: '__null',
            type: 'Null',
          },
        },
      },
      __values: {
        [`__field-0`]: '',
        __null: 'Null',
      },
    });
  });

  it('option enum with fields object', () => {
    expect(parseMeta(optionEnumWithFieldsObject)).toEqual({
      __root: {
        __name: '__root',
        __path: '__root',
        __type: 'enum_option',
        __select: true,
        __fields: {
          ['__field-0']: {
            __fields: {
              firstName: {
                label: 'firstName',
                name: '__root.__field-0.firstName',
                type: 'Text',
              },
              lastName: {
                label: 'lastName',
                name: '__root.__field-0.lastName',
                type: 'Text',
              },
            },
            __name: '__field-0',
            __path: '__root.__field-0',
            __select: false,
            __type: '__fieldset',
          },
          __null: {
            name: '__root.__null',
            label: '__null',
            type: 'Null',
          },
        },
      },
      __values: {
        '__field-0': {
          firstName: '',
          lastName: '',
        },
        __null: 'Null',
      },
    });
  });

  it('nested option enum', () => {
    expect(parseMeta(optionEnumNested)).toEqual({
      __root: {
        __name: '__root',
        __path: '__root',
        __type: '__fieldset',
        __select: false,
        __fields: {
          field: {
            __name: 'field',
            __path: '__root.field',
            __type: 'enum_option',
            __select: true,
            __fields: {
              [`__field-0`]: {
                type: 'String',
                name: '__root.field.__field-0',
                label: '__field-0',
              },
              __null: {
                name: '__root.field.__null',
                label: '__null',
                type: 'Null',
              },
            },
          },
        },
      },
      __values: {
        field: {
          [`__field-0`]: '',
          __null: 'Null',
        },
      },
    });
  });

  it('with complex option enum', () => {
    expect(parseMeta(optionEnumComplex)).toEqual({
      __root: {
        __name: '__root',
        __path: '__root',
        __type: '__fieldset',
        __select: false,
        __fields: {
          res: {
            __fields: {
              '__field-0': {
                __fields: {
                  id: {
                    __fields: {
                      decimal: {
                        label: 'decimal',
                        name: '__root.res.__field-0.id.decimal',
                        type: 'u64',
                      },
                      hex: {
                        label: 'hex',
                        name: '__root.res.__field-0.id.hex',
                        type: 'Bytes',
                      },
                    },
                    __name: 'id',
                    __path: '__root.res.__field-0.id',
                    __select: false,
                    __type: '__fieldset',
                  },
                  person: {
                    __fields: {
                      name: {
                        label: 'name',
                        name: '__root.res.__field-0.person.name',
                        type: 'Text',
                      },
                      surname: {
                        label: 'surname',
                        name: '__root.res.__field-0.person.surname',
                        type: 'Text',
                      },
                    },
                    __name: 'person',
                    __path: '__root.res.__field-0.person',
                    __select: false,
                    __type: '__fieldset',
                  },
                },
                __name: '__field-0',
                __path: '__root.res.__field-0',
                __select: false,
                __type: '__fieldset',
              },
              __null: {
                label: '__null',
                name: '__root.res.__null',
                type: 'Null',
              },
            },
            __name: 'res',
            __path: '__root.res',
            __select: true,
            __type: 'enum_option',
          },
        },
      },
      __values: {
        res: {
          '__field-0': {
            id: {
              decimal: '',
              hex: '',
            },
            person: {
              name: '',
              surname: '',
            },
          },
          __null: 'Null',
        },
      },
    });
  });

  it('with simple result enum', () => {
    expect(parseMeta(resultEnumSimple)).toEqual({
      __root: {
        __name: '__root',
        __path: '__root',
        __type: '__fieldset',
        __select: false,
        __fields: {
          exchangeRate: {
            __name: 'exchangeRate',
            __path: '__root.exchangeRate',
            __type: 'enum_result',
            __select: true,
            __fields: {
              ok: {
                type: 'u8',
                name: '__root.exchangeRate.ok',
                label: 'ok',
              },
              err: {
                type: 'u8',
                name: '__root.exchangeRate.err',
                label: 'err',
              },
            },
          },
        },
      },
      __values: {
        exchangeRate: {
          ok: '',
          err: '',
        },
      },
    });
  });

  it('with complex result enum', () => {
    expect(parseMeta(resultEnumComplex)).toEqual({
      __root: {
        __fields: {
          exchangeRate: {
            __fields: {
              err: {
                __fields: {
                  '__field-0': {
                    label: '__field-0',
                    name: '__root.exchangeRate.err.__field-0',
                    type: 'String',
                  },
                  __null: {
                    label: '__null',
                    name: '__root.exchangeRate.err.__null',
                    type: 'Null',
                  },
                },
                __name: 'err',
                __path: '__root.exchangeRate.err',
                __select: true,
                __type: 'enum_option',
              },
              ok: {
                __fields: {
                  firstName: {
                    label: 'firstName',
                    name: '__root.exchangeRate.ok.firstName',
                    type: 'Text',
                  },
                  secondName: {
                    label: 'secondName',
                    name: '__root.exchangeRate.ok.secondName',
                    type: 'Text',
                  },
                },
                __name: 'ok',
                __path: '__root.exchangeRate.ok',
                __select: false,
                __type: '__fieldset',
              },
            },
            __name: 'exchangeRate',
            __path: '__root.exchangeRate',
            __select: true,
            __type: 'enum_result',
          },
        },
        __name: '__root',
        __path: '__root',
        __select: false,
        __type: '__fieldset',
      },
      __values: {
        exchangeRate: {
          err: {
            '__field-0': '',
            __null: 'Null',
          },
          ok: {
            firstName: '',
            secondName: '',
          },
        },
      },
    });
  });

  it('test prepare to send', () => {
    expect(
      prepareToSend({
        __root: {
          field: {
            __null: 'Null',
            '__field-0': '',
          },
        },
      })
    ).toEqual({
      __root: {
        field: {
          __null: null,
          '__field-0': '',
        },
      },
    });
  });
});
