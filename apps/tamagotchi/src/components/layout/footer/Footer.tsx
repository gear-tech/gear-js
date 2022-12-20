import { Socials } from './socials';
import { Copyright } from './copyright';

export const Footer = () => (
  <footer className="container flex items-center gap-4 justify-between py-7.5">
    <Socials />
    <Copyright />
  </footer>
);
