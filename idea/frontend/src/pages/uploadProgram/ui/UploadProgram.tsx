import { useApi } from '@gear-js/react-hooks';
import { FileInput } from '@gear-js/ui';
import cx from 'clsx';

import { useContractApiWithFile, useProgramActions } from '@/hooks';
import { formStyles } from '@/shared/ui/form';
import { Subheader } from '@/shared/ui/subheader';
import { FileTypes, GasMethod } from '@/shared/config';
import { Values } from '@/hooks/useProgramActions/types';
import { ProgramForm, SailsProgramForm, SubmitHelpers } from '@/widgets/programForm';
import { useWasmFile } from '@/features/code';
import { UploadMetadata } from '@/features/uploadMetadata';
import { Box } from '@/shared/ui';

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
        <Subheader size="big" title="Enter program parameters" />

        <div className={styles.program}>
          <Box>
            <FileInput
              value={wasmFile.value}
              label="Program file"
              direction="y"
              color="primary"
              className={cx(formStyles.field, formStyles.gap16)}
              onChange={handleWasmFileChange}
              accept={FileTypes.Wasm}
            />
          </Box>

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
    </div>
  );
};

export { UploadProgram };
