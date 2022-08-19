import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Hex } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';

import { Params } from './types';

import { useProgramActions, useGasCalculate } from 'hooks';
import { GasMethod } from 'consts';
import { getShortName } from 'helpers';
import { getCode } from 'services';
import { CodeModel } from 'types/code';
import { Payload } from 'hooks/useProgramActions/types';
import { Box } from 'layout/Box/Box';
import { PageHeader } from 'components/blocks/PageHeader';
import { Spinner } from 'components/common/Spinner/Spinner';
import { ProgramForm, PropsToRenderButtons, Helpers } from 'components/blocks/ProgramForm';

const Code = () => {
  const alert = useAlert();
  const { codeId } = useParams() as Params;

  const [code, setCode] = useState<CodeModel>();

  const calculateGas = useGasCalculate();
  const { createProgram } = useProgramActions();

  const handleSubmit = (payload: Payload, { resetForm, finishSubmitting }: Helpers) =>
    createProgram({
      payload,
      codeId: codeId as Hex,
      reject: finishSubmitting,
      resolve: resetForm,
    });

  const handleCalculateGas = async ({ values, metadata, setFieldValue }: PropsToRenderButtons) => {
    try {
      const gasLimit = await calculateGas(GasMethod.InitCreate, values, codeId as Hex, metadata);

      setFieldValue('gasLimit', gasLimit);
    } catch (error) {
      const message = (error as Error).message;

      alert.error(message);
    }
  };

  const renderButtons = (props: PropsToRenderButtons) => (
    <>
      <Button type="submit" text="Create program" disabled={props.isDisabled} />
      <Button text="Calculate Gas" onClick={() => handleCalculateGas(props)} disabled={props.isDisabled} />
    </>
  );

  useEffect(() => {
    getCode(codeId)
      .then(({ result }) => setCode(result))
      .catch((error) => alert.error(error.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="wrapper">
      <PageHeader title="Create program" fileName={codeId} />
      {code ? (
        <Box>
          <ProgramForm
            name={getShortName(codeId)}
            label="Code ID"
            renderButtons={renderButtons}
            onSubmit={handleSubmit}
          />
        </Box>
      ) : (
        <Spinner absolute />
      )}
    </div>
  );
};

export { Code };
