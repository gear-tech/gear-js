import { render, screen } from '@testing-library/react';
import { Textarea } from './Textarea';

describe('textarea tests', () => {
  it('renders textarea', () => {
    render(<Textarea />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
  });

  it('renders textarea with label', () => {
    render(<Textarea label="test label" />);
    const textarea = screen.getByLabelText('test label');
    expect(textarea).toBeInTheDocument();
  });

  it('applies className to label wrapper', () => {
    render(<Textarea className="className" />);

    const label = screen.getByTestId('label');
    const textarea = screen.getByRole('textbox');

    expect(label).toHaveClass('className');
    expect(textarea).not.toHaveClass('className');
  });

  it('renders disabled textarea', () => {
    render(<Textarea className="className" disabled />);

    const label = screen.getByTestId('label');
    const textarea = screen.getByRole('textbox');

    expect(label).toHaveClass('disabled');
    expect(textarea).toBeDisabled();
  });

  it('passes rows attribute', () => {
    render(<Textarea rows={10} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('rows', '10');
  });

  it('passes ref', () => {
    const ref = { current: null };
    render(<Textarea rows={10} ref={ref} />);

    const textarea = screen.getByRole('textbox');

    expect(ref.current).toBe(textarea);
  });
});
