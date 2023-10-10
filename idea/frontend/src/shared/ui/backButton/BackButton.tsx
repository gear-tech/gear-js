import { Button } from '@gear-js/ui';
import { useNavigate } from 'react-router-dom';

import closeSVG from 'shared/assets/images/actions/close.svg?react';

const BackButton = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return <Button text="Cancel" icon={closeSVG} size="large" color="light" onClick={goBack} />;
};

export { BackButton };
