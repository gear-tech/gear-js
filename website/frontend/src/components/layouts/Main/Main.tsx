import React, { FC } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { routes } from 'routes';
import './Main.scss';
import { useApi } from '../../../hooks/useApi';

export const Main: FC = ({ children }) => {
  const location = useLocation();
  const [, apiLoaded] = useApi();
  const lightColored = location.pathname !== routes.main && location.pathname !== routes.uploadedPrograms;
  return (
    <main className={clsx('main', lightColored && 'main--light-colored')}>
      {apiLoaded ? children : <div className="loading-text">Loading...</div>}
    </main>
  );
};

Main.propTypes = {
  children: PropTypes.node.isRequired,
};
