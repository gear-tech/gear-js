import { fireEvent, screen } from '@testing-library/react';
import { renderWithRouter } from 'utils/tests';
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
    expect(button).toBeInTheDocument();
  });

  it('navigates to previous route', () => {
    renderWithRouter(<BackButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockNavigate).toBeCalledWith(-1);
  });
});
