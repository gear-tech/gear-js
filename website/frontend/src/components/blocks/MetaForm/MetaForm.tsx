import React, { useCallback, useRef, useState, VFC } from 'react';
import { useDispatch } from 'react-redux';
import { Field, Form, Formik } from 'formik';
import clsx from 'clsx';
import { fileNameHandler } from 'helpers';
import { MetaModel } from 'types/program';
import { uploadMetaStartAction } from 'store/actions/actions';
import { SocketService } from 'services/SocketService';
import cancel from 'assets/images/cancel.svg';
import deselected from 'assets/images/radio-deselected.svg';
import selected from 'assets/images/radio-selected.svg';
import { Schema } from './Schema';
import './MetaForm.scss';

type Props = {
  programHash: string;
  programName: string;
  socketService: SocketService;
  handleClose: () => void;
};

export const MetaForm: VFC<Props> = ({ programHash, programName, socketService, handleClose }) => {
  const dispatch = useDispatch();

  const [isMetaByFile, setIsMetaByFile] = useState(false);
  const [droppedMetaFile, setDroppedMetaFile] = useState<File | null>(null);
  const [wrongMetaFormat, setWrongMetaFormat] = useState(false);

  const metaFieldRef = useRef<any>(null);

  if (wrongMetaFormat) {
    setTimeout(() => setWrongMetaFormat(false), 3000);
  }

  const mapInitialValues = () => ({
    incomingType: '',
    expectedType: '',
    meta: null,
  });

  const removeMetaFile = () => {
    setDroppedMetaFile(null);
  };

  const uploadMetaFile = () => {
    metaFieldRef.current?.click();
  };

  const handleFilesUpload = useCallback(
    (file) => {
      setDroppedMetaFile(file);
    },
    [setDroppedMetaFile]
  );

  const checkFileFormat = useCallback((files: any) => {
    // eslint-disable-next-line no-console
    if (typeof files[0]?.name === 'string') {
      const fileExt: string = files[0].name.split('.').pop().toLowerCase();
      return fileExt !== 'wasm';
    }
    return true;
  }, []);

  const handleMetaInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (files?.length) {
      const isCorrectFormat = checkFileFormat(files);
      setWrongMetaFormat(isCorrectFormat);
      if (!isCorrectFormat) {
        handleFilesUpload(files[0]);
      }
    }
  };

  const handleTypeChange = (value: boolean) => {
    if (!value) {
      setDroppedMetaFile(null);
    }
    setIsMetaByFile(value);
  };

  return (
    <Formik
      initialValues={mapInitialValues()}
      validationSchema={Schema}
      validateOnBlur
      onSubmit={(values: MetaModel) => {
        socketService.sendMetaToProgram({ ...values }, programName, programHash);
        dispatch(uploadMetaStartAction());
      }}
      onReset={handleClose}
    >
      {({ errors, touched }) => (
        <Form id="meta-form">
          <div className="meta-form--wrapper">
            <div className="meta-form--col">
              <div className="meta-form--info">
                <span>File:</span>
                <span>{fileNameHandler(programName)}</span>
              </div>
              <div className="meta-form--info">
                <p className="meta-form__field">Metadata: </p>
                <div className="meta-form--switch-btns">
                  <button type="button" className="meta-form--switch-btns__btn" onClick={() => handleTypeChange(false)}>
                    <img src={isMetaByFile ? deselected : selected} alt="radio" />
                    Manual input
                  </button>
                  <button type="button" className="meta-form--switch-btns__btn" onClick={() => handleTypeChange(true)}>
                    <img src={isMetaByFile ? selected : deselected} alt="radio" />
                    Upload file
                  </button>
                </div>
              </div>
              {(isMetaByFile && (
                <div className="meta-form--info">
                  <label className="meta-form__field" htmlFor="meta">
                    Upload file:{' '}
                  </label>
                  <Field
                    id="meta"
                    name="meta"
                    className="is-hidden"
                    type="file"
                    onChange={handleMetaInputChange}
                    innerRef={metaFieldRef}
                  />
                  {(droppedMetaFile && (
                    <div className="meta-form__filename meta-form__value">
                      {droppedMetaFile.name.replace(`.${droppedMetaFile.name.split('.').pop()}`, '')}.
                      {droppedMetaFile.name.split('.').pop()}
                      <button type="button" onClick={removeMetaFile}>
                        <img alt="cancel" src={cancel} />
                      </button>
                    </div>
                  )) || (
                    <button className="meta-form--file-btn" type="button" onClick={uploadMetaFile}>
                      Select file
                    </button>
                  )}
                </div>
              )) || (
                <>
                  <div className="meta-form--info">
                    <label htmlFor="incomingType" className="meta-form__field">
                      Incoming type:
                    </label>
                    <div className="meta-form__field-wrapper">
                      <Field
                        id="incomingType"
                        name="incomingType"
                        type="text"
                        className={clsx('', errors.incomingType && touched.incomingType && 'meta-form__input-error')}
                      />
                      {errors.incomingType && touched.incomingType ? (
                        <div className="meta-form__error">{errors.incomingType}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="meta-form--info">
                    <label htmlFor="expectedType" className="meta-form__field">
                      Expected type:
                    </label>
                    <div className="meta-form__field-wrapper">
                      <Field
                        id="expectedType"
                        name="expectedType"
                        type="text"
                        className={clsx('', errors.expectedType && touched.expectedType && 'meta-form__input-error')}
                      />
                      {errors.expectedType && touched.expectedType ? (
                        <div className="meta-form__error">{errors.expectedType}</div>
                      ) : null}
                    </div>
                  </div>
                </>
              )}
              <button className="meta-form__button" type="submit">
                Upload program
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};
