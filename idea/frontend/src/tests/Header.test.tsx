import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { GearKeyring } from '@gear-js/api';
import { BrowserRouter } from 'react-router-dom';

import { renderWithProviders, textMatcher } from './utils';
import { useApiMock, useAccountMock, useAccountsMock, TEST_API, TEST_ACCOUNT_1 } from './mocks/hooks';

import * as helpers from 'helpers';
import { Header } from 'components/blocks/Header';
import menuStyles from 'components/blocks/Header/children/Menu/Menu.module.scss';

const accounts = [
  {
    address: '123',
    meta: { name: 'first acc' },
    balance: {
      value: '1000',
      unit: 'MUnit',
    },
  },
  {
    address: '456',
    meta: { name: 'second acc' },
    balance: {
      value: '2000',
      unit: 'MUnit',
    },
  },
  {
    address: '789',
    meta: { name: 'third acc' },
    balance: {
      value: '3000',
      unit: 'MUnit',
    },
  },
];

jest.mock('context/api/const', () => ({
  NODE_API_ADDRESS: 'testnet-address',
}));

const HeaderComponent = () => (
  <BrowserRouter>
    <Header />
  </BrowserRouter>
);

// this shit fixed the react-testing-lib error
const fixReactError = async () => {
  fireEvent.click(screen.getAllByRole('button')[0]);
  await waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(9));
};

describe('header tests', () => {
  it('renders logo and menu', async () => {
    useApiMock();
    useAccountsMock();

    renderWithProviders(<HeaderComponent />);

    const [logo, ...menuLinks] = screen.getAllByRole('link');

    // logo

    const logoSvg = screen.getByTestId('svg');

    expect(logo).toContainElement(logoSvg);
    expect(logo).toHaveAttribute('href', '/');

    // menu

    const menu = screen.getByRole('list');
    const [, ...menuItems] = within(menu).getAllByRole('listitem'); // drop desctructuring when sidebar button won't be in menu
    const [explorer, ide, mailbox] = menuLinks;

    expect(menuItems).toHaveLength(3);

    menuItems.forEach((item, index) => {
      const link = menuLinks[index];

      expect(item).toContainElement(link);
      expect(link).not.toHaveClass(menuStyles.active);
    });

    expect(explorer).toHaveTextContent('Explorer');
    expect(explorer).toHaveAttribute('href', '/explorer');

    expect(ide).toHaveTextContent('</> IDE');
    expect(ide).toHaveAttribute('href', '/editor');

    expect(mailbox).toHaveTextContent('Mailbox');
    expect(mailbox).toHaveAttribute('href', '/mailbox');

    fireEvent.click(mailbox);
    menuLinks.forEach((link) =>
      link === mailbox ? expect(link).toHaveClass(menuStyles.active) : expect(link).not.toHaveClass(menuStyles.active)
    );

    fireEvent.click(explorer);
    menuLinks.forEach((link) =>
      link === explorer ? expect(link).toHaveClass(menuStyles.active) : expect(link).not.toHaveClass(menuStyles.active)
    );

    // temp test fix
    await fixReactError();
  });

  it('renders test balance button, get test balance', async () => {
    TEST_API.nodeVersion.mockResolvedValue('');
    TEST_API.balance.signAndSend.mockResolvedValue('');

    useApiMock(TEST_API);
    useAccountMock();

    const { rerender } = renderWithProviders(<HeaderComponent />);

    // unauthorized
    expect(screen.queryByTestId('testBalanceBtn')).not.toBeInTheDocument();

    useAccountMock(TEST_ACCOUNT_1);
    jest.spyOn(helpers, 'isDevChain').mockReturnValue(true);

    rerender(<HeaderComponent />);

    const testBalanceBtn = await screen.findByTestId('testBalanceBtn');

    expect(testBalanceBtn).toBeInTheDocument();
    expect(testBalanceBtn).toBeEnabled();

    // show, hide tooltip

    fireEvent.mouseOver(testBalanceBtn);

    const tooltip = screen.getByText('Get test balance');

    expect(tooltip).toBeInTheDocument();

    fireEvent.mouseLeave(testBalanceBtn);

    await waitFor(() => expect(tooltip).not.toBeInTheDocument());

    // temp test fix
    await fixReactError();

    // transfer balance in development chain

    jest.spyOn(GearKeyring, 'fromSuri').mockResolvedValue('alice-address' as any);

    fireEvent.click(testBalanceBtn);

    await waitFor(() => {
      expect(TEST_API.balance.transfer).toBeCalledTimes(1);
      expect(TEST_API.balance.signAndSend).toBeCalledTimes(1);
    });
  });

  it('renders sidebar button, opens/closes sidebar, adds/copies/removes/switches node', async () => {
    useApiMock();
    useAccountsMock();

    const { rerender } = renderWithProviders(<HeaderComponent />);

    // sidebar button

    const queriedSidebar = screen.queryByTestId('sidebar');
    const [sidebarButton] = screen.getAllByRole('button');

    expect(queriedSidebar).not.toBeInTheDocument();
    expect(sidebarButton).toHaveTextContent('Loading...');

    TEST_API.runtimeChain.toHuman.mockReturnValue('Test chain');
    TEST_API.runtimeVersion.specName.toHuman.mockReturnValue('test-name');
    TEST_API.runtimeVersion.specVersion.toHuman.mockReturnValue('12345');
    TEST_API.nodeVersion.mockResolvedValue('1-1777cdb0cfa');

    useApiMock(TEST_API);

    rerender(<HeaderComponent />);

    expect(screen.getByText('Test chain'));
    expect(sidebarButton).toHaveTextContent('test-name/12345');

    const nodeVersionlink = await screen.findByText('1777cdb0cfa');

    expect(nodeVersionlink).toBeInTheDocument();
    expect(nodeVersionlink).toHaveAttribute('href', 'https://github.com/gear-tech/gear/commit/1777cdb0cfa');

    fireEvent.click(sidebarButton);

    const sidebar = screen.getByTestId('sidebar');

    expect(sidebar).toBeInTheDocument();

    // sidebar

    const nodeSectionsList = within(sidebar).getByRole('list');

    const [testnetSection, , , devSection] = await within(nodeSectionsList).findAllByRole('listitem');

    const testnetHeading = screen.getByText('testnet heading');
    const testnetList = within(testnetSection).getByRole('list');
    const testnetItems = within(testnetList).getAllByRole('listitem');
    const testnetNodes = within(testnetList).getAllByRole('radio');

    const devHeading = screen.getByText('development');
    const devList = within(devSection).getByRole('list');
    const devItems = within(devList).getAllByRole('listitem');
    const devNodes = within(devList).getAllByRole('radio');

    expect(testnetSection).toContainElement(testnetHeading);
    expect(testnetItems).toHaveLength(2);
    testnetItems.forEach((item, index) => expect(item).toContainElement(testnetNodes[index]));

    expect(devSection).toContainElement(devHeading);
    expect(devItems).toHaveLength(1);
    devItems.forEach((item, index) => expect(item).toContainElement(devNodes[index]));

    // selects clicked node

    const randomTestnetLabel = screen.getByText('random-testnet-address');
    const [testnetNode, randomTestnetNode] = testnetNodes;

    const devLabel = screen.getByText('dev-address');
    const [devNode] = devNodes;

    const nodes = [...testnetNodes, ...devNodes];

    nodes.forEach((node) => (node === testnetNode ? expect(node).toBeChecked() : expect(node).not.toBeChecked()));

    fireEvent.click(devLabel);
    nodes.forEach((node) => (node === devNode ? expect(node).toBeChecked() : expect(node).not.toBeChecked()));

    fireEvent.click(randomTestnetLabel);
    nodes.forEach((node) => (node === randomTestnetNode ? expect(node).toBeChecked() : expect(node).not.toBeChecked()));

    // copies node address

    Object.assign(navigator, { clipboard: { writeText: jest.fn() } });
    jest.spyOn(navigator.clipboard, 'writeText');

    const copyButtons = screen.getAllByLabelText('Copy node address');
    const [, randomTestnetCopyButton, devCopyButton] = copyButtons;

    expect(copyButtons).toHaveLength(3);

    fireEvent.click(randomTestnetCopyButton);
    expect(navigator.clipboard.writeText).toBeCalledWith('random-testnet-address');

    fireEvent.click(devCopyButton);
    expect(navigator.clipboard.writeText).toBeCalledWith('dev-address');

    // validates custom address input

    const addButton = screen.getByText('Add');
    const input = screen.getByRole('textbox');

    expect(input).toHaveValue('testnet-address');
    expect(addButton).toBeDisabled();

    fireEvent.change(input, { target: { value: 'wss://' } });
    expect(input).toHaveValue('wss://');
    expect(addButton).toBeDisabled();

    fireEvent.change(input, { target: { value: 'wss://test' } });
    expect(addButton).toBeEnabled();

    fireEvent.change(input, { target: { value: 'test://wss' } });
    expect(addButton).toBeDisabled();

    fireEvent.change(input, { target: { value: 'ws://custom-address' } });
    expect(addButton).not.toBeDisabled();

    // adds custom node

    fireEvent.click(addButton);
    expect(input).toHaveValue('');

    const customNodeLabel = screen.getByText('ws://custom-address');
    const customNode = screen.getByLabelText('ws://custom-address');

    expect(devList).toContainElement(customNodeLabel);
    nodes.forEach((node) => (node === randomTestnetNode ? expect(node).toBeChecked() : expect(node).not.toBeChecked()));

    fireEvent.click(customNodeLabel);
    nodes.forEach((node) => (node === customNode ? expect(node).toBeChecked() : expect(node).not.toBeChecked()));

    // removes node address

    const removeButtons = screen.getAllByLabelText('Remove node address');
    const [customNodeRemoveButton] = removeButtons;

    expect(removeButtons).toHaveLength(1);

    fireEvent.click(customNodeRemoveButton);

    expect(customNodeLabel).not.toBeInTheDocument();
    nodes.forEach((node) => (node === testnetNode ? expect(node).toBeChecked() : expect(node).not.toBeChecked()));

    // closes sidebar on close button and outside click

    const closeButton = screen.getByLabelText('Close sidebar');
    fireEvent.click(closeButton);

    expect(sidebar).not.toBeInTheDocument();

    fireEvent.click(sidebarButton);

    const newSidebar = screen.getByTestId('sidebar');
    expect(newSidebar).toBeInTheDocument();

    fireEvent.click(document);

    expect(newSidebar).not.toBeInTheDocument();

    fireEvent.click(sidebarButton);

    // switches node

    const switchButton = screen.getByText('Switch');
    expect(switchButton).toBeDisabled();

    const newRandomTestnetLabel = screen.getByText('random-testnet-address');
    fireEvent.click(newRandomTestnetLabel);

    expect(switchButton).toBeEnabled();

    // TODO: hacky mock?
    const location: Location = window.location;
    // @ts-ignore
    delete window.location;

    window.location = {
      ...location,
      reload: jest.fn(),
    };

    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => jest.fn());

    fireEvent.click(switchButton);

    expect(window.location.reload).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toBeCalledWith('node_address', 'random-testnet-address');
  });
});

describe('account switch tests', () => {
  const getModal = () => screen.getByTestId('modal');
  const getModalQuery = () => screen.queryByTestId('modal');

  const getButtonsList = () => within(getModal()).getByRole('list');
  const getButtons = () => within(getButtonsList()).getAllByRole('button');
  const getButton = (index: number) => getButtons()[index];

  const getLoginButton = () => screen.getByText('Connect');
  const getLoginButtonQuery = () => screen.queryByText('Connect');

  it('logins/logouts, switches account and closes modal', async () => {
    TEST_API.nodeVersion.mockResolvedValue('1-1777cdb0cfa');

    useApiMock(TEST_API);
    useAccountMock();
    useAccountsMock(accounts);

    // mocking raw public key get since it gets saved in localstorage on account switch
    jest.spyOn(GearKeyring, 'decodeAddress').mockImplementation(() => '0x00');

    const { rerender } = renderWithProviders(<HeaderComponent />);

    // TODO: delete this temp solution
    await fixReactError();

    // logins

    fireEvent.click(getLoginButton());

    const buttons = getButtons();
    const secondButton = getButton(1);

    expect(buttons).toHaveLength(3);
    buttons.forEach((button) => expect(button).not.toHaveClass('active'));
    expect(secondButton).toHaveTextContent('second acc');
    expect(secondButton).toHaveTextContent('456');

    useAccountMock(accounts[1]);

    fireEvent.click(secondButton);

    rerender(<HeaderComponent />);

    const balance = screen.getByText('Balance:');
    const accountButton = screen.getByText('second acc');

    await waitFor(() => expect(balance).toHaveTextContent('Balance: 2000 MUnit'));

    expect(getModalQuery()).not.toBeInTheDocument();
    expect(getLoginButtonQuery()).not.toBeInTheDocument();

    // switches

    fireEvent.click(accountButton);

    getButtons().forEach((button) =>
      button === getButton(1) ? expect(button).toHaveClass('active') : expect(button).not.toHaveClass('active')
    );

    useAccountMock(accounts[2]);

    fireEvent.click(getButton(2));

    rerender(<HeaderComponent />);

    await waitFor(() => expect(balance).toHaveTextContent('Balance: 3000 MUnit'));

    expect(getModalQuery()).not.toBeInTheDocument();
    expect(accountButton).toHaveTextContent('third acc');

    fireEvent.click(accountButton);

    getButtons().forEach((button) =>
      button === getButton(2) ? expect(button).toHaveClass('active') : expect(button).not.toHaveClass('active')
    );

    // logouts

    const logoutButton = screen.getByLabelText('Logout');

    useAccountMock();

    fireEvent.click(logoutButton);

    rerender(<HeaderComponent />);

    expect(getModalQuery()).not.toBeInTheDocument();
    expect(balance).not.toBeInTheDocument();
    expect(accountButton).not.toBeInTheDocument();

    fireEvent.click(getLoginButton());

    getButtons().forEach((button) => expect(button).not.toHaveClass('active'));

    // closes modal

    const closeModalButton = within(getModalQuery()!).getAllByRole('button')[0];

    fireEvent.click(closeModalButton);
    expect(getModalQuery()).not.toBeInTheDocument();
  });

  it('logins without extension', async () => {
    useApiMock();

    renderWithProviders(<HeaderComponent />);

    fireEvent.click(getLoginButton());

    const noExtensionMessage = screen.getByText(
      textMatcher('Polkadot extension was not found or disabled. Please install it')
    );

    expect(getModal()).toContainElement(noExtensionMessage);
    // TODO: delete this temp solution
    await fixReactError();
  });

  it('logins without accounts', async () => {
    useApiMock();
    useAccountsMock([]);

    renderWithProviders(<HeaderComponent />);

    fireEvent.click(getLoginButton());

    const noAccountsMessage = screen.getByText(
      'No accounts found. Please open your Polkadot extension and create a new account or import existing. Then reload this page.'
    );

    expect(getModal()).toContainElement(noAccountsMessage);

    // TODO: delete this temp solution
    await fixReactError();
  });
});
