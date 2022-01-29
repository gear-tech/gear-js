import React, { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import styles from './BackButton.module.scss';

const BackButton = ({ className, ...attrs }: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const history = useHistory();
  const buttonClassName = clsx(styles.button, className);

  const handleClick = () => {
    history.goBack();
  };

  return <button type="button" className={buttonClassName} onClick={handleClick} {...attrs} />;
};

export { BackButton };
