import { render, screen } from '@testing-library/react';
import { Icon } from './Icon';

const arrowIcon = 'icon-path';

describe('icon tests', () => {
  it('renders icon', () => {
    render(<Icon src={arrowIcon} />);
    const icon = screen.getByRole('img');
    expect(icon).toHaveAttribute('src', arrowIcon);
  });
});
