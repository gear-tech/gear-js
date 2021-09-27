import React, { FC } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { GEAR_STORAGE_KEY } from 'consts';
import { routes } from 'routes';

const defaultProps = {};

type Props = {
  children: React.ReactNode;
  path: string | string[];
  exact: boolean;
} & typeof defaultProps;

export const PrivateRoute: FC<Props> = ({ children, path, exact, ...rest }) => (
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
);
