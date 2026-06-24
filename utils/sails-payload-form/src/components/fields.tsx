import type { JSX, PropsWithChildren } from 'react';
import type { Sails, SailsProgram } from 'sails-js';

import type { FieldProps, ISailsFuncArg } from '../types';
import { isIdlV2Program } from '../utils/program';
import { FieldsV2 } from './fields-v2';
import { LegacyFields } from './legacy/fields';

type Props = {
  program?: Sails | SailsProgram;
  sails?: Sails;
  serviceName?: string;
  args: ISailsFuncArg[];
  render: FieldProps['render'];
  renderContainer?: (props: PropsWithChildren) => JSX.Element;
};

function Fields({ program, sails, serviceName, args, render, renderContainer }: Props) {
  const instance = program ?? sails;

  if (!instance) throw new Error('program or sails is required');

  if (isIdlV2Program(instance)) {
    return (
      <FieldsV2
        program={instance}
        serviceName={serviceName}
        args={args}
        render={render}
        renderContainer={renderContainer}
      />
    );
  }

  return <LegacyFields sails={instance} args={args} render={render} renderContainer={renderContainer} />;
}

export { Fields };
