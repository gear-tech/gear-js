import { render, screen } from '@testing-library/react';
import Socials from './Socials';

describe('social links tests', () => {
  it('renders links', () => {
    render(<Socials />);

    const list = screen.getByRole('list');
    const listItems = screen.getAllByRole('listitem');
    const links = screen.getAllByRole('link');
    const icons = screen.getAllByTestId('svg');
    const [tLink, ghLink, dLink, mLink] = links;

    expect(listItems).toHaveLength(4);

    listItems.forEach((item, index) => {
      expect(list).toContainElement(item);
      expect(item).toContainElement(links[index]);
      expect(links[index]).toContainElement(icons[index]);
    });

    expect(tLink).toHaveAttribute('href', 'https://twitter.com/gear_techs');
    expect(ghLink).toHaveAttribute('href', 'https://github.com/gear-tech');
    expect(dLink).toHaveAttribute('href', 'https://discord.com/invite/7BQznC9uD9');
    expect(mLink).toHaveAttribute('href', 'https://medium.com/@gear_techs');
  });
});
