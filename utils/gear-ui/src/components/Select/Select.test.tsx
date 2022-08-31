import { render, screen } from '@testing-library/react';
import { Select } from './Select';
import styles from './Select.module.scss';

const initOptions = [
  { value: '0', label: 'first option' },
  { value: '1', label: 'second option' },
  { value: '2', label: 'third option' },
  { value: '3', label: 'fourth option' },
  { value: '4', label: 'fifth option' },
];

describe('select tests', () => {
  it('renders select', () => {
    render(<Select options={initOptions} />);

    const select = screen.getByRole('combobox');
    const options = screen.getAllByRole('option');

    options.forEach((option) => expect(select).toContainElement(option));
  });

  it('renders select with label', () => {
    const { rerender } = render(<Select options={initOptions} label="random text" />);
    const select = screen.getByLabelText('random text');
    expect(select).toBeInTheDocument();

    rerender(<Select options={initOptions} label="label" direction="y" />);

    const inputWrapper = screen.getByTestId('inputWrapper');
    expect(inputWrapper).not.toHaveClass(styles.x);
    expect(inputWrapper).toHaveClass(styles.y);

    rerender(<Select options={initOptions} label="label" gap="7/9" />);

    expect(inputWrapper).toHaveStyle('grid-template-columns: 7fr 9fr');

    rerender(<Select options={initOptions} label="label" gap="7/9" tooltip="random tooltip" />);

    const tooltipWrapper = screen.getByTestId('tooltipWrapper');
    const tooltipIcon = screen.getByTestId('tooltipIcon');

    expect(tooltipIcon).toBeInTheDocument();
    expect(screen.queryByText('random tooltip')).not.toBeInTheDocument();
    expect(tooltipWrapper).toHaveAttribute('data-tooltip', 'random tooltip');
  });

  it('applies className to wrapper', () => {
    render(<Select options={initOptions} className="className" />);

    const inputWrapper = screen.getByTestId('inputWrapper');
    const select = screen.getByRole('combobox');

    expect(inputWrapper).toHaveClass('className');
    expect(select).not.toHaveClass('className');
  });

  it('renders disabled select', () => {
    render(<Select options={initOptions} disabled />);

    const inputWrapper = screen.getByTestId('inputWrapper');
    const select = screen.getByRole('combobox');

    expect(select).toBeDisabled();
    expect(inputWrapper).toHaveClass('disabled');
  });

  it('renders large textarea with light color', () => {
    render(<Select options={initOptions} label="label" color="light" size="large" />);

    const select = screen.getByRole('combobox');

    expect(select).toHaveClass(styles.light, styles.large);
    expect(select).not.toHaveClass(styles.dark, styles.normal);
  });

  it('renders textarea with error', () => {
    render(<Select options={initOptions} label="label" error="random error" />);

    const inputWrapper = screen.getByTestId('inputWrapper');
    const error = screen.getByText('random error');

    expect(inputWrapper).toContainElement(error);
  });

  it('passes ref', () => {
    const ref = { current: null };
    render(<Select options={initOptions} ref={ref} />);

    const select = screen.getByRole('combobox');

    expect(ref.current).toBe(select);
  });
});
