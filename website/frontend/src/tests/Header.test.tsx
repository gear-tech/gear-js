import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { nodeApi } from 'api/initApi';
import { renderWithProviders } from 'utils/tests';
import * as hooks from 'hooks';
import { Header } from 'components/blocks/Header';
import menuStyles from 'components/blocks/Header/children/Menu/Menu.module.scss';

describe('header tests', () => {
  it('renders logo and menu', () => {
    renderWithProviders(<Header />);

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
  });

  it('renders sidebar button, opens/closes sidebar, adds/copies/removes/switches node', async () => {
    renderWithProviders(<Header />);

    // sidebar button

    const queriedSidebar = screen.queryByTestId('sidebar');
    const [sidebarButton] = screen.getAllByRole('button');

    expect(queriedSidebar).not.toBeInTheDocument();
    expect(sidebarButton).toHaveTextContent('Loading...');

    // TODO: is there a better way to mock?
    // @ts-ignore
    jest.spyOn(hooks, 'useApi').mockImplementation(() => {
      localStorage.setItem('chain', 'testnet');
      return { isApiReady: true };
    });
    jest.spyOn(nodeApi, 'address', 'get').mockImplementation(() => 'testnet-address');

    await waitFor(() => expect(sidebarButton).toHaveTextContent('testnet'));

    fireEvent.click(sidebarButton);

    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toBeInTheDocument();

    // sidebar

    const [nodeSectionsList] = within(sidebar).getAllByRole('list');
    const [testnetSection, , , devSection] = within(nodeSectionsList).getAllByRole('listitem');

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

    expect(input).toHaveValue('');
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

    jest.spyOn(localStorage, 'setItem');
    window.localStorage.__proto__.setItem = jest.fn();

    fireEvent.click(switchButton);

    expect(window.location.reload).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toBeCalledWith('node_address', 'random-testnet-address');
  });
});
