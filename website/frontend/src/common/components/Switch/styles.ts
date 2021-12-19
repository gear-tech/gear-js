import { styled } from 'stitches.config';

export const Label = styled('label', {
  display: 'inline-flex',
  color: '$white',
});

export const Switch = styled('span', {
  position: 'relative',
  width: '2.25rem',
  height: '1.25rem',
  marginRight: '.25rem',

  '& input': {
    opacity: 0,
    width: 0,
    height: 0,
  },

  '& .slider': {
    position: 'absolute',
    cursor: 'pointer',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: '#ccc',
    transition: '.4s',
    borderRadius: '1rem',
  },

  '& .slider:before': {
    position: 'absolute',
    content: '',
    height: '1rem',
    width: '1rem',
    left: '2px',
    bottom: '2px',
    backgroundColor: '$white',
    transition: '.4s',
    borderRadius: '50%',
  },

  '& input:checked + .slider': {
    backgroundColor: '$active',

    '&:before': {
      transform: 'translateX(100%)',
    },
  },
});
