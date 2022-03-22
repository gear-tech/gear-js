import { render, screen } from '@testing-library/react';
import { Text } from './Text';

describe('label text tests', () => {
  it('renders text', () => {
    render(<Text txt="random text" />);
    const text = screen.getByText('random text');
    expect(text).toBeInTheDocument();
  });
});
