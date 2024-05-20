import { HexString } from '@gear-js/api';
import { Input, Select } from '@gear-js/ui';
import { useState, useEffect } from 'react';

import { useParsedIdl } from '../../hooks';
import { ISailsFuncArg } from '../../types';
import { EnumField } from '../enum-field';
import { UserDefinedField } from '../user-defined-field';
import { StructField } from '../struct-field';
import { OptionalField } from '../optional-field';
import { ResultField } from '../result-field';
import { VecField } from '../vec-field';
import { MapField } from '../map-field';
import { FixedSizeArrayField } from '../fixed-size-array-field';

type Props = {
  programId: HexString;
};

function PayloadForm({ programId }: Props) {
  const { idl } = useParsedIdl(programId);

  const [serviceName] = Object.keys(idl?.services || {});
  const functions = idl?.services[serviceName].functions || {};
  const functionNames = Object.keys(functions || {});
  const [defaultFunctionName] = functionNames;

  const [functionName, setFunctionName] = useState<string>();

  useEffect(() => {
    setFunctionName(defaultFunctionName);
  }, [defaultFunctionName]);

  const renderFields = (args: ISailsFuncArg[]) =>
    args.map((arg) => {
      const { name, type, typeDef } = arg;

      if (typeDef.isEnum) return <EnumField key={''} def={typeDef.asEnum} />;

      if (typeDef.isStruct) return <StructField key={''} def={typeDef.asStruct} />;

      if (typeDef.isOptional) return <OptionalField key={''} def={typeDef.asOptional} />;

      if (typeDef.isResult) return <ResultField key={''} def={typeDef.asResult} />;

      if (typeDef.isVec) return <VecField key={''} def={typeDef.asVec} />;

      if (typeDef.isMap) return <MapField key={''} def={typeDef.asMap} />;

      if (typeDef.isFixedSizeArray) return <FixedSizeArrayField key={''} def={typeDef.asFixedSizeArray} />;

      if (typeDef.isUserDefined) return <UserDefinedField key={''} def={typeDef.asUserDefined} />;

      if (typeDef.isPrimitive) {
        const label = `${name} (${type})`;

        return <Input key={label} direction="y" label={label} />;
      }
    });

  return (
    <form>
      <Select
        options={functionNames.map((name) => ({ label: name, value: name }))}
        value={functionName}
        onChange={({ target }) => setFunctionName(target.value)}
      />

      {functionName && renderFields(functions[functionName].args)}
    </form>
  );
}

export { PayloadForm };
