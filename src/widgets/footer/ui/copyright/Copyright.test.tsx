import { render, screen } from '@testing-library/react';
import Copyright from '.';

describe('copyright tests', () => {
  it('renders copyright', () => {
    render(<Copyright />);

    const copyright = screen.getByText(
      `${new Date().getFullYear()}. All rights reserved.`
    );

    expect(copyright).toBeInTheDocument();
  });
});
