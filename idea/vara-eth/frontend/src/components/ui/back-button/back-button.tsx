import { useNavigate } from 'react-router-dom';

import { Button, ButtonProps } from '../button';

const BackButton = ({ onClick, ...props }: ButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
    onClick?.();
  };

  return <Button {...props} onClick={handleClick} />;
};

export { BackButton };
