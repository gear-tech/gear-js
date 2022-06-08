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
    render(<Select options={initOptions} label="random text" />);
    const select = screen.getByLabelText('random text');
    expect(select).toBeInTheDocument();
  });

  it('applies className to label wrapper', () => {
    render(<Select options={initOptions} className="className" />);

    const label = screen.getByTestId('label');
    const select = screen.getByRole('combobox');

    expect(label).toHaveClass(styles.label, 'className');
    expect(select).not.toHaveClass('className');
  });

  it('renders disabled select', () => {
    render(<Select options={initOptions} disabled />);

    const label = screen.getByTestId('label');
    const select = screen.getByRole('combobox');

    expect(select).toBeDisabled();
    expect(label).toHaveClass('disabled');
  });

  it('passes ref', () => {
    const ref = { current: null };
    render(<Select options={initOptions} ref={ref} />);

    const select = screen.getByRole('combobox');

    expect(ref.current).toBe(select);
  });
});
