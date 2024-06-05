import { HexString } from '@gear-js/api';
import { Select } from '@gear-js/ui';
import { useState, useEffect } from 'react';

import { Fieldset } from '@/shared/ui';

import { useParsedIdl } from '../../hooks';
import { Fields } from '../fields';
import styles from './payload-form.module.scss';

type Props = {
  programId: HexString;
};

function PayloadForm({ programId }: Props) {
  const { sails, idl } = useParsedIdl(programId);
  const { services } = idl || {};
  console.log('idl: ', idl);

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

  useEffect(() => {
    setFunctionName(defaultFunctionName);
  }, [defaultFunctionName]);

  return (
    <form className={styles.form}>
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

        {sails && functions && functionName && <Fields sails={sails} args={functions[functionName].args} />}
      </Fieldset>
    </form>
  );
}

export { PayloadForm };
