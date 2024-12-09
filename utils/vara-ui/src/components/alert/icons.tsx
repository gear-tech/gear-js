import { ReactNode } from 'react';
import SuccessIcon from '../../assets/images/success.svg?react';
import ErrorIcon from '../../assets/images/error.svg?react';
import InfoIcon from '../../assets/images/info.svg?react';
import LoadingIcon from '../../assets/images/loading.svg?react';
import WarningIcon from '../../assets/images/warning.svg?react';
import type { AlertTypes, AlertVariants } from './alert.tsx';

type AlertIcons = Record<AlertVariants, Record<AlertTypes, ReactNode>>;

const alertIcons: AlertIcons = {
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
