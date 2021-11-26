import React, { VFC } from 'react';
import { PAGE_TYPES } from 'consts';
import { fileNameHandler } from 'helpers';
import ArrowBack from 'assets/images/arrow_back.svg';
import ProgramIllustration from 'assets/images/program_icon.svg';
import close from 'assets/images/close.svg';
import { Wallet } from '../Wallet/Wallet';
import './PageHeader.scss';

type Props = {
  programName: string;
  pageType: string;
  handleClose: () => void;
};

export const PageHeader: VFC<Props> = ({ programName, pageType, handleClose }) => {
  let headInscription = 'New request to';
  let formId = 'message-form';
  if (pageType === PAGE_TYPES.EDITOR_PAGE) {
    headInscription = 'Edit code';
  } else if (pageType === PAGE_TYPES.META_FORM_PAGE) {
    headInscription = 'Upload metadata';
    formId = 'meta-form';
  } else if (pageType === PAGE_TYPES.NOTIFICATION_INFO) {
    headInscription = 'Notification';
  }

  return (
    <div className="message-header">
      <div className="message-header--info">
        <button
          type="button"
          aria-label="arrowBack"
          onClick={() => handleClose()}
          className="message-header--info__back"
        >
          <img src={ArrowBack} alt="back" />
        </button>
        <h2 className="message-header--info__text">{headInscription}</h2>
        <img src={ProgramIllustration} alt="program" className="message-header--info__icon" />
        <h2 className="message-header--info__filename">{fileNameHandler(programName)}</h2>
      </div>
      <Wallet />
      {/* eslint-disable react/button-has-type */}
      <button type="reset" aria-label="closeButton" form={formId} className="message-header--info__close">
        <img src={close} alt="close" />
      </button>
      {/* eslint-disable react/button-has-type */}
    </div>
  );
};
