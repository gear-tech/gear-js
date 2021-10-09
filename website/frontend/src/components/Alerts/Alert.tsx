import React, { useEffect, FC } from 'react';
import { useAlert } from 'react-alert';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reducers';

export const Alert: FC = () => {
  const alert = useAlert();
  const notification = useSelector((state: RootState) => state.alert.alert);
  useEffect(() => {
    if (notification) {
      alert.show(notification.message, {
        type: notification.type,
        timeout: 50000,
      });
    }
  }, [alert, notification]);

  return <></>;
};
