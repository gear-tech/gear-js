import { Hex } from '@gear-js/api';
import { Button, FileInput } from '@gear-js/ui';
import { ChangeEvent, useEffect } from 'react';
import { generatePath, useParams } from 'react-router-dom';
import clsx from 'clsx';

import { useStateRead } from 'hooks';
import { getSubmitPayload } from 'features/formPayload';
import { ReactComponent as ReadSVG } from 'shared/assets/images/actions/read.svg';
import { ReactComponent as ApplySVG } from 'shared/assets/images/actions/apply.svg';
import { BackButton } from 'shared/ui/backButton';
import { UILink } from 'shared/ui/uiLink';
import { resetFileInput } from 'shared/helpers';

import { useMetadataAndStates, useStateSelection, useStateType } from '../hooks';
import { FormValues } from '../model';
import { Functions } from './functions';
import { StateForm } from './stateForm';
import styles from './State.module.scss';

type Params = { programId: Hex };

const State = () => {
  const { programId } = useParams() as Params;

  const { readFullState, readWasmState, resetState, state, isStateRead, isState } = useStateRead(programId);
  const { stateType, isFullState, isWasmState, isStateTypeSelection } = useStateType();
  const { metadata, states, isEachStateReady, searchStates, uploadState } = useMetadataAndStates(programId);
  const { functionId, payloadFormValues, wasmBuffer, selectState, selectFunction } = useStateSelection(metadata);

  const className = clsx(styles.state, isWasmState && styles.stateWasm);
  const isLoading = !metadata || (!!functionId && !wasmBuffer);

  useEffect(() => {
    if (isFullState && metadata) readFullState(metadata);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFullState, metadata]);

  useEffect(() => {
    resetState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [functionId]);

  useEffect(() => {
    resetState();
    selectState(undefined);
    selectFunction('');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateType]);

  const handleSubmit = ({ payload }: FormValues) => {
    if (wasmBuffer) readWasmState(wasmBuffer, functionId, getSubmitPayload(payload));
  };

  const handleWasmInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const [file] = target.files || [];

    if (file) uploadState(file).then(() => resetFileInput(target));
  };

  return (
    <div className={className}>
      <h2 className={styles.heading}>Read state</h2>

      <div className={styles.form}>
        <StateForm
          programId={programId}
          state={state}
          payloadFormValues={payloadFormValues}
          isLoading={isLoading}
          isStateRead={isStateRead}
          isState={isState}
          onSubmit={handleSubmit}
          onPayloadChange={resetState}
        />

        {isStateTypeSelection && <h3 className={styles.buttonsHeading}>Choose how to read state:</h3>}

        <div className={styles.buttons}>
          {isStateTypeSelection && (
            <>
              <UILink
                to={generatePath('/state/full/:programId', { programId })}
                text="Read full state"
                color="secondary"
                size="large"
                icon={ReadSVG}
              />
              <UILink
                to={generatePath('/state/wasm/:programId', { programId })}
                text="Read state using wasm"
                color="secondary"
                size="large"
                icon={ApplySVG}
              />
            </>
          )}

          {isWasmState && (
            <>
              {functionId && (
                <Button
                  type="submit"
                  form="state"
                  color="secondary"
                  text="Read State"
                  icon={ReadSVG}
                  size="large"
                  disabled={isLoading}
                />
              )}

              {/* TODO: remove after @gear-js/ui update */}
              {/* @ts-ignore */}
              <FileInput size="large" color="secondary" className={styles.wasmInput} onChange={handleWasmInputChange} />
            </>
          )}

          <BackButton />
        </div>
      </div>

      {isWasmState && (
        <Functions
          list={states}
          value={functionId}
          isReady={isEachStateReady}
          onStateChange={selectState}
          onFunctionChange={selectFunction}
          onSearchSubmit={searchStates}
        />
      )}
    </div>
  );
};

export { State };
