import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Route } from 'react-router-dom';
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
    <Route {...rest} exact={exact} render={() => children} />
  ) : (
    <div className="loading-text">Loading...</div>
  );
};
