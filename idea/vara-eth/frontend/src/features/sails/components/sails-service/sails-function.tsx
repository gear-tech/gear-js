import { ISailsFuncArg } from '@gear-js/sails-payload-form';
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
  type: 'function' | 'query';
  sails: Sails;
  args: ISailsFuncArg[];
};

const SailsFunction = ({ name, type, sails, args }: Props) => {
  const form = useForm();

  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = form.handleSubmit(() => {
    console.log('submit');
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className={styles.container}>
        <button className={styles.header} onClick={() => setIsOpen((prevValue) => !prevValue)}>
          <ArrowSVG className={cx(styles.arrow, isOpen && styles.open)} />
          <span className={styles.title}>{name}</span>

          <Button
            type="submit"
            variant="default"
            size="xs"
            //   isLoading={isPendingInjectedTransaction || isPendingMessage}
            className={styles.button}>
            {type === 'function' ? 'Read' : 'Write'}
          </Button>
        </button>

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
