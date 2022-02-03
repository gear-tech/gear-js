import React, { useCallback, useEffect, useRef, useState, VFC } from 'react';
import { FormItem } from 'components/FormItem';
import clsx from 'clsx';
import { ParsedShape, parseMeta } from 'utils/meta-parser';
import { getTypeStructure, getWasmMetadata, Metadata, parseHexTypes } from '@gear-js/api';
import { Formik, Form } from 'formik';
import { Spinner } from 'components/blocks/Spinner/Spinner';
import BackArrow from 'assets/images/arrow_back_thick.svg';
import { useHistory, useParams } from 'react-router-dom';
import { AddAlert, getProgramAction, resetProgramAction } from 'store/actions/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/reducers';
import { useApi } from 'hooks/useApi';
import { EventTypes } from 'types/events';
import styles from './State.module.scss';

type Params = { id: string };
const selectProgram = (state: RootState) => state.programs.program;

const State: VFC = () => {
  const [api] = useApi();
  const dispatch = useDispatch();
  const routeParams = useParams<Params>();
  const routeHistory = useHistory();
  const [isLoading, setIsLoading] = useState(true);

  const programId = routeParams.id;
  const program = useSelector(selectProgram);

  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const metaBuffer = useRef<Buffer | null>(null);
  const types = metadata?.types;
  const stateInput = metadata?.meta_state_input;

  const [form, setForm] = useState<ParsedShape | null>(null);
  const [state, setState] = useState('');

  useEffect(() => {
    dispatch(getProgramAction(programId));
    return () => {
      dispatch(resetProgramAction());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (metadata || state) {
      setIsLoading(false);
    }
  }, [metadata, state]);

  useEffect(() => {
    const metaFile = program?.meta?.metaFile;

    if (metaFile) {
      metaBuffer.current = Buffer.from(metaFile, 'base64');
      getWasmMetadata(metaBuffer.current).then(setMetadata);
    }
  }, [program]);

  const getPayloadForm = useCallback(() => {
    if (stateInput && types) {
      const parsedTypes = parseHexTypes(types);
      const typeStructure = getTypeStructure(stateInput, parsedTypes);
      const parsedStructure = parseMeta(typeStructure);
      setForm(parsedStructure);
    }
  }, [stateInput, types]);

  const readState = useCallback(
    (options?: object) => {
      if (metaBuffer.current) {
        setIsLoading(true);

        api?.programState.read(programId as `0x${string}`, metaBuffer.current, options).then((result) => {
          const decodedState = result.toHuman();
          const stringifiedState = JSON.stringify(decodedState, null, 2);
          setState(stringifiedState);
        });
      }
    },
    [api, programId]
  );

  useEffect(() => {
    if (metadata) {
      if (stateInput) {
        getPayloadForm();
      } else {
        readState();
      }
    }
  }, [metadata, stateInput, getPayloadForm, readState]);

  const handleBackButtonClick = () => {
    routeHistory.goBack();
  };

  const handleSubmit = (value: { fields: object }) => {
    const { fields } = value;
    const [options] = Object.values(fields);

    if (options) {
      readState(options);
    } else {
      const alert = { type: EventTypes.ERROR, message: 'Form is empty' };
      dispatch(AddAlert(alert));
    }
  };

  return (
    <div className="wrapper">
      <header className={styles.header}>
        <button className={styles.arrowButton} type="button" aria-label="back" onClick={handleBackButtonClick} />
        <h2 className={styles.heading}>Read state</h2>
      </header>
      <Formik initialValues={{ fields: {} }} onSubmit={handleSubmit}>
        <Form className={styles.form}>
          <div className={styles.block}>
            <div className={styles.item}>
              <p className={styles.itemCaption}>Program Id:</p>
              <p className={styles.itemValue}>{programId}</p>
            </div>
            {form && (
              <div className={styles.item}>
                <p className={clsx(styles.itemCaption, styles.top)}>Input Parameters:</p>
                <div className={styles.formWrapper}>
                  <FormItem data={form} />
                </div>
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
