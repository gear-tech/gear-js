import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { TransitionGroup } from 'react-transition-group';

import { Props } from '../types';
import { DEFAULT_OPTIONS } from './const';
import { AlertInstance, AlertTimer, AlertContainerFactory, AlertType, AlertOptions } from './types';
import { AlertContext } from './Context';

import { AlertTemplate } from 'components/AlertTemplate';
import { Wrapper, Transition } from 'components/Alert';

const AlertProvider = ({ children }: Props) => {
  const root = useRef<HTMLDivElement | null>(null);

  const timers = useRef<AlertTimer[]>([]);
  const [alerts, setAlerts] = useState<AlertInstance[]>([]);

  const createTimer = (alertId: number, callback: () => void, timeout = DEFAULT_OPTIONS.timeout) => {
    if (timeout > 0) {
      const timerId = setTimeout(callback, timeout);

      timers.current.push({
        id: timerId,
        alertId,
      });
    }
  };

  const removeTimer = (alertId: number) => {
    const timerIndex = timers.current.findIndex((timer) => timer.alertId == alertId);

    if (timerIndex !== -1) {
      clearTimeout(timers.current[timerIndex].id);
      timers.current.splice(timerIndex, 1);
    }
  };

  const show = useCallback((alert: AlertInstance) => {
    setAlerts((prevState) => [...prevState, alert]);
    createTimer(alert.id, alert.close, alert.options.timeout);
  }, []);

  const remove = useCallback((id: number) => {
    removeTimer(id);
    setAlerts((prevState) => prevState.filter((alert) => alert.id !== id));
  }, []);

  const update = useCallback((id: number, message: string, options: AlertOptions = {}) => {
    let updatedAlert: AlertInstance;

    removeTimer(id);
    setAlerts((prevState) =>
      prevState.map((alert) => {
        if (alert.id !== id) {
          return alert;
        }

        updatedAlert = {
          ...alert,
          message,
          options: {
            ...alert.options,
            ...options,
          },
        };

        return updatedAlert;
      })
    );

    if (updatedAlert!) {
      createTimer(updatedAlert.id, updatedAlert.close, updatedAlert.options.timeout);
    }
  }, []);

  const create = useCallback(
    (message: string, options: AlertOptions = {}): AlertInstance => {
      const id = Math.random();

      const alert: AlertInstance = {
        id,
        message,
        options: {
          ...DEFAULT_OPTIONS,
          ...options,
        },
        show: () => show(alert),
        close: () => remove(id),
        update: (updatedMessage: string, updatedOptions?: AlertOptions) => update(id, updatedMessage, updatedOptions),
      };

      return alert;
    },
    [remove, update, show]
  );

  const createAndShow = useCallback(
    (defaultOptions: AlertOptions) =>
      (message = '', options: AlertOptions = {}) => {
        const alert = create(message, {
          ...defaultOptions,
          ...options,
        });

        alert.show();

        return alert;
      },
    [create]
  );

  const alertContext: AlertContainerFactory = useMemo(
    () => ({
      create,
      info: createAndShow({ type: AlertType.INFO }),
      error: createAndShow({ type: AlertType.ERROR }),
      success: createAndShow({ type: AlertType.SUCCESS }),
      loading: createAndShow({
        type: AlertType.LOADING,
        closed: false,
        timeout: 0,
      }),
    }),
    [create, createAndShow]
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
