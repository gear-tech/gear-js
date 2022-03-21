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
});
