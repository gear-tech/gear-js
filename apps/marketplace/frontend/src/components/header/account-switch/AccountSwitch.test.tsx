import { fireEvent, screen, within } from '@testing-library/react';
import { renderWithAccountProvider, textMatcher } from 'utils/tests';
import useAccounts from './hooks';
import AccountSwitch from './AccountSwitch';

const accounts = [
  { address: '123', meta: { name: 'first acc' } },
  { address: '456', meta: { name: 'second acc' } },
  { address: '789', meta: { name: 'third acc' } },
];

jest.mock('./hooks');
const mockedUseAccounts = useAccounts as jest.MockedFunction<any>;

describe('account switch tests', () => {
  it('logins into account', () => {
    mockedUseAccounts.mockImplementation(() => accounts);
    renderWithAccountProvider(<AccountSwitch />);

    const loginButton = screen.getByRole('button');
    expect(loginButton).toHaveTextContent('Sign in');

    fireEvent.click(loginButton);

    const buttonsList = screen.getByRole('list');
    const buttons = within(buttonsList).getAllByRole('button');
    const secondButton = screen.getByText('second acc');

    expect(buttons).toHaveLength(3);

    fireEvent.click(secondButton);
    expect(buttonsList).not.toBeInTheDocument();

    const accountButton = screen.getByRole('button');
    expect(accountButton).toHaveTextContent('second acc');
  });

  it('switches account', () => {
    localStorage.setItem('account', '789');
    mockedUseAccounts.mockImplementation(() => accounts);
    renderWithAccountProvider(<AccountSwitch />);

    const loginButton = screen.getByRole('button');
    expect(loginButton).toHaveTextContent('third acc');

    fireEvent.click(loginButton);

    const buttonsList = screen.getByRole('list');
    const buttons = within(buttonsList).getAllByRole('button');
    const firstButton = screen.getByText('first acc');

    expect(buttons).toHaveLength(3);

    fireEvent.click(firstButton);
    expect(buttonsList).not.toBeInTheDocument();

    const accountButton = screen.getByRole('button');
    expect(accountButton).toHaveTextContent('first acc');
  });

  it('tries to login without extension', () => {
    renderWithAccountProvider(<AccountSwitch />);

    const loginButton = screen.getByRole('button');
    expect(loginButton).toHaveTextContent('Sign in');

    fireEvent.click(loginButton);

    const modal = screen.getByTestId('modal');
    const noExtensionMessage = screen.getByText(
      textMatcher('Polkadot extension was not found or disabled. Please, install it.'),
    );

    expect(modal).toContainElement(noExtensionMessage);
  });

  it('tries to login without accounts', () => {
    mockedUseAccounts.mockImplementation(() => []);
    renderWithAccountProvider(<AccountSwitch />);

    const loginButton = screen.getByRole('button');
    expect(loginButton).toHaveTextContent('Sign in');

    fireEvent.click(loginButton);

    const modal = screen.getByTestId('modal');
    const noAccountsMessage = screen.getByText(
      'No accounts found. Please open Polkadot extension, create a new account or import existing one and reload the page.',
    );

    expect(modal).toContainElement(noAccountsMessage);
  });
});
