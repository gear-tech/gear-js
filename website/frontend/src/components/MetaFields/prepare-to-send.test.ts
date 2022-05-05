import { prepareToSend } from './prepare-to-send';

describe('prepare to send metadata', () => {
  test('value extract', () => {
    expect(
      prepareToSend({
        NftAction: {
          Mint: {
            tokenMetadata: {
              name: 'value',
              description: 'value',
              media: 'value',
              reference: 'value',
            },
          },
        },
      })
    ).toEqual({
      Mint: {
        tokenMetadata: {
          name: 'value',
          description: 'value',
          media: 'value',
          reference: 'value',
        },
      },
    });
  });
});
