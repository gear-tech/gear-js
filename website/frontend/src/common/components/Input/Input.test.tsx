import { render, screen } from '@testing-library/react';
import { Input } from './Input';

describe('input tests', () => {
  it('renders input', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('renders input with label', () => {
    render(<Input label="label" />);
    const input = screen.getByLabelText('label');
    expect(input).toBeInTheDocument();
  });

  it('applies className to label (top wrapper) element', () => {
    render(<Input label="label" className="class" />);
    const label = screen.getByText('label');
    expect(label).toHaveClass('class');
  });
});
