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

  it('applies className', () => {
    render(<Select options={initOptions} className="className" />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass(styles.select, 'className');
  });
});
