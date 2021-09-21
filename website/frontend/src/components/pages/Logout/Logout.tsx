import React, { useEffect, VFC } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { routes } from 'routes';
import { logoutFromAccountAction } from 'store/actions/actions';

export const Logout: VFC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logoutFromAccountAction());
  });

  return <Redirect to={routes.signIn} />;
};
