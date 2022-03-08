import React from 'react';
import { useNavigate } from 'react-router-dom';
import arrow from 'assets/images/arrow_back.svg';
import { Button } from '../Button/Button';
import { Props } from '../Button/types';

type OmittedProps = 'text' | 'icon' | 'color' | 'size' | 'onClick';

const BackButton = (props: Omit<Props, OmittedProps>) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };

  return <Button icon={arrow} onClick={handleClick} {...props} />;
};

export { BackButton };
