import { screen } from '@testing-library/react';
import renderWithRouter from 'shared/lib';
import Logo from '.';

describe('logo tests', () => {
  let link: HTMLElement;

  beforeAll(() => {
    renderWithRouter(<Logo />);
    link = screen.getByRole('link');
  });

  it('renders logo', () => {
    const svg = screen.getByTestId('svg');
    expect(link).toContainElement(svg);
  });

  it('navigates to homepage', () => {
    expect(link).toHaveAttribute('href', '/');
  });
});
