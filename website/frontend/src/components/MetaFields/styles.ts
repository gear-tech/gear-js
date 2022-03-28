import { styled } from 'stitches.config';

export const MetaFormItem = styled('div', {
  flex: '1',
  color: '$white',
});

export const MetaInput = styled('div', {
  '&:not(:last-child)': {
    marginBottom: '1rem',
  },

  '& label': {
    marginBottom: '.5rem',
  },
});

export const Fieldset = styled('fieldset', {
  padding: '1rem',
  color: 'white',

  '&.first-item': {
    padding: 0,
    border: 0,
  },
});

export const EnumSelect = styled('div', {
  marginBottom: '1rem',
});
