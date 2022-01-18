import React from 'react';
import { LogoIcon } from 'assets/Icons';
import { Link } from 'react-router-dom';
import { routes } from 'routes';

const Logo = () => (
  <Link to={routes.main} className="img-wrapper">
    <LogoIcon color="#fff" />
  </Link>
);

export default Logo;
