import React from 'react';

import TelegramLoginButton from 'react-telegram-login';
import { useDispatch } from 'react-redux';
import { Redirect } from "react-router-dom";

import { GEAR_STORAGE_KEY } from 'consts';
import { routes } from 'routes';

import {getTelegramUserJwtAction} from 'store/actions/actions';

import './SignIn.scss'
import github from 'images/github.svg';


function SignIn(){

  const dispatch = useDispatch();

  const handleTelegramResponse = (userObject: {}) => {
    dispatch(getTelegramUserJwtAction(userObject));
  }
  
  const handleAuthViaGithub = () => {
    window.location.href = "https://github.com/login/oauth/authorize?client_id=d48a88d171386837281a&redirect_uri=https://idea.gear-tech.io/callback"
  }

  if (localStorage.getItem(GEAR_STORAGE_KEY)) {
    return <Redirect to={routes.main}/>
  }

  return (
    <div className="sign-in">
      <h2 className='sign-in__title'>Sign in to gear</h2> 
      <div className='sign-in__wrapper-buttons'>          
        <TelegramLoginButton 
          dataOnauth={handleTelegramResponse} 
          botName="gear_tech_bot" 
          cornerRadius="2"
          buttonSize="large"
          requestAccess="write"
          usePic="true"
        />
        <button 
          type='button' 
          className='sign-in__button sign-in__button-github'
          onClick={handleAuthViaGithub}>
          <img className='sign-in__telegram-logo' alt='github' src={github}/>Continue with Github
          </button>
        <div className="sign-in__terms-privacy">
          <button type='button' className='sign-in__terms-privacy-buttons'>Terms</button>
          <button type='button' className='sign-in__terms-privacy-buttons'>Privacy</button>
        </div>
      </div>
    </div>
  );
}

export default SignIn;