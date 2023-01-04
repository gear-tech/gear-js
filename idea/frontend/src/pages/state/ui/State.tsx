import { Hex } from '@gear-js/api';
import { Button, FileInput, Input } from '@gear-js/ui';
import { useEffect } from 'react';
import { generatePath, useParams } from 'react-router-dom';
import clsx from 'clsx';

import { useStateRead } from 'hooks';
import { getSubmitPayload } from 'features/formPayload';
import { ReactComponent as ReadSVG } from 'shared/assets/images/actions/read.svg';
import { ReactComponent as ApplySVG } from 'shared/assets/images/actions/apply.svg';
import { BackButton } from 'shared/ui/backButton';
import { UILink } from 'shared/ui/uiLink';

import { useMetadataAndStates, useStateSelection, useStateType, useStateWasm } from '../hooks';
import { FormValues } from '../model';
import { Functions } from './functions';
import { StateForm } from './stateForm';
import styles from './State.module.scss';

type Params = { programId: Hex };

const State = () => {
  const { programId } = useParams() as Params;

  const { stateType, isFullState, isWasmState, isStateTypeSelection } = useStateType();
  const { metadata, states } = useMetadataAndStates(programId);
  const { selectedStateId, functionId, selectState, selectFunction, payloadFormValues } = useStateSelection(metadata);
  const { wasmBuffer, uploadWasmBuffer } = useStateWasm(programId, selectedStateId);
  const { readFullState, readWasmState, resetState, state, isStateRead, isState } = useStateRead(programId);

  const className = clsx(styles.state, isWasmState && styles.stateWasm);

  useEffect(() => {
    if (isFullState && metadata) readFullState(metadata);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFullState, metadata]);

  useEffect(() => {
    resetState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateType]);

  const handleSubmit = ({ payload }: FormValues) => {
    if (wasmBuffer) readWasmState(wasmBuffer, functionId, getSubmitPayload(payload));
  };

  const isLoading = !metadata;

  return (
    <div className={className}>
      <h2 className={styles.heading}>Read state</h2>

      {isWasmState && <Input type="search" placeholder="Search by function name" />}

      <div>
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
              <Button type="submit" form="state" text="Read" size="large" />
              <FileInput size="large" color="primary" onChange={uploadWasmBuffer} />
            </>
          )}

          <BackButton />
        </div>
      </div>

      {isWasmState && (
        <Functions list={states} value={functionId} onStateChange={selectState} onFunctionChange={selectFunction} />
      )}
    </div>
  );
};

export { State };
