import { useCallback, useEffect, useRef, useState, VFC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { useAlert } from 'react-alert';
import { Formik, Form } from 'formik';
import { Metadata, createPayloadTypeStructure, decodeHexTypes } from '@gear-js/api';

import styles from './State.module.scss';

import { useApi } from 'hooks';
import { getMetadata } from 'services';
import { getPreformattedText } from 'helpers';
import { cloneDeep } from 'features/Editor/EditorTree/utils';
import { Spinner } from 'components/blocks/Spinner/Spinner';
import { FormPayload } from 'components/blocks/FormPayload/FormPayload';
import { BackButton } from 'components/BackButton/BackButton';
import { MetaFieldsStruct, MetaFieldsValues, parseMeta, prepareToSend } from 'components/MetaFields';
import BackArrow from 'assets/images/arrow_back_thick.svg';

type FormValues = { __root: MetaFieldsValues | null; payload: string };

const State: VFC = () => {
  const { api } = useApi();
  const alert = useAlert();
  const navigate = useNavigate();
  const routeParams = useParams();

  const programId = routeParams.id as string;

  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    getMetadata(programId).then(({ result }) => {
      const parsedMeta = JSON.parse(result.meta) as Metadata;

      metaBuffer.current = Buffer.from(result.metaFile, 'base64');
      setMetadata(parsedMeta);
      disableLoading();
    });
  }, [programId]);

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
