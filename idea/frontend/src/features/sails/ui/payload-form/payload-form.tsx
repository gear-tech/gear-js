import { InputProps, InputWrapper, Select } from '@gear-js/ui';
import { Sails } from 'sails-js';

import { Fields } from '../fields';
import { useConstructor, useService } from '../../hooks';
import { ISailsFuncArg } from '../../types';
import styles from './payload-form.module.scss';

type BaseProps = Pick<InputProps, 'direction' | 'gap'> & {
  sails: Sails;
  args: ISailsFuncArg[];
};

type ConstructorProps = BaseProps & {
  select: ReturnType<typeof useConstructor>['select'];
};

type ServiceProps = BaseProps & {
  select: ReturnType<typeof useService>['select'];
  functionSelect: ReturnType<typeof useService>['functionSelect'];
};

type Props = ConstructorProps | ServiceProps;

function PayloadForm({ sails, select, args, direction = 'x', gap, ...props }: Props) {
  const isService = 'functionSelect' in props;

  return (
    <InputWrapper id="payload" label="Payload" size="normal" gap={gap} direction={direction} className={styles.form}>
      {isService ? (
        <>
          <Select
            label="Service"
            direction="y"
            options={select.options}
            value={select.value}
            onChange={select.handleChange}
          />

          <Select
            label="Function"
            direction="y"
            options={props.functionSelect.options}
            value={props.functionSelect.value}
            onChange={props.functionSelect.handleChange}
          />
        </>
      ) : (
        <Select
          label="Constructor"
          direction="y"
          options={select.options}
          value={select.value}
          onChange={select.handleChange}
        />
      )}

      <Fields sails={sails} args={args} />
    </InputWrapper>
  );
}

export { PayloadForm };
