import { HexString } from '@gear-js/api';
import { Button, Select } from '@gear-js/ui';
import { useState, useEffect } from 'react';

import { Fieldset } from '@/shared/ui';

import { useParsedIdl } from '../../hooks';
import { Fields } from '../fields';
import styles from './payload-form.module.scss';
import { FormProvider, useForm } from 'react-hook-form';

type Props = {
  programId: HexString;
};

function PayloadForm({ programId }: Props) {
  const { sails, idl } = useParsedIdl(programId);
  const { services } = idl || {};

  const serviceNames = Object.keys(services || {});
  const [defaultServiceName] = serviceNames;
  const [serviceName, setServiceName] = useState<string>();

  useEffect(() => {
    setServiceName(defaultServiceName);
  }, [defaultServiceName]);

  const service = services && serviceName ? services[serviceName] : undefined;
  const { functions } = service || {};
  const functionNames = Object.keys(functions || {});
  const [defaultFunctionName] = functionNames;

  const [functionName, setFunctionName] = useState<string>();
  const func = functions && functionName ? functions[functionName] : undefined;
  const { args } = func || {};

  useEffect(() => {
    setFunctionName(defaultFunctionName);
  }, [defaultFunctionName]);

  const defaultValues = {};
  const shouldUnregister = true;

  const form = useForm({ defaultValues, shouldUnregister });

  const handleSubmit = form.handleSubmit((values) => {
    console.log('values: ', values);
    console.log('args: ', Object.values(values));
  });

  return (
    <FormProvider {...form}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Fieldset>
          <Select
            label="Service"
            direction="y"
            options={serviceNames.map((name) => ({ label: name, value: name }))}
            value={serviceName}
            onChange={({ target }) => {
              setServiceName(target.value);
              setFunctionName(Object.keys(services?.[target.value].functions || {})[0]);
            }}
          />

          <Select
            label="Function"
            direction="y"
            options={functionNames.map((name) => ({ label: name, value: name }))}
            value={functionName}
            onChange={({ target }) => setFunctionName(target.value)}
          />

          {sails && args && <Fields sails={sails} args={args} />}

          <Button type="submit" text="Submit" />
        </Fieldset>
      </form>
    </FormProvider>
  );
}

export { PayloadForm };
