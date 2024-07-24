import { useApi } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';

import { useContractApiWithFile, useProgramActions } from '@/hooks';
import { Subheader } from '@/shared/ui/subheader';
import { GasMethod } from '@/shared/config';
import { Values } from '@/hooks/useProgramActions/types';
import { ProgramForm, SailsProgramForm, SubmitHelpers } from '@/widgets/programForm';
import { useWasmFile } from '@/features/code';
import { ProgramFileInput } from '@/features/program';
import { UploadMetadata } from '@/features/uploadMetadata';
import { BackButton, Box } from '@/shared/ui';
import PlusSVG from '@/shared/assets/images/actions/plus.svg?react';

import styles from './UploadProgram.module.scss';

const UploadProgram = () => {
  const { api, isApiReady } = useApi();
  const wasmFile = useWasmFile();
  const { metadata, sails, isLoading, ...contractApi } = useContractApiWithFile(wasmFile.buffer);
  const uploadProgram = useProgramActions();

  const reset = () => {
    wasmFile.reset();
    contractApi.reset();
  };

  const handleWasmFileChange = (value: File | undefined) => {
    contractApi.reset();
    wasmFile.handleChange(value);
  };

  const handleSubmit = (values: Values, { enableButtons }: SubmitHelpers) => {
    if (!isApiReady) throw new Error('API is not initialized');
    if (!wasmFile.buffer) throw new Error('File is not found');

    const { gasLimit, value, payload: initPayload, payloadType, keepAlive } = values;
    const program = { code: wasmFile.buffer, value, gasLimit, initPayload, keepAlive };
    const result = api.program.upload(program, metadata.value, payloadType);

    uploadProgram(result, { metadata, sails }, values, reset, enableButtons);
  };

  return (
    <div className={styles.container}>
      <section>
        <Subheader size="big" title="Enter program parameters" className={styles.header}>
          {wasmFile.value && <ProgramFileInput value={wasmFile.value} onChange={handleWasmFileChange} />}
        </Subheader>

        {!wasmFile.value && (
          <Box>
            <ProgramFileInput value={wasmFile.value} onChange={handleWasmFileChange} />
          </Box>
        )}

        <div className={styles.program}>
          {wasmFile.buffer && !sails.value && (
            <ProgramForm
              fileName={wasmFile.value?.name.split(/\.opt|\.wasm/)[0]}
              source={wasmFile.buffer}
              metadata={metadata.value}
              gasMethod={GasMethod.InitUpdate}
              onSubmit={handleSubmit}
            />
          )}

          {wasmFile.buffer && sails.value && sails.idl && (
            <SailsProgramForm
              fileName={wasmFile.value?.name.split(/\.opt|\.wasm/)[0]}
              source={wasmFile.buffer}
              sails={sails.value}
              idl={sails.idl}
              gasMethod={GasMethod.InitUpdate}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </section>

      <section>
        <Subheader size="big" title="Add metadata/sails" />

        <UploadMetadata
          value={contractApi.file}
          onChange={contractApi.handleChange}
          metadata={metadata.value}
          sails={sails.value}
          isDisabled={contractApi.isFromStorage}
          isLoading={isLoading}
        />
      </section>

      {wasmFile.buffer && (
        <div className={styles.buttons}>
          <BackButton />
          <Button type="submit" icon={PlusSVG} text="Submit" size="large" />
        </div>
      )}
    </div>
  );
};

export { UploadProgram };
