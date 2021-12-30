import React, { useEffect, useState, VFC } from 'react';
import { FormItem } from 'components/FormItem';
import { ParsedShape, parseMeta } from 'utils/meta-parser';
import { getTypeStructure, getWasmMetadata, Metadata, parseHexTypes } from '@gear-js/api';
import { Formik, Form } from 'formik';
import BackArrow from 'assets/images/arrow_back_thick.svg';
import { useHistory, useParams } from 'react-router-dom';
import { getProgramAction, resetProgramAction } from 'store/actions/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/reducers';
import styles from './State.module.scss';

type Params = { id: string };
const selectProgram = (state: RootState) => state.programs.program;

const State: VFC = () => {
  const dispatch = useDispatch();
  const routeParams = useParams<Params>();
  const routeHistory = useHistory();

  const programId = routeParams.id;
  const program = useSelector(selectProgram);
  const [metadata, setMetadata] = useState<Metadata | null>(null);

  const types = metadata?.types;
  const metaStateInput = metadata?.meta_state_input;

  const [form, setForm] = useState<ParsedShape | null>(null);

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
      const metaBuffer = Buffer.from(metaFile, 'base64');
      getWasmMetadata(metaBuffer).then(setMetadata);
    }
  }, [program]);

  useEffect(() => {
    if (metaStateInput) {
      const parsedTypes = parseHexTypes(types!);
      const typeStructure = getTypeStructure(metaStateInput, parsedTypes);
      const parsedStructure = parseMeta(typeStructure);
      setForm(parsedStructure);
    }
  }, [metaStateInput, types]);

  const handleBackButtonClick = () => {
    routeHistory.goBack();
  };

  return (
    <div className="wrapper">
      <header className={styles.header}>
        <button className={styles.arrowButton} type="button" aria-label="back" onClick={handleBackButtonClick} />
        <h2 className={styles.heading}>Read state</h2>
      </header>
      <Formik
        initialValues={{ fields: {} }}
        onSubmit={(event) => {
          console.log(event);
        }}
      >
        {form && (
          <Form className={`block ${styles.form}`}>
            <div className="block__wrapper">
              <div className="block__item">
                <p className="block__caption block__caption--small">Program Id:</p>
                <p className="block__field">{programId}</p>
              </div>
              <div className="block__item">
                <p className="block__caption block__caption--small">Input Parameters:</p>
                <FormItem data={form} />
              </div>
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
        )}
      </Formik>
    </div>
  );
};

export default State;
