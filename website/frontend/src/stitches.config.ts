import { createStitches } from '@stitches/react';

export const { styled, css, globalCss, keyframes, getCssText, theme, createTheme, config } = createStitches({
  theme: {
    colors: {
      // generic colors
      white: '#fff',
      black: '#000000',
      // by purpose
      active: '#2bd071',
    },
  },
  media: {
    // xs: '(min-width: 480px)',
  },
  utils: {
    marginX: (value: string) => ({ marginLeft: value, marginRight: value }),
  },
});
