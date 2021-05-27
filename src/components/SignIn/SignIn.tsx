import React from 'react';

import './SignIn.scss'
import telegram from '../../images/telegram.svg';
import github from '../../images/github.svg';

function SignIn(){
    return (
      <div className="sign-in">
        <h2 className='sign-in__title'>Sign in to gear</h2> 
        <div className='sign-in__wrapper-buttons'>          
          <button type='button' className='sign-in__button sign-in__button-telegram'>
            <img className='sign-in__telegram-logo' alt='telegram' src={telegram}/>Continue with Telegram
          </button>
          <button type='button' className='sign-in__button sign-in__button-github'>
            <img className='sign-in__telegram-logo' alt='github' src={github}/>Continue with Github
            </button>
          <button type='button' className='sign-in__terms-privacy'>Terms Privacy</button>
        </div>
      </div>
    );
  }

  export default SignIn;