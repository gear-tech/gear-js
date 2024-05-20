import { useIdl } from '../../hooks';
import { HexString } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';
import { Input, Select } from '@gear-js/ui';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Sails } from 'sails-js';
import { ISailsFuncArg, TypeDef } from '../../types';

type Props = {
  programId: HexString;
};

function useParsedIdl(programId: HexString) {
  const { api, isApiReady } = useApi();
  const idl = useIdl(true);

  const { data } = useQuery({
    queryKey: ['parsedIdl'],

    queryFn: async () => {
      if (!api) throw new Error('API not initialized');
      if (!idl) throw new Error('IDL not found');

      const sails = (await Sails.new()).setApi(api).setProgramId(programId);

      return { sails, idl: sails.parseIdl(idl) };
    },

    enabled: isApiReady && Boolean(idl),
  });

  return data || { sails: undefined, idl: undefined };
}

function PayloadForm({ programId }: Props) {
  const { sails, idl } = useParsedIdl(programId);

  const [serviceName] = Object.keys(idl?.services || {});
  const functions = idl?.services[serviceName].functions || {};
  // console.log('functions: ', functions);
  const functionNames = Object.keys(functions || {});
  const [defaultFunctionName] = functionNames;

  const [functionName, setFunctionName] = useState<string>();

  useEffect(() => {
    setFunctionName(defaultFunctionName);
  }, [defaultFunctionName]);

  useEffect(() => {
    if (!functionName) return;

    const getTypeDef = (typeDef: TypeDef) => {
      if (!sails) return;

      if (typeDef.isPrimitive) {
        // PrimitiveItem

        console.log('primitive');
      }

      if (typeDef.isEnum) {
        // EnumItem

        console.log('enum');

        typeDef.asEnum.variants.map((variant) => getTypeDef(variant.def));
      }

      if (typeDef.isStruct) {
        // StructItem

        console.log('struct');

        typeDef.asStruct.fields.map((field) => getTypeDef(field.def));
      }

      if (typeDef.isVec) {
        // VecItem

        console.log('vec');

        getTypeDef(typeDef.asVec.def);
      }

      if (typeDef.isOptional) {
        // OptionItem

        console.log('optional');

        getTypeDef(typeDef.asOptional.def);
      }

      if (typeDef.isResult) {
        // EnumItem

        console.log('result');

        // typeDef.asResult.ok.def;
        // typeDef.asResult.err.def;
      }

      if (typeDef.isMap) {
        // VecItem

        console.log('map');

        // typeDef.asMap.key.def;
        // typeDef.asMap.value.def;
      }

      if (typeDef.isFixedSizeArray) {
        // TupleItem

        console.log('fixedSizeArray');

        getTypeDef(typeDef.asFixedSizeArray.def);
      }

      if (typeDef.isUserDefined) {
        console.log('userDefined');

        const nestedTypeDef = sails.getTypeDef(typeDef.asUserDefined.name);

        getTypeDef(nestedTypeDef);
      }
    };

    // functions[functionName].args.map((arg) => getTypeDef(arg.typeDef));
  }, [functionName]);

  const renderFields = (args: ISailsFuncArg[]) =>
    args.map((arg) => {
      console.log('arg: ', arg);

      const { name, type, typeDef } = arg;

      if (typeDef.isEnum) {
        console.log(typeDef.asEnum);
      }

      if (typeDef.isStruct) {
        console.log(typeDef.asStruct);
      }

      if (typeDef.isStruct) {
        console.log();
      }

      if (typeDef.isEnum) {
        console.log();
      }

      if (typeDef.isOptional) {
        console.log();
      }

      if (typeDef.isPrimitive) {
        console.log();
      }

      if (typeDef.isResult) {
        console.log();
      }

      if (typeDef.isVec) {
        console.log();
      }

      if (typeDef.isMap) {
        console.log();
      }

      if (typeDef.isFixedSizeArray) {
        console.log();
      }

      if (typeDef.isUserDefined) {
        // console.log('user');
        // console.log(arg);

        const test = sails?.getTypeDef(typeDef.asUserDefined.name);

        // console.log(sails?.getTypeDef(typeDef.asUserDefined.name));
      }

      if (!typeDef.isPrimitive) return null;

      const label = `${name} (${type})`;

      return <Input key={label} direction="y" label={label} />;
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
