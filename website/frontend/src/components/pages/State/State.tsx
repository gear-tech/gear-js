import React, { useCallback, useEffect, useRef, useState, VFC } from 'react';
import { FormItem } from 'components/FormItem';
import { ParsedShape, ParsedStruct, parseMeta } from 'utils/meta-parser';
import { getTypeStructure, getWasmMetadata, Metadata, parseHexTypes } from '@gear-js/api';
import { Formik, Form } from 'formik';
import BackArrow from 'assets/images/arrow_back_thick.svg';
import { useHistory, useParams } from 'react-router-dom';
import { getProgramAction, resetProgramAction } from 'store/actions/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/reducers';
import { useApi } from 'hooks/useApi';
import { Loader } from 'react-feather';
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

  // TODO: type
  const readState = useCallback(
    (options?: any) => {
      if (metaBuffer.current) {
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

  useEffect(() => {
    if (metadata || state) setIsLoading(false);
  }, [metadata, state]);

  const handleBackButtonClick = () => {
    routeHistory.goBack();
  };

  const handleSubmit = (value: { fields: ParsedStruct }) => {
    setIsLoading(true);
    const { fields } = value;
    const [options] = Object.values(fields);
    readState(options);
  };

  return (
    <div className="wrapper">
      <header className={styles.header}>
        <button className={styles.arrowButton} type="button" aria-label="back" onClick={handleBackButtonClick} />
        <h2 className={styles.heading}>Read state</h2>
      </header>
      {/* TODO: init values */}
      <Formik initialValues={{ fields: {} }} onSubmit={handleSubmit}>
        <Form className={`block ${styles.form}`}>
          <div className="block__wrapper">
            <div className="block__item">
              <p className="block__caption block__caption--small">Program Id:</p>
              <p className="block__field">{programId}</p>
            </div>
            {form && (
              <div className="block__item">
                <p className="block__caption block__caption--small">Input Parameters:</p>
                <FormItem data={form} />
              </div>
            )}
            {state && (
              <div className="block__item">
                <p className="block__caption block__caption--small">Statedata:</p>
                <pre className="block__textarea block__textarea_h420">{state}</pre>
              </div>
            )}
            {isLoading && <Loader color="white" className="animation-rotate" />}
            <div className="block__item">
              <div className="block__button">
                <button className="block__button-elem" type="button" onClick={handleBackButtonClick}>
                  <img className="block__button-icon" src={BackArrow} alt="Back arrow" />
                  <span className="block__button-text">Back</span>
                </button>
                <button className="block__button-elem block__button-elem--submit" type="submit">
                  <span className="block__button-text">Read state</span>
                </button>
              </div>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default State;
