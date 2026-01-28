import { Fields, ISailsFuncArg } from '@gear-js/sails-payload-form';
import { InputProps, InputWrapper, Select } from '@gear-js/ui';
import { ComponentProps } from 'react';
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

function PayloadSelect(props: Omit<ComponentProps<typeof Select>, 'direction' | 'gap'>) {
  // eslint-disable-next-line react/no-children-prop
  return <Select {...props} direction="y" children="" />;
}

function PayloadInput(props: Omit<ComponentProps<typeof Input>, 'direction' | 'gap'>) {
  return <Input {...props} direction="y" />;
}

function PayloadTextarea(props: Omit<ComponentProps<typeof Textarea>, 'direction' | 'gap'>) {
  return <Textarea {...props} direction="y" />;
}

function PayloadForm({ sails, select, args, gap, direction = 'x', ...props }: Props) {
  const isFunction = 'functionSelect' in props;

  return (
    <InputWrapper id="payload" label="Payload" size="normal" gap={gap} direction={direction} className={styles.form}>
      <PayloadSelect {...select} />
      {isFunction && <PayloadSelect {...props.functionSelect} />}

      <Fields
        sails={sails}
        args={args}
        render={{
          ui: { fieldset: Fieldset, select: PayloadSelect },
          rhf: { input: PayloadInput, textarea: PayloadTextarea, checkbox: Checkbox },
        }}
        renderContainer={Fieldset}
      />
    </InputWrapper>
  );
}

export { PayloadForm };
