import { useNavigate } from 'react-router-dom';
import { Button, ButtonProps } from '@gear-js/ui';
import arrow from 'assets/images/arrow_back.svg';

type OmittedProps = 'text' | 'icon' | 'color' | 'size' | 'onClick';

const BackButton = (props: Omit<ButtonProps, OmittedProps>) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };

  return <Button icon={arrow} color="transparent" onClick={handleClick} {...props} />;
};

export { BackButton };
