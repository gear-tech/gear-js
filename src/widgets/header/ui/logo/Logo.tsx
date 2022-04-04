import { Link } from 'react-router-dom';
import { ReactComponent as SVG } from './assets/logo.svg';

function Logo() {
  return (
    <Link to="/" className="lightIcon">
      <SVG data-testid="svg" />
    </Link>
  );
}

export default Logo;
