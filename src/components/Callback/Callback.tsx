import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import getGitUserJwtAction from '../../store/actions/actions';

import './Callback.scss';
import {State} from '../../types/state';
import {UserState} from '../../types/user';

interface CallbackType {
  user: UserState;
  getGitUserJwt: (code: string) => void;
}

const Callback = ({user, getGitUserJwt}: CallbackType) => {
  console.log('callback start', user);
  const query = new URLSearchParams(useLocation().search);
  const code = query.get('code');
  useEffect(() => {
    if (typeof code === 'string' && code.length > 5) {
      console.log('callback getting');
      getGitUserJwt(code);
    }},
    [ getGitUserJwt, code ]);

  if (typeof code === 'string' && code.length > 5) {
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

export default connect(mapStateToProps, mapDispatchToProps)(Callback);