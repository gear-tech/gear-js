import { Fields, ISailsFuncArg } from '@gear-js/sails-payload-form';
import { InputProps, InputWrapper, Select } from '@gear-js/ui';
import { Sails } from 'sails-js';

import { Checkbox, Fieldset, Input, Textarea } from '@/shared/ui';

import { useConstructor, useService } from '../../hooks';

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
      <Select direction="y" {...select} />
      {isFunction && <Select direction="y" {...props.functionSelect} />}

      <Fields
        sails={sails}
        args={args}
        render={{
          ui: { fieldset: Fieldset, select: Select },
          rhf: { input: Input, textarea: Textarea, checkbox: Checkbox },
        }}
      />
    </InputWrapper>
  );
}

export { PayloadForm };
