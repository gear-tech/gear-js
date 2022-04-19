import { fireEvent, screen, within } from '@testing-library/react';
import { renderWithProviders } from 'utils/tests';
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
});
