import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { TransitionGroup } from 'react-transition-group';

import { Props } from '../types';
import { DEFAULT_OPTIONS } from './const';
import { AlertInstance, AlertTimer, AlertContainerFactory, AlertType, AlertOptions } from './types';
import { AlertContext } from './Context';

import { Wrapper, Transition } from 'components/Alert';
import { AlertTemplate } from 'components/AlertTemplate';

const AlertProvider = ({ children }: Props) => {
  const root = useRef<HTMLDivElement | null>(null);

  const timers = useRef<AlertTimer[]>([]);
  const [alerts, setAlerts] = useState<AlertInstance[]>([]);

  const createTimer = useCallback((alertId: number, callback: () => void, timeout = DEFAULT_OPTIONS.timeout) => {
    if (timeout) {
      const timerId = setTimeout(callback, timeout);

      timers.current.push({
        id: timerId,
        alertId,
      });
    }
  }, []);

  const removeTimer = useCallback((alertId: number) => {
    const timerIndex = timers.current.findIndex((timer) => timer.alertId == alertId);

    if (timerIndex !== -1) {
      clearTimeout(timers.current[timerIndex].id);
      timers.current.splice(timerIndex, 1);
    }
  }, []);

  const remove = useCallback(
    (id: number) => {
      removeTimer(id);
      setAlerts((prevState) => prevState.filter((alert) => alert.id !== id));
    },
    [removeTimer]
  );

  const update = useCallback(
    (id: number, message: string, options: AlertOptions = {}) => {
      removeTimer(id);
      setAlerts((prevState) =>
        prevState.map((alert) => {
          if (alert.id !== id) {
            return alert;
          }

          const updatedAlert: AlertInstance = {
            ...alert,
            message,
            options: {
              ...alert.options,
              ...options,
            },
          };

          createTimer(updatedAlert.id, updatedAlert.close, updatedAlert.options.timeout);

          return updatedAlert;
        })
      );
    },
    [removeTimer, createTimer]
  );

  const show = useCallback(
    (message = '', options: AlertOptions = {}) => {
      const id = Math.random();

      const alert: AlertInstance = {
        id,
        message,
        options: {
          ...DEFAULT_OPTIONS,
          ...options,
        },
        close: () => remove(id),
        update: (updatedMessage: string, updatedOptions?: AlertOptions) => update(id, updatedMessage, updatedOptions),
      };

      createTimer(alert.id, alert.close, alert.options.timeout);
      setAlerts((prevState) => [...prevState, alert]);

      return alert;
    },
    [remove, update, createTimer]
  );

  const success = useCallback(
    (message = '', options: AlertOptions = {}) =>
      show(message, {
        ...options,
        type: AlertType.SUCCESS,
      }),
    [show]
  );

  const error = useCallback(
    (message = '', options: AlertOptions = {}) =>
      show(message, {
        ...options,
        type: AlertType.ERROR,
      }),
    [show]
  );

  const info = useCallback(
    (message = '', options: AlertOptions = {}) =>
      show(message, {
        ...options,
        type: AlertType.INFO,
      }),
    [show]
  );

  const loading = useCallback(
    (message = '') =>
      show(message, {
        type: AlertType.LOADING,
        closed: false,
        timeout: 0,
      }),
    [show]
  );

  const alertContext: AlertContainerFactory = useMemo(
    () => ({
      info,
      show,
      error,
      remove,
      success,
      loading,
    }),
    [show, remove, success, loading, error, info]
  );

  useEffect(() => {
    root.current = document.createElement('div');
    root.current.id = '__alert__';
    document.body.appendChild(root.current);
    const timersIdRef = timers.current;

    return () => {
      timersIdRef.forEach((timer) => clearTimeout(timer.id));

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
                {/*@ts-ignore*/}
                <AlertTemplate style={{ marginBottom: '10px' }} {...alert} />
              </Transition>
            ))}
          </TransitionGroup>,
          root.current
        )}
    </AlertContext.Provider>
  );
};

export { AlertProvider };
