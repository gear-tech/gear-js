import type { JSX, PropsWithChildren } from 'react';
import type { SailsProgram } from 'sails-js';
import type { Type, TypeDecl } from 'sails-js/types';

import type { FieldProps, ISailsFuncArg } from '../types';
import { getNestedName } from '../utils';
import {
  isBTreeMap,
  isFixedSizeArray,
  isOption,
  isPrimitive,
  isResult,
  isSlice,
  isTuple,
  isUserDefined,
  resolveNamedType,
} from '../utils/type-decl';

import { EnumField } from './enum-field';
import { FixedSizeArrayField } from './fixed-size-array-field';
import { MapField } from './map-field';
import { OptionalField } from './optional-field';
import { PrimitiveField } from './primitive-field';
import { ResultField } from './result-field';
import { StructField } from './struct-field';
import { UserDefinedField } from './user-defined-field';
import { VecField } from './vec-field';

type Props = {
  program: SailsProgram;
  serviceName?: string;
  args: ISailsFuncArg[];
  render: FieldProps['render'];
  renderContainer?: (props: PropsWithChildren) => JSX.Element;
};

function FieldsV2({ program, serviceName, args, render, renderContainer }: Props) {
  const getFieldComponent = (def: TypeDecl, resolvedType?: Type) => {
    if (resolvedType?.kind === 'struct' || isTuple(def)) return StructField;
    if (resolvedType?.kind === 'enum') return EnumField;
    if (isPrimitive(def)) return PrimitiveField;
    if (isOption(def)) return OptionalField;
    if (isResult(def)) return ResultField;
    if (isSlice(def)) return VecField;
    if (isBTreeMap(def)) return MapField;
    if (isFixedSizeArray(def)) return FixedSizeArrayField;
    if (isUserDefined(def)) return UserDefinedField;

    throw new Error(`Unknown field type: ${JSON.stringify(def)}`);
  };

  const renderField = (def: TypeDecl, label = '', name = '', resolvedType?: Type) => {
    const resolved = resolvedType ?? (isUserDefined(def) ? resolveNamedType(program, serviceName, def) : undefined);
    const unwrapped = resolved?.kind === 'alias' ? undefined : resolved;

    const Field = getFieldComponent(def, unwrapped);

    return (
      <Field
        key={name}
        def={def}
        program={program}
        serviceName={serviceName}
        resolvedType={unwrapped}
        name={name}
        label={label}
        render={render}
        renderField={renderField}
      />
    );
  };

  const renderFields = () =>
    args.map(({ typeDef, name }, index) =>
      renderField(typeDef as TypeDecl, name, getNestedName('payload', index.toString())),
    );

  return args.length && renderContainer ? renderContainer({ children: renderFields() }) : renderFields();
}

export { FieldsV2 };
