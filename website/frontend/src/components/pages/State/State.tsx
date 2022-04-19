import React, { useCallback, useEffect, useRef, useState, VFC } from 'react';
import { useAlert } from 'react-alert';
import clsx from 'clsx';
import { MetaFieldsStruct, MetaFieldsValues, parseMeta, prepareToSend } from 'components/MetaFields';
import { Metadata, getWasmMetadata, createPayloadTypeStructure, decodeHexTypes } from '@gear-js/api';
import { Formik, Form } from 'formik';
import { Spinner } from 'components/blocks/Spinner/Spinner';
import BackArrow from 'assets/images/arrow_back_thick.svg';
import { useNavigate, useParams } from 'react-router-dom';
import { useApi } from 'hooks';
import { FormPayload } from 'components/blocks/FormPayload/FormPayload';
import { BackButton } from 'components/BackButton/BackButton';
import { getPreformattedText } from 'helpers';
import { ProgramModel } from 'types/program';
import { getProgram } from 'services';
import styles from './State.module.scss';
import { cloneDeep } from '../../../features/Editor/EditorTree/utils';

type FormValues = { __root: MetaFieldsValues | null; payload: string };

const State: VFC = () => {
  const { api } = useApi();
  const alert = useAlert();
  const routeParams = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const programId = routeParams.id as string;
  const [program, setProgram] = useState<ProgramModel>();

  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const metaBuffer = useRef<Buffer | null>(null);
  const types = metadata?.types;
  const stateInput = metadata?.meta_state_input;

  const [typeStructure, setTypeStructure] = useState({});
  const [form, setForm] = useState<MetaFieldsStruct | null>(null);
  const [state, setState] = useState('');
  const [isManualInput, setIsManualInput] = useState(false);
  const initValues = useRef<{ payload: string; __root: MetaFieldsValues | null }>({
    payload: typeStructure ? getPreformattedText(typeStructure) : '',
    __root: null,
  });

  const disableLoading = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    getProgram(programId).then(({ result }) => setProgram(result));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const metaFile = program?.meta?.metaFile;

    if (metaFile) {
      metaBuffer.current = Buffer.from(metaFile, 'base64');
      getWasmMetadata(metaBuffer.current).then((result) => {
        setMetadata(result);
        disableLoading();
      });
    }
  }, [program]);

  const getPayloadForm = useCallback(() => {
    if (stateInput && types) {
      const decodedTypes = decodeHexTypes(types);
      const typeStruct = createPayloadTypeStructure(stateInput, decodedTypes, true);
      const parsedStruct = parseMeta(typeStruct);
      setTypeStructure(typeStruct);
      setForm(parsedStruct);
    }
  }, [stateInput, types]);

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
    navigate(-1);
  };

  const handleSubmit = ({ __root, payload }: FormValues) => {
    if (__root) {
      const options = isManualInput ? payload : prepareToSend(cloneDeep(__root));

      if (options) {
        readState(options);
      } else {
        alert.error('Form is empty');
      }
    }
  };

  const handleManalSwitch = (val: boolean) => {
    setIsManualInput(val);
    initValues.current = {
      payload: typeStructure ? getPreformattedText(typeStructure) : '',
      __root: form ? form.__values : null,
    };
  };

  return (
    <div className="wrapper">
      <header className={styles.header}>
        <BackButton />
        <h2 className={styles.heading}>Read state</h2>
      </header>
      <Formik initialValues={initValues.current} onSubmit={handleSubmit} enableReinitialize>
        <Form className={styles.form}>
          <div className={styles.block}>
            <div className={styles.item}>
              <p className={styles.itemCaption}>Program Id:</p>
              <p className={styles.itemValue}>{programId}</p>
            </div>
            {form && (
              <div className={styles.item}>
                <p className={clsx(styles.itemCaption, styles.top)}>Input Parameters:</p>
                <FormPayload
                  className={styles.formWrapper}
                  isManualInput={isManualInput}
                  setIsManualInput={handleManalSwitch}
                  formData={form}
                />
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
