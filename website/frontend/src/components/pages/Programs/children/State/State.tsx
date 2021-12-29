import React, { useEffect, useState, VFC } from 'react';
import { FormItem } from 'components/FormItem';
import { ParsedShape, parseMeta } from 'utils/meta-parser';
import { getTypeStructure, Metadata, parseHexTypes, ProgramId } from '@gear-js/api';
import { Formik, Form, Field } from 'formik';
import BackArrow from 'assets/images/arrow_back_thick.svg';
import styles from './State.module.scss';

type Props = {
  programId: string;
  metadata: Metadata;
};

const State: VFC<Props> = ({ metadata, programId }) => {
  const [form, setForm] = useState<ParsedShape | null>(null);
  const { types, meta_state_input: metaStateInput } = metadata;

  useEffect(() => {
    if (metaStateInput) {
      const parsedTypes = parseHexTypes(types!);
      const typeStructure = getTypeStructure(metaStateInput, parsedTypes);
      const parsedStructure = parseMeta(typeStructure);
      setForm(parsedStructure);
    }
  }, [metaStateInput, types]);

  return (
    <div className="wrapper">
      <header className={styles.header}>
        <button className={styles.arrowButton} type="button" aria-label="back" />
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
                <p className="block__caption block__caption--small">Program ID:</p>
                <p className="block__field">{programId}</p>
              </div>
              <div className="block__item">
                <p className="block__caption block__caption--small">Input Parameters:</p>
                <FormItem data={form} />
              </div>
              <div className="block__item">
                <div className="block__button">
                  <button className="block__button-elem" type="button">
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
