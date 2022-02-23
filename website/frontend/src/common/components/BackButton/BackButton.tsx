import React from 'react';
import { useHistory } from 'react-router-dom';
import arrow from 'assets/images/arrow_back.svg';
import { Button } from '../Button/Button';
import { Props } from '../Button/types';

type OmittedProps = 'text' | 'icon' | 'color' | 'size' | 'onClick';

const BackButton = (props: Omit<Props, OmittedProps>) => {
  const history = useHistory();

  const handleClick = () => {
    history.goBack();
  };

  return <Button icon={arrow} onClick={handleClick} {...props} />;
};

export { BackButton };
