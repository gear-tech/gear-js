import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { GEAR_STORAGE_KEY } from 'consts';
import { routes } from 'routes';
import { UnsubscribePromise } from '@polkadot/api/types';
import { nodeApi } from '../../api/initApi';
import { useApi } from '../../hooks/useApi';
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

  const [api] = useApi();

  const dispatch = useDispatch();

  useEffect(() => {
    let unsub: UnsubscribePromise | null = null;
    let unsub2: UnsubscribePromise | null = null;

    if (api) {
      unsub = api.gearEvents.subsribeProgramEvents((event) => {
        event.data.forEach((i) => {
          const data = i.toHuman() as { source: string };
          if (data.source === localStorage.getItem('public_key_raw')) {
            dispatch(fetchNotificationsSuccessAction(data));
          }
        });
      });
      unsub2 = api.gearEvents.subscribeLogEvents((event) => {
        event.data.forEach((i) => {
          const data = i.toHuman() as { source: string };
          if (data.source === localStorage.getItem('public_key_raw')) {
            dispatch(fetchNotificationsSuccessAction(data));
          }
        });
      });
    }
    return () => {
      if (unsub) {
        (async () => {
          (await unsub)();
        })();
      }
      if (unsub2) {
        (async () => {
          (await unsub2)();
        })();
      }
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
