import React, { FC, useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { GEAR_STORAGE_KEY } from 'consts';
import { routes } from 'routes';
import { nodeApi } from '../../api/initApi';

const defaultProps = {};

type Props = {
  children: React.ReactNode;
  path: string | string[];
  exact: boolean;
} & typeof defaultProps;

export const PrivateRoute: FC<Props> = ({ children, path, exact, ...rest }) => {
  const [isApiReady, setIsApiReady] = useState(false);
  useEffect(() => {
    if (!isApiReady) {
      nodeApi.init().then(() => {
        setIsApiReady(true);
      });
    }
  }, [isApiReady]);

  useEffect(() => {
    nodeApi.subscribeAllEvents((event) => {
      console.log(event.toHuman());
      // dispatch(fetchNotificationsSuccessAction(event.toHuman()));
    });

    return () => {
      nodeApi.unsubscribeAllEvents();
    };
  });
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
