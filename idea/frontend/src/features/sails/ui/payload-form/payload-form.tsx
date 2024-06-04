import { HexString } from '@gear-js/api';
import { Select } from '@gear-js/ui';
import { useState, useEffect } from 'react';

import { Fieldset } from '@/shared/ui';

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

  const renderField = (def: TypeDef, name: string = '') => {
    if (def.isEnum) return <EnumField key={''} def={def.asEnum} renderField={renderField} />;
    if (def.isStruct) return <StructField key={''} def={def.asStruct} renderField={renderField} />;
    if (def.isOptional) return <OptionalField key={''} def={def.asOptional} name={name} renderField={renderField} />;
    if (def.isResult) return <ResultField key={''} def={def.asResult} />;
    if (def.isVec) return <VecField key={''} def={def.asVec} />;
    if (def.isMap) return <MapField key={''} def={def.asMap} />;
    if (def.isFixedSizeArray) return <FixedSizeArrayField key={''} def={def.asFixedSizeArray} />;

    if (def.isUserDefined) {
      if (!sails) return;

      const nextDefName = def.asUserDefined.name;
      const nextDef = sails.getTypeDef(nextDefName);

      return <UserDefinedField key={nextDefName} def={def.asUserDefined} renderField={() => renderField(nextDef)} />;
    }

    if (def.isPrimitive) return <PrimitiveField key={''} def={def.asPrimitive} name={name} />;
  };

  const renderFields = (args: ISailsFuncArg[]) => args.map(({ typeDef, name }) => renderField(typeDef, name));

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
