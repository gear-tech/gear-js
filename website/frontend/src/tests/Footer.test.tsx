import { render, screen, within } from '@testing-library/react';
import { Footer } from 'components/blocks/Footer';

jest.mock('api/initApi', () => ({
  nodeApi: { address: 'random-address' },
}));

describe('footer tests', () => {
  it('renders dot explorer link, copyright and socials', () => {
    render(<Footer />);

    const [dotLink, ...socialLinks] = screen.getAllByRole('link');

    // polkadot explorer link

    expect(dotLink).toHaveTextContent('Polkadot Explorer');
    expect(dotLink).toHaveAttribute('href', `https://polkadot.js.org/apps/?rpc=random-address#/explorer`);

    // copyright

    const copyright = screen.getByText(`${new Date().getFullYear()}. All rights reserved.`);
    expect(copyright).toBeInTheDocument();

    // socials

    const socials = screen.getByRole('list');
    const socialItems = within(socials).getAllByRole('listitem');
    const [twitter, gh, discord, medium] = socialLinks;

    expect(socialItems).toHaveLength(4);
    socialItems.forEach((item, index) => expect(item).toContainElement(socialLinks[index]));

    expect(twitter).toHaveAttribute('href', 'https://twitter.com/gear_techs');
    expect(gh).toHaveAttribute('href', 'https://github.com/gear-tech');
    expect(discord).toHaveAttribute('href', 'https://discord.com/invite/7BQznC9uD9');
    expect(medium).toHaveAttribute('href', 'https://medium.com/@gear_techs');
  });
});
