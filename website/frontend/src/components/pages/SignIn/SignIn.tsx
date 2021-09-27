import React, { VFC } from 'react';
import TelegramLoginButton from 'react-telegram-login';
import { useDispatch } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { GEAR_STORAGE_KEY, GITHUB_CALLBACK_URL, GITHUB_CLIENT_ID, TELEGRAM_BOT_NAME } from 'consts';
import { routes } from 'routes';
import { getTelegramUserJwtAction } from 'store/actions/actions';
import './SignIn.scss';
import github from 'assets/images/github.svg';

export const SignIn: VFC = () => {
  const dispatch = useDispatch();

  const handleTelegramResponse = (userObject: {}) => {
    dispatch(getTelegramUserJwtAction(userObject));
  };

  const handleAuthViaGithub = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_CALLBACK_URL}`;
  };

  if (localStorage.getItem(GEAR_STORAGE_KEY)) {
    return <Redirect to={routes.main} />;
  }

  return (
    <div className="sign-in">
      <h2 className="sign-in__title">Sign in to gear</h2>
      <div className="sign-in__wrapper-buttons">
        <TelegramLoginButton
          dataOnauth={handleTelegramResponse}
          botName={TELEGRAM_BOT_NAME}
          cornerRadius="2"
          buttonSize="large"
          requestAccess="write"
          usePic="true"
        />

        <button type="button" className="sign-in__button sign-in__button-github" onClick={handleAuthViaGithub}>
          <img className="sign-in__telegram-logo" alt="github" src={github} />
          Continue with Github
        </button>
        <div className="sign-in__terms-privacy">
          <Link to={routes.termsOfUse}>
            <button type="button" className="sign-in__terms-privacy-buttons">
              Terms
            </button>
          </Link>
          <Link to={routes.privacyPolicy}>
            <button type="button" className="sign-in__terms-privacy-buttons">
              Privacy
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
