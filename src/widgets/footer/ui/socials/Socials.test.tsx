import { render, screen } from '@testing-library/react';
import Socials from '.';

describe('social links tests', () => {
  let links: HTMLElement[];
  let icons: HTMLElement[];

  beforeAll(() => {
    render(<Socials />);

    links = screen.getAllByRole('link');
    icons = screen.getAllByTestId('svg');
  });

  it('renders links', () => {
    expect(links).toHaveLength(4);
    links.forEach((link, index) => expect(link).toContainElement(icons[index]));
  });

  it('navigates to socials', () => {
    const [tLink, ghLink, dLink, mLink] = links;

    expect(tLink).toHaveAttribute('href', 'https://twitter.com/gear_techs');
    expect(ghLink).toHaveAttribute('href', 'https://github.com/gear-tech');
    expect(dLink).toHaveAttribute(
      'href',
      'https://discord.com/invite/7BQznC9uD9'
    );
    expect(mLink).toHaveAttribute('href', 'https://medium.com/@gear_techs');
  });
});
