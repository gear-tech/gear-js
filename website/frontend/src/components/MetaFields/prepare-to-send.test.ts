import { prepareToSend } from './prepare-to-send';

describe('prepare to send metadata', () => {
  test('field with null', () => {
    expect(
      prepareToSend({
        __root: {
          field: {
            __null: 'Null',
          },
        },
      })
    ).toEqual({
      __root: {
        field: {
          __null: null,
        },
      },
    });
  });
});
