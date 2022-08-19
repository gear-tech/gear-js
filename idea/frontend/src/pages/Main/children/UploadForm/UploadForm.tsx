import { Button } from '@gear-js/ui';

import { FormWrapper } from '../FormWrapper';

import { useProgramUpload, useGasCalculate } from 'hooks';
import { readFileAsync } from 'helpers';
import { GasMethod } from 'consts';
import { Payload } from 'hooks/useProgramUplaod/types';
import { ProgramForm, Helpers, PropsToRenderButtons } from 'components/blocks/ProgramForm';
import { useAlert } from '@gear-js/react-hooks';

type Props = {
  droppedFile: File;
  onReset: () => void;
};

const UploadForm = ({ droppedFile, onReset }: Props) => {
  const alert = useAlert();

  const calculateGas = useGasCalculate();
  const { uploadProgram } = useProgramUpload();

  const handleSubmit = (payload: Payload, helpers: Helpers) =>
    uploadProgram({
      file: droppedFile,
      payload,
      reject: helpers.finishSubmitting,
      resolve: onReset,
    });

  const handleCalculateGas = async ({ values, metadata, setFieldValue }: PropsToRenderButtons) => {
    try {
      const fileBuffer = (await readFileAsync(droppedFile)) as ArrayBuffer;
      const code = Buffer.from(new Uint8Array(fileBuffer));

      const gasLimit = await calculateGas(GasMethod.InitUpdate, values, code, metadata);

      setFieldValue('gasLimit', gasLimit);
    } catch (error) {
      const message = (error as Error).message;

      alert.error(message);
    }
  };

  const renderButtons = (props: PropsToRenderButtons) => (
    <>
      <Button type="submit" text="Upload program" disabled={props.isDisabled} />
      <Button text="Calculate Gas" onClick={() => handleCalculateGas(props)} disabled={props.isDisabled} />
      <Button type="reset" text="Cancel upload" color="transparent" />
    </>
  );

  return (
    <FormWrapper header="Uplaod new program">
      <ProgramForm
        name={droppedFile.name}
        label="File"
        onSubmit={handleSubmit}
        onReset={onReset}
        renderButtons={renderButtons}
      />
    </FormWrapper>
  );
};

export { UploadForm };
