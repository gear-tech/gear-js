import { useCallback, useEffect, useRef, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { Formik, Form } from 'formik';
import { Metadata, createPayloadTypeStructure, decodeHexTypes } from '@gear-js/api';

import styles from './State.module.scss';
import { FormValues } from './types';
import { INITIAL_VALUES } from './const';

import { useApi, useAlert } from 'hooks';
import { getMetadata } from 'services';
import { getPreformattedText } from 'helpers';
import { FormPayload } from 'components/common/FormPayload';
import { preparePaylaod } from 'components/common/FormPayload/helpers';
import { Spinner } from 'components/blocks/Spinner/Spinner';
import { BackButton } from 'components/BackButton/BackButton';
import BackArrow from 'assets/images/arrow_back_thick.svg';

const State = () => {
  const { api } = useApi();
  const alert = useAlert();
  const navigate = useNavigate();
  const routeParams = useParams();

  const programId = routeParams.id as string;

  const metaBuffer = useRef<Buffer | null>(null);

  const [state, setState] = useState('');
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const types = metadata?.types;
  const stateInput = metadata?.meta_state_input;

  const disableLoading = () => {
    setIsLoading(false);
  };

  const resetState = () => {
    setIsLoading(true);
    setState('');
  };

  const readState = useCallback(
    (options?: object | string) => {
      if (metaBuffer.current) {
        resetState();

        api?.programState.read(programId as `0x${string}`, metaBuffer.current, options).then((result) => {
          const formattedState = result.toHuman();
          setState(getPreformattedText(formattedState));
          disableLoading();
        });
      }
    },
    [api, programId]
  );

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  const handleSubmit = ({ payload }: FormValues) => {
    const options = preparePaylaod(payload);

    if (options) {
      readState(options);
    } else {
      alert.error('Form is empty');
    }
  };

  const typeStructures = useMemo(() => {
    if (types && stateInput) {
      const decodedTypes = decodeHexTypes(types);

      return {
        manual: createPayloadTypeStructure(stateInput, decodedTypes, true),
        payload: createPayloadTypeStructure(stateInput, decodedTypes),
      };
    }
  }, [types, stateInput]);

  useEffect(() => {
    getMetadata(programId).then(({ result }) => {
      const parsedMeta = JSON.parse(result.meta) as Metadata;

      metaBuffer.current = Buffer.from(result.metaFile, 'base64');
      setMetadata(parsedMeta);
      disableLoading();
    });
  }, [programId]);

  useEffect(() => {
    if (metadata && !stateInput) {
      readState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata, stateInput]);

  return (
    <div className="wrapper">
      <header className={styles.header}>
        <BackButton />
        <h2 className={styles.heading}>Read state</h2>
      </header>
      <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
        <Form className={styles.form}>
          <div className={styles.block}>
            <div className={styles.item}>
              <p className={styles.itemCaption}>Program Id:</p>
              <p className={styles.itemValue}>{programId}</p>
            </div>
            {typeStructures?.payload && (
              <div className={styles.item}>
                <p className={clsx(styles.itemCaption, styles.top)}>Input Parameters:</p>
                <FormPayload name="payload" typeStructures={typeStructures} />
              </div>
            )}
            {state && (
              <div className={styles.item}>
                <p className={clsx(styles.itemCaption, styles.top)}>Statedata:</p>
                <pre className={styles.itemTextarea}>{state}</pre>
              </div>
            )}
            {isLoading && <Spinner />}
            <div className={styles.item}>
              <div className={styles.buttons}>
                <button className={styles.button} type="button" onClick={handleBackButtonClick}>
                  <img className={styles.buttonIcon} src={BackArrow} alt="Back arrow" />
                  <span className={styles.buttonText}>Back</span>
                </button>
                {stateInput && (
                  <button className={styles.button} type="submit">
                    <span className={styles.buttonText}>Read state</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default State;
