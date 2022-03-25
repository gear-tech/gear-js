import { render, screen } from '@testing-library/react';
import close from 'assets/images/close.svg';
import { Icon } from './Icon';

describe('icon tests', () => {
  it('renders icon', () => {
    render(<Icon src={close} />);
    const icon = screen.getByRole('img');
    expect(icon).toHaveAttribute('src', close);
  });
});
