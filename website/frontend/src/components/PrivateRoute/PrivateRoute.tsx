import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { GEAR_STORAGE_KEY } from 'consts';
import { routes } from 'routes';
import { nodeApi } from '../../api/initApi';
import { subscribeToEvents } from '../../store/actions/actions';

const defaultProps = {};

type Props = {
  children: React.ReactNode;
  path: string | string[];
  exact: boolean;
} & typeof defaultProps;

export const PrivateRoute: FC<Props> = ({ children, path, exact, ...rest }) => {
  const dispatch = useDispatch();
  const [isApiReady, setIsApiReady] = useState(false);
  useEffect(() => {
    if (!isApiReady) {
      nodeApi.init().then(() => {
        setIsApiReady(true);
      });
    }
  }, [isApiReady]);

  useEffect(() => {
    if (isApiReady) {
      dispatch(subscribeToEvents());
    }
  }, [dispatch, isApiReady]);

  return isApiReady ? (
    <Route
      {...rest}
      exact={exact}
      render={({ location }) =>
        localStorage.getItem(GEAR_STORAGE_KEY) ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: routes.signIn,
              state: { from: location },
            }}
          />
        )
      }
    />
  ) : (
    <div className="loading-text">Loading...</div>
  );
};
