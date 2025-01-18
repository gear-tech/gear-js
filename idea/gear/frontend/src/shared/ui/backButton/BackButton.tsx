import { Button, ButtonProps } from '@gear-js/ui';
import { useNavigate } from 'react-router-dom';

import closeSVG from '@/shared/assets/images/actions/close.svg?react';

type Props = Pick<ButtonProps, 'size'>;

const BackButton = ({ size = 'large' }: Props) => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return <Button text="Cancel" icon={closeSVG} size={size} color="grey" onClick={goBack} />;
};

export { BackButton };
