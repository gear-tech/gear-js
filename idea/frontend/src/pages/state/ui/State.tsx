import { Hex, ProgramMetadata, getProgramMetadata } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { Input } from '@gear-js/ui';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { fetchMetadata, getLocalProgramMeta, fetchStates } from 'api';
import { useChain } from 'hooks';
import { StateForm } from 'widgets/stateForm';

import { IState } from '../model';
import { Functions } from './functions';
import styles from './State.module.scss';

type Params = { programId: Hex };

const State = () => {
  const alert = useAlert();
  const { programId } = useParams() as Params;

  const [metadata, setMetadata] = useState<ProgramMetadata>();
  const [states, setStates] = useState<IState[]>();

  const { isDevChain } = useChain();
  const getMetadata = isDevChain ? getLocalProgramMeta : fetchMetadata;

  useEffect(() => {
    Promise.all([getMetadata(programId), fetchStates(programId)])
      .then(([{ result: metaResult }, { result: statesResult }]) => {
        setMetadata(getProgramMetadata(metaResult.hex));
        setStates(statesResult.states);
      })
      .catch(({ message }: Error) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programId]);

  const isLoading = !metadata;

  return (
    <div className={styles.state}>
      <h2 className={styles.heading}>Read state</h2>
      <Input type="search" placeholder="Search by function name" />
      <StateForm meta={metadata} programId={programId} isLoading={isLoading} />
      <Functions list={states} />
    </div>
  );
};

export { State };
