import { ISailsFuncArg } from '@gear-js/sails-payload-form';
import { HexString } from '@vara-eth/api';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Sails } from 'sails-js';

import ArrowSVG from '@/assets/icons/arrow-square-down.svg?react';
import { Button } from '@/components';
import { cx } from '@/shared/utils';

import { SailsPayloadFields } from '../sails-payload-fields';

import styles from './sails-function.module.scss';

// type Services = InstanceType<typeof Sails>['services'];
// type SailsService = Services[string];
// type SailsServiceFunc = SailsService['functions'][string];
// type SailsServiceQuery = SailsService['queries'][string];

type Props = {
  name: string;
  action: string;
  sails: Sails;
  args: ISailsFuncArg[];
  onSubmit: (payload: HexString) => Promise<unknown>;
};

const SailsFunction = ({ name, action, sails, args, onSubmit }: Props) => {
  const form = useForm();
  const { formState } = form;
  const { isSubmitting } = formState;

  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = form.handleSubmit(() => {
    console.log('submit');

    onSubmit('0x00')
      .then(() => form.reset())
      .catch((error) => console.error(error));
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className={styles.container}>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <header className={styles.header} onClick={() => setIsOpen((prevValue) => !prevValue)}>
          <ArrowSVG className={cx(styles.arrow, isOpen && styles.open)} />
          <span className={styles.title}>{name}</span>

          <Button type="submit" variant="default" size="xs" isLoading={isSubmitting} className={styles.button}>
            {action}
          </Button>
        </header>

        {isOpen && (
          <div className={styles.body}>
            <SailsPayloadFields sails={sails} args={args} />
          </div>
        )}
      </form>
    </FormProvider>
  );
};

export { SailsFunction };
