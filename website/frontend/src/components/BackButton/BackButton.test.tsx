import { fireEvent, screen } from '@testing-library/react';
import { renderWithRouter } from 'tests/utils';
import arrow from 'assets/images/arrow_back.svg';
import { BackButton } from './BackButton';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('back button tests', () => {
  it('renders button', () => {
    renderWithRouter(<BackButton />);

    const button = screen.getByRole('button');
    const icon = screen.getByRole('img');

    expect(button).toContainElement(icon);
    expect(icon).toHaveAttribute('src', arrow);
  });

  it('navigates to previous route', () => {
    renderWithRouter(<BackButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockNavigate).toBeCalledWith(-1);
  });
});
