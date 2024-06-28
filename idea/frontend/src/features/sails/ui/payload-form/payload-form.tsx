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

function PayloadForm({ sails, select, args, gap, direction = 'x', ...props }: Props) {
  const isFunction = 'functionSelect' in props;

  return (
    <InputWrapper id="payload" label="Payload" size="normal" gap={gap} direction={direction} className={styles.form}>
      {isFunction && <Select direction="y" {...props.functionSelect} />}
      <Select direction="y" {...select} />

      <Fields sails={sails} args={args} />
    </InputWrapper>
  );
}

export { PayloadForm };
