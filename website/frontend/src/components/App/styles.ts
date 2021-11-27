import { globalCss } from '../../stitches.config';

export const globalStyles = globalCss({
  select: {
    display: 'block',
    width: '100%',
    padding: '0.375rem 2.25rem 0.375rem 0.75rem',
    fontSize: '1rem',
    color: '$white',
    backgroundColor: '$black',
    backgroundImage: 'assets/images/select-bg.svg',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.75rem center',
    backgroundSize: '16px 12px',
    border: 'none',
    borderRadius: '0',
    transition: 'border-color .15s ease-in-out,box-shadow .15s ease-in-out',
    appearance: 'none',
  },
});
