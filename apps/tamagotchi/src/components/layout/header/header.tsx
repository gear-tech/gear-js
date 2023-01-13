import { Logo } from './logo';
import { AccountComponent } from './account';

export const Header = () => (
  <header className="container flex justify-between items-center py-7.5">
    <Logo />
    <AccountComponent />
  </header>
);
