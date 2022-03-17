import { render, screen } from '@testing-library/react';
import { Select } from './Select';

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
});
