import { screen } from '@testing-library/react';
import { renderWithRouter } from 'utils';
import Logo from './Logo';

describe('logo tests', () => {
  it('renders logo', () => {
    renderWithRouter(<Logo />);

    const link = screen.getByRole('link');
    const svg = screen.getByTestId('svg');

    expect(link).toContainElement(svg);
    expect(link).toHaveAttribute('href', '/');
  });
});
