import React from 'react';
import {useLocation} from 'react-router-dom';
import clsx from 'clsx';

import { routes } from 'routes';

import './Footer.scss';

const Footer = () => {
  const location = useLocation();
  const lightColored = location.pathname !== routes.main || location.pathname !== routes.uploadedPrograms;;
  return (
    <footer className={clsx('footer', lightColored && 'footer--light-colored')}>
      <span className="footer__content">2021. All rights reserved.</span>
    </footer>
  );
};

export default Footer;