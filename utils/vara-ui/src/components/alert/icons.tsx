import type { IAlertIcons } from './alert.tsx';
import SuccessIcon from '../../assets/images/success.svg?react';
import ErrorIcon from '../../assets/images/error.svg?react';
import InfoIcon from '../../assets/images/info.svg?react';
import LoadingIcon from '../../assets/images/loading.svg?react';
import WarningIcon from '../../assets/images/warning.svg?react';

const alertIcons: IAlertIcons = {
  alert: {
    success: <SuccessIcon />,
    error: <ErrorIcon />,
    info: <InfoIcon />,
    loading: <LoadingIcon />,
  },
  notification: {
    success: <WarningIcon />,
    error: <WarningIcon />,
    info: <WarningIcon />,
    loading: <LoadingIcon />,
  },
};

export { alertIcons };
