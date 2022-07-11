import { Link } from 'react-router-dom';
import { ReactComponent as SVG } from 'assets/images/logo.svg';

function Logo() {
  return (
    <Link to="/">
      <SVG />
    </Link>
  );
}

export { Logo };
