import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
  ComponentType,
  createContext,
  useContext,
} from 'react';
import { createPortal } from 'react-dom';
import { TransitionGroup } from 'react-transition-group';
import { nanoid } from 'nanoid/non-secure';
import { Transition } from '@/components';
import {
  DEFAULT_INFO_OPTIONS,
  DEFAULT_ERROR_OPTIONS,
  DEFAULT_LOADING_OPTIONS,
  DEFAULT_SUCCESS_OPTIONS,
} from '@/consts';

import {
  ProviderProps,
  AlertTimer,
  AlertInstance,
  AlertOptions,
  TemplateAlertOptions,
  AlertTemplateProps,
  AlertContainerFactory,
} from '../types';

type Props = ProviderProps & {
  template: ComponentType<AlertTemplateProps>;
  containerClassName?: string;
};

const AlertContext = createContext({} as AlertContainerFactory);

const AlertProvider = ({ children, template: Template, containerClassName }: Props) => {
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
    [removeTimer],
  );

  const createTimer = useCallback(
    (alertId: string, timeout = 0) => {
      if (timeout > 0) {
        const timerId = setTimeout(() => remove(alertId), timeout);

        timers.current.set(alertId, timerId);
      }
    },
    [remove],
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
    [createTimer],
  );

  const update = useCallback(
    (alertId: string, content: ReactNode, options?: Partial<AlertOptions>) => {
      removeTimer(alertId);

      setAlerts((prevState) =>
        prevState.map((alert) => {
          if (alert.id !== alertId) return alert;

          const updatedAlert = {
            id: alert.id,
            content,
            options: {
              ...alert.options,
              ...options,
            },
          };

          createTimer(updatedAlert.id, updatedAlert.options.timeout);

          return updatedAlert;
        }),
      );
    },
    [removeTimer, createTimer],
  );

  const getAlertTemplate = useCallback(
    (templateOptions: AlertOptions) => (content: ReactNode, options?: TemplateAlertOptions) =>
      show(content, {
        ...templateOptions,
        ...options,
      }),
    [show],
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
    [update, remove, getAlertTemplate],
  );

  useEffect(() => {
    root.current = document.createElement('div');
    root.current.id = 'alert-root';
    containerClassName && root.current.classList.add(containerClassName);
    document.body.appendChild(root.current);
  }, []);

  return (
    <>
      <AlertContext.Provider value={alertContext}>{children}</AlertContext.Provider>
      {root.current &&
        createPortal(
          <TransitionGroup appear>
            {alerts.map((alert) => (
              <Transition key={alert.id}>
                <Template alert={alert} close={() => remove(alert.id)} />
              </Transition>
            ))}
          </TransitionGroup>,
          root.current,
        )}
    </>
  );
};

const useAlert = () => useContext(AlertContext);

// TODO: either fix only-export-components or remove rule
// eslint-disable-next-line react-refresh/only-export-components
export { AlertProvider, useAlert };
