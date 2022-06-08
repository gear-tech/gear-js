import { render, screen } from '@testing-library/react';
import { Input } from './Input';
import styles from './Input.module.scss';

const arrowIcon = 'icon-path';

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

  it('renders input with icon', () => {
    render(<Input label="label" icon={arrowIcon} />);

    const label = screen.getByTestId('label');
    const icon = screen.getByRole('img');

    expect(label).toContainElement(icon);
    expect(icon).toHaveAttribute('src', arrowIcon);
  });

  it('applies className to label wrapper', () => {
    render(<Input label="label" className="class" />);

    const input = screen.getByRole('textbox');
    const label = screen.getByTestId('label');

    expect(input).not.toHaveClass('class');
    expect(label).toHaveClass('class');
  });

  it('renders read only input', () => {
    render(<Input readOnly />);

    const wrapper = screen.getByTestId('wrapper');
    const input = screen.getByRole('textbox');

    expect(wrapper).toHaveClass(styles.readOnly);
    expect(input).toHaveAttribute('readOnly');
  });

  it('renders disabled input', () => {
    render(<Input disabled />);

    const input = screen.getByRole('textbox');
    const label = screen.getByTestId('label');

    expect(input).toBeDisabled();
    expect(label).toHaveClass('disabled');
  });

  it('passes ref', () => {
    const ref = { current: null };
    render(<Input label="label" ref={ref} />);

    const input = screen.getByLabelText('label');

    expect(ref.current).toBe(input);
  });
});
