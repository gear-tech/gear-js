import { fireEvent, render, screen } from '@testing-library/react';
import { Textarea } from './Textarea';
import styles from './Textarea.module.scss';

describe('textarea tests', () => {
  it('renders textarea', () => {
    render(<Textarea />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
  });

  it('renders textarea with label', () => {
    const { rerender } = render(<Textarea label="test label" />);
    const textarea = screen.getByLabelText('test label');
    expect(textarea).toBeInTheDocument();

    rerender(<Textarea label="label" direction="y" />);

    const inputWrapper = screen.getByTestId('inputWrapper');
    expect(inputWrapper).not.toHaveClass(styles.x);
    expect(inputWrapper).toHaveClass(styles.y);

    rerender(<Textarea label="label" gap="7/9" />);

    expect(inputWrapper).toHaveStyle('grid-template-columns: 7fr 9fr');

    rerender(<Textarea label="label" gap="7/9" tooltip="random tooltip" />);

    const tooltipWrapper = screen.getByTestId('tooltipWrapper');
    const tooltipIcon = screen.getByTestId('tooltipIcon');

    expect(tooltipIcon).toBeInTheDocument();
    expect(screen.queryByText('random tooltip')).not.toBeInTheDocument();
    expect(tooltipWrapper).toHaveAttribute('data-tooltip', 'random tooltip');
  });

  it('applies className to wrapper', () => {
    render(<Textarea className="className" />);

    const inputWrapper = screen.getByTestId('inputWrapper');
    const textarea = screen.getByRole('textbox');

    expect(inputWrapper).toHaveClass('className');
    expect(textarea).not.toHaveClass('className');
  });

  it('renders read only textarea', () => {
    render(<Textarea readOnly />);

    const wrapper = screen.getByTestId('wrapper');
    const input = screen.getByRole('textbox');

    expect(wrapper).toHaveClass(styles.readOnly);
    expect(input).toHaveAttribute('readOnly');
  });

  it('renders disabled textarea', () => {
    render(<Textarea className="className" disabled />);

    const inputWrapper = screen.getByTestId('inputWrapper');
    const textarea = screen.getByRole('textbox');

    expect(inputWrapper).toHaveClass('disabled');
    expect(textarea).toBeDisabled();
  });

  it('passes rows attribute', () => {
    render(<Textarea rows={10} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('rows', '10');
  });

  it('enters text and clicks clear button', () => {
    render(<Textarea label="label" color="light" size="large" />);

    const inputWrapper = screen.getByTestId('inputWrapper');
    const textarea = screen.getByRole('textbox');

    expect(inputWrapper).not.toContainElement(screen.queryByRole('button'));

    fireEvent.focus(textarea);

    const clearButton = screen.getByRole('button');
    expect(inputWrapper).toContainElement(clearButton);

    fireEvent.change(textarea, { target: { value: '123' } });
    expect(textarea).toHaveValue('123');

    fireEvent.click(clearButton);
    expect(textarea).toHaveValue('');
  });

  it('renders large textarea with light color', () => {
    render(<Textarea label="label" color="light" size="large" />);

    const wrapper = screen.getByTestId('wrapper');

    expect(wrapper).toHaveClass(styles.light, styles.large);
    expect(wrapper).not.toHaveClass(styles.dark, styles.normal);
  });

  it('renders textarea with error', () => {
    render(<Textarea label="label" error="random error" />);

    const inputWrapper = screen.getByTestId('inputWrapper');
    const error = screen.getByText('random error');

    expect(inputWrapper).toContainElement(error);
  });

  it('passes ref', () => {
    const ref = { current: null };
    render(<Textarea rows={10} ref={ref} />);

    const textarea = screen.getByRole('textbox');

    expect(ref.current).toBe(textarea);
  });
});
