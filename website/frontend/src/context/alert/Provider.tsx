import { useState, useRef, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { nanoid } from 'nanoid/non-secure';
import { createPortal } from 'react-dom';
import { TransitionGroup } from 'react-transition-group';

import { Props } from '../types';
import { DEFAULT_INFO_OPTIONS, DEFAULT_ERROR_OPTIONS, DEFAULT_LOADING_OPTIONS, DEFAULT_SUCCESS_OPTIONS } from './const';
import { AlertTimer, AlertInstance, AlertOptions, TemplateAlertOptions, AlertContainerFactory } from './types';
import { AlertContext } from './Context';

import { AlertTemplate } from 'components/AlertTemplate';
import { Wrapper, Transition } from 'components/Alert';

//Consider integrating react-toastify
const AlertProvider = ({ children }: Props) => {
  const root = useRef<HTMLDivElement | null>(null);

  const timers = useRef<AlertTimer[]>([]);
  const [alerts, setAlerts] = useState<AlertInstance[]>([]);

  const createTimer = useCallback((alertId: string, callback: (alertId: string) => void, timeout) => {
    if (timeout > 0) {
      const timerId = setTimeout(() => callback(alertId), timeout);

      timers.current.push({
        id: timerId,
        alertId,
      });
    }
  }, []);

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

  const show = useCallback(
    (content: ReactNode, options: AlertOptions): string => {
      const id = nanoid(8);

      createTimer(id, remove, options.timeout);
      setAlerts((prevState) => [
        ...prevState,
        {
          id,
          content,
          options,
        },
      ]);

      return id;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [createTimer, remove]
  );

  const update = useCallback(
    (id: string, content: ReactNode, options?: Omit<AlertOptions, 'castomId'>) => {
      let updatedAlert: AlertInstance;

      removeTimer(id);

      setAlerts((prevState) =>
        prevState.map((alert) => {
          if (alert.id !== id) {
            return alert;
          }

          return (updatedAlert = {
            id,
            content,
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

  const сreateTemplateAlert = useCallback(
    (templateOptions: AlertOptions) => (content: ReactNode, options?: TemplateAlertOptions) =>
      show(content, {
        ...templateOptions,
        ...options,
      }),
    [show]
  );

  const alertContext: AlertContainerFactory = useMemo(
    () => ({
      update,
      remove,
      info: сreateTemplateAlert(DEFAULT_INFO_OPTIONS),
      error: сreateTemplateAlert(DEFAULT_ERROR_OPTIONS),
      success: сreateTemplateAlert(DEFAULT_SUCCESS_OPTIONS),
      loading: сreateTemplateAlert(DEFAULT_LOADING_OPTIONS),
    }),
    [update, remove, сreateTemplateAlert]
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
