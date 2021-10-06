import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { GEAR_STORAGE_KEY } from 'consts';
import { routes } from 'routes';
import { nodeApi } from '../../api/initApi';
import { fetchNotificationsSuccessAction } from '../../store/actions/actions';

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

  const dispatch = useDispatch();

  useEffect(() => {
    if (nodeApi) {
      nodeApi.subscribeProgramEvents((event) => {
        event.data.forEach((i) => {
          const data = i.toHuman() as { source: string };
          if (data.source === localStorage.getItem('public_key_raw')) {
            dispatch(fetchNotificationsSuccessAction(data));
          }
        });
      });

      nodeApi.subscribeLogEvents((event) => {
        console.log(event);
        event.data.forEach((i) => {
          const data = i.toHuman() as { source: string };
          if (data.source === localStorage.getItem('public_key_raw')) {
            dispatch(fetchNotificationsSuccessAction(data));
          }
        });
      });
    }
    return () => {
      nodeApi.unsubscribeProgramEvents();
      nodeApi.unsubscribeLogEvents();
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
