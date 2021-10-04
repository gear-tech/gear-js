import React, { FC, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';
import { routes } from 'routes';
import { getGitUserJwtAction } from '../../store/actions/actions';

import './Callback.scss';
import { State } from '../../types/state';
import { UserState } from '../../types/user';

interface Props {
  user: UserState;
  getGitUserJwt: (code: string) => void;
}

const CallbackComponent: FC<Props> = ({ user, getGitUserJwt }) => {
  console.log('callback start', user);
  const query = new URLSearchParams(useLocation().search);
  const code = query.get('code');
  useEffect(() => {
    if (typeof code === 'string' && code.length > 5) {
      getGitUserJwt(code);
    }
  }, [getGitUserJwt, code]);
  if (typeof code === 'string' && code.length > 5) {
    if (user.accessToken !== '') {
      return <Redirect to={routes.main} />;
    }
    return <div className="callback-content">Loading...</div>;
  }
  return <div className="callback-content callback-content--error">Error!</div>;
};

const mapStateToProps = (state: State) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch: any) => ({
  getGitUserJwt: (code: string) => dispatch(getGitUserJwtAction(code)),
});

export const Callback = connect(mapStateToProps, mapDispatchToProps)(CallbackComponent);
