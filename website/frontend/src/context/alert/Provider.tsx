import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { nanoid } from 'nanoid/non-secure';
import { createPortal } from 'react-dom';
import { TransitionGroup } from 'react-transition-group';

import { Props } from '../types';
import { DEFAULT_OPTIONS } from './const';
import { AlertInstance, AlertTimer, AlertContainerFactory, AlertTypes, AlertOptions, AlertType } from './types';
import { AlertContext } from './Context';

import { AlertTemplate } from 'components/AlertTemplate';
import { Wrapper, Transition } from 'components/Alert';

const AlertProvider = ({ children }: Props) => {
  const root = useRef<HTMLDivElement | null>(null);

  const timers = useRef<AlertTimer[]>([]);
  const [alerts, setAlerts] = useState<AlertInstance[]>([]);

  const createTimer = useCallback(
    (alertId: string, callback: (alertId: string) => void, timeout = DEFAULT_OPTIONS.timeout) => {
      if (timeout > 0) {
        const timerId = setTimeout(() => callback(alertId), timeout);

        timers.current.push({
          id: timerId,
          alertId,
        });
      }
    },
    []
  );

  const removeTimer = useCallback((alertId: string) => {
    const timerIndex = timers.current.findIndex((timer) => timer.alertId == alertId);

    if (timerIndex !== -1) {
      clearTimeout(timers.current[timerIndex].id);
      timers.current.splice(timerIndex, 1);
    }
  }, []);

  const remove = useCallback(
    (id: string) => {
      removeTimer(id);
      setAlerts((prevState) => prevState.filter((alert) => alert.id !== id));
    },
    [removeTimer]
  );

  const update = useCallback(
    (id: string, message: string, options?: Omit<AlertOptions, 'castomId'>) => {
      let updatedAlert: AlertInstance;

      removeTimer(id);

      setAlerts((prevState) =>
        prevState.map((alert) => {
          if (alert.id !== id) {
            return alert;
          }

          return (updatedAlert = {
            ...alert,
            message,
            options: {
              ...alert.options,
              ...options,
            },
          });
        })
      );

      if (updatedAlert!) {
        createTimer(updatedAlert.id, remove, updatedAlert.options.timeout);
      }
    },
    [removeTimer, createTimer, remove]
  );

  const show = useCallback(
    (message: string, options?: AlertOptions): string => {
      const alertId = options?.customId;

      if (alertId) {
        //@ts-ignore
        const isCreated = alerts.includes((alert) => alert.id === alertId);

        if (isCreated) {
          return alertId;
        }
      }

      const alert: AlertInstance = {
        id: alertId || nanoid(8),
        message,
        options: {
          ...DEFAULT_OPTIONS,
          ...options,
        },
      };

      createTimer(alert.id, remove, alert.options.timeout);
      setAlerts((prevState) => [...prevState, alert]);

      return alert.id;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [createTimer, remove]
  );

  const сreateTemplateAlert = useCallback(
    (type: AlertTypes) => (message: string, options?: AlertOptions) =>
      show(message, {
        ...options,
        type,
      }),
    [show]
  );

  const alertContext: AlertContainerFactory = useMemo(
    () => ({
      show,
      update,
      remove,
      info: сreateTemplateAlert(AlertType.INFO),
      error: сreateTemplateAlert(AlertType.ERROR),
      success: сreateTemplateAlert(AlertType.SUCCESS),
      loading: сreateTemplateAlert(AlertType.LOADING),
    }),
    [show, update, remove, сreateTemplateAlert]
  );

  useEffect(() => {
    root.current = document.createElement('div');
    root.current.id = '__alert__';
    document.body.appendChild(root.current);
    const timersRef = timers.current;

    return () => {
      timersRef.forEach((timer) => clearTimeout(timer.id));

      if (root.current) {
        document.body.removeChild(root.current);
      }
    };
  }, []);

  return (
    <AlertContext.Provider value={alertContext}>
      {children}
      {root.current &&
        createPortal(
          <TransitionGroup appear component={Wrapper}>
            {alerts.map((alert) => (
              <Transition key={alert.id}>
                <AlertTemplate alert={alert} onClose={() => remove(alert.id)} />
              </Transition>
            ))}
          </TransitionGroup>,
          root.current
        )}
    </AlertContext.Provider>
  );
};

export { AlertProvider };
