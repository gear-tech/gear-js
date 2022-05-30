import { useState, useRef, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { nanoid } from 'nanoid/non-secure';
import { createPortal } from 'react-dom';
import { TransitionGroup } from 'react-transition-group';

import { Props } from '../types';
import { DEFAULT_INFO_OPTIONS, DEFAULT_ERROR_OPTIONS, DEFAULT_LOADING_OPTIONS, DEFAULT_SUCCESS_OPTIONS } from './const';
import { AlertTimer, AlertInstance, AlertOptions, TemplateAlertOptions } from './types';
import { AlertContext } from './Context';

import { AlertTemplate } from 'components/AlertTemplate';
import { Wrapper, Transition } from 'components/Alert';

//Consider integrating react-toastify
const AlertProvider = ({ children }: Props) => {
  const root = useRef<HTMLDivElement | null>(null);

  const timers = useRef<AlertTimer>(new Map());
  const [alerts, setAlerts] = useState<AlertInstance[]>([]);

  const removeTimer = useCallback((alertId: string) => {
    const timerId = timers.current.get(alertId);

    if (timerId) {
      clearTimeout(timerId);
      timers.current.delete(alertId);
    }
  }, []);

  const remove = useCallback(
    (alertId: string) => {
      removeTimer(alertId);
      setAlerts((prevState) => prevState.filter((alert) => alert.id !== alertId));
    },
    [removeTimer]
  );

  const createTimer = useCallback(
    (alertId: string, timeout) => {
      if (timeout > 0) {
        const timerId = setTimeout(() => remove(alertId), timeout);

        timers.current.set(alertId, timerId);
      }
    },
    [remove]
  );

  const show = useCallback(
    (content: ReactNode, options: AlertOptions): string => {
      const id = nanoid(6);

      createTimer(id, options.timeout);
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
    [createTimer]
  );

  const update = useCallback(
    (alertId: string, content: ReactNode, options?: AlertOptions) => {
      let updatedAlert: AlertInstance;

      removeTimer(alertId);

      setAlerts((prevState) =>
        prevState.map((alert) => {
          if (alert.id !== alertId) {
            return alert;
          }

          return (updatedAlert = {
            id: alert.id,
            content,
            options: {
              ...alert.options,
              ...options,
            },
          });
        })
      );

      if (updatedAlert!) {
        createTimer(updatedAlert.id, updatedAlert.options.timeout);
      }
    },
    [removeTimer, createTimer]
  );

  const getAlertTemplate = useCallback(
    (templateOptions: AlertOptions) => (content: ReactNode, options?: TemplateAlertOptions) =>
      show(content, {
        ...templateOptions,
        ...options,
      }),
    [show]
  );

  const alertContext = useMemo(
    () => ({
      update,
      remove,
      info: getAlertTemplate(DEFAULT_INFO_OPTIONS),
      error: getAlertTemplate(DEFAULT_ERROR_OPTIONS),
      success: getAlertTemplate(DEFAULT_SUCCESS_OPTIONS),
      loading: getAlertTemplate(DEFAULT_LOADING_OPTIONS),
    }),
    [update, remove, getAlertTemplate]
  );

  useEffect(() => {
    root.current = document.createElement('div');
    root.current.id = '__alert__';
    document.body.appendChild(root.current);
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
