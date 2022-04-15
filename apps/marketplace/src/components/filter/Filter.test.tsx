import { fireEvent, render, screen } from '@testing-library/react';
import Filter from './Filter';
import styles from './Filter.module.scss';

const initFilters = ['first', 'second', 'third', 'fourth'];
const handleChange = jest.fn();

describe('filter tests', () => {
  it('renders filters and tries to switch it', () => {
    render(<Filter list={initFilters} value="second" onChange={handleChange} />);

    const group = screen.getByRole('group');
    const filters = screen.getAllByRole('button');
    const [firstFilter, secondFilter, thirdFilter, fourthFilter] = filters;

    expect(filters).toHaveLength(4);
    filters.forEach((filter) => {
      expect(group).toContainElement(filter);

      if (filter === secondFilter) {
        expect(filter).toHaveClass(styles.active);
      } else {
        expect(filter).not.toHaveClass(styles.active);
      }
    });

    expect(firstFilter).toHaveTextContent('first');
    expect(secondFilter).toHaveTextContent('second');
    expect(thirdFilter).toHaveTextContent('third');
    expect(fourthFilter).toHaveTextContent('fourth');

    fireEvent.click(fourthFilter);
    expect(handleChange).toBeCalledWith('fourth');
  });
});
