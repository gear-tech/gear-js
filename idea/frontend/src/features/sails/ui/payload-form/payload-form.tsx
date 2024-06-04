import { HexString } from '@gear-js/api';
import { Select } from '@gear-js/ui';
import { useState, useEffect } from 'react';

import { Fieldset } from '@/shared/ui';
import { generateRandomId } from '@/shared/helpers';

import { useParsedIdl } from '../../hooks';
import { ISailsFuncArg, TypeDef } from '../../types';
import { EnumField } from '../enum-field';
import { UserDefinedField } from '../user-defined-field';
import { StructField } from '../struct-field';
import { OptionalField } from '../optional-field';
import { ResultField } from '../result-field';
import { VecField } from '../vec-field';
import { MapField } from '../map-field';
import { FixedSizeArrayField } from '../fixed-size-array-field';
import { PrimitiveField } from '../primitive-field';
import styles from './payload-form.module.scss';
import { getLabel, getType } from '../../utils';

type Props = {
  programId: HexString;
};

function PayloadForm({ programId }: Props) {
  const { sails, idl } = useParsedIdl(programId);

  const [serviceName] = Object.keys(idl?.services || {});
  const functions = idl?.services[serviceName].functions || {};
  const functionNames = Object.keys(functions || {});
  const [defaultFunctionName] = functionNames;

  const [functionName, setFunctionName] = useState<string>();

  useEffect(() => {
    setFunctionName(defaultFunctionName);
  }, [defaultFunctionName]);

  const getFieldComponent = (def: TypeDef) => {
    if (def.isEnum) return EnumField;
    if (def.isStruct) return StructField;
    if (def.isOptional) return OptionalField;
    if (def.isResult) return ResultField;
    if (def.isVec) return VecField;
    if (def.isMap) return MapField;
    if (def.isFixedSizeArray) return FixedSizeArrayField;
    if (def.isUserDefined) return UserDefinedField;
    if (def.isPrimitive) return PrimitiveField;

    throw new Error('Unknown field type: ' + JSON.stringify(def));
  };

  const renderField = (def: TypeDef, name: string = '') => {
    if (!sails) throw new Error('Sails is not defined');
    if (!def) return; // in case of empty enum variant, EnumVariant.def sails-js type is inaccurate at the moment

    const key = generateRandomId();
    const label = getLabel(name, getType(def));
    const Field = getFieldComponent(def);

    return <Field key={key} def={def} sails={sails} label={label} renderField={renderField} />;
  };

  const renderFields = (args: ISailsFuncArg[]) =>
    args.map(({ typeDef, name, type }) => {
      // console.log('type: ', type);

      return renderField(typeDef, name);
    });

  return (
    <form className={styles.form}>
      <Fieldset legend={serviceName}>
        <Select
          options={functionNames.map((name) => ({ label: name, value: name }))}
          value={functionName}
          onChange={({ target }) => setFunctionName(target.value)}
        />

        {functionName && renderFields(functions[functionName].args)}
      </Fieldset>
    </form>
  );
}

export { PayloadForm };
