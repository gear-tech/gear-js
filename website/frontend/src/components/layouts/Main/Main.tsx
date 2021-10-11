import React, { FC } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { routes } from 'routes';
import './Main.scss';

export const Main: FC = ({ children }) => {
  const location = useLocation();
  const lightColored = location.pathname !== routes.main && location.pathname !== routes.uploadedPrograms;
  return <main className={clsx('main', lightColored && 'main--light-colored')}>{children}</main>;
};

Main.propTypes = {
  children: PropTypes.node.isRequired,
};
