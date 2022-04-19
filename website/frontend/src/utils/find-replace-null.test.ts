import { findReplaceNull } from './find-replace-null';

describe('find and replace Null to null', () => {
  it('has null in values', () => {
    expect(
      findReplaceNull({
        field: 'string',
        nil: 'Null',
        deep: {
          field: 'string',
          nil: 'Null',
        },
      })
    ).toEqual({
      field: 'string',
      nil: null,
      deep: {
        field: 'string',
        nil: null,
      },
    });
  });

  it('no null in values', () => {
    expect(
      findReplaceNull({
        field: 'string',
        deep: {
          field: 'string',
        },
      })
    ).toEqual({
      field: 'string',
      deep: {
        field: 'string',
      },
    });
  });
});
