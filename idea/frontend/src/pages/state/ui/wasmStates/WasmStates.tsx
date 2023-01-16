import { useForm } from '@mantine/form';
import { Button, Input } from '@gear-js/ui';

import { IState } from 'pages/state/model';
import { Box } from 'shared/ui/box';

import { Functions } from '../functions';
import { FunctionsPlaceholder } from '../functionsPlaceholder/FunctionsPlaceholder';
import { ExpansionPanel } from '../expansionPanel';
import styles from './WasmStates.module.scss';

type Props = {
  uploadedStates: IState[];
  fileFunctions: string[] | undefined;
  value: string;
  isStateRequestReady: boolean;
  onFunctionChange: (value: { id: string; name: string; isFileFunction: boolean }) => void;
  onStateChange: (value: IState) => void;
  onSearchSubmit: (value: string) => void;
  onUploadButtonClick: () => void;
};

const initialValues = { query: '' };

const WasmStates = (props: Props) => {
  const {
    uploadedStates,
    fileFunctions,
    value,
    isStateRequestReady,
    onFunctionChange,
    onStateChange,
    onSearchSubmit,
    onUploadButtonClick,
  } = props;

  const { getInputProps, onSubmit } = useForm({ initialValues });

  const isAnyUploadedState = isStateRequestReady && uploadedStates.length > 0;
  const isUploadedStatesListEmpty = isStateRequestReady && uploadedStates.length === 0;
  const isAnyFileFunction = !!fileFunctions?.length;
  const isFileFunctionListEmpty = fileFunctions?.length === 0;

  const getStateWasms = () =>
    uploadedStates?.map((state) => {
      const { name, id, functions } = state;
      const functionNames = Object.keys(functions);

      const handleFunctionChange = (funcId: string, funcName: string) => {
        onFunctionChange({ id: funcId, name: funcName, isFileFunction: false });
        onStateChange(state);
      };

      return (
        <li key={id}>
          <ExpansionPanel id={id} heading={name} list={functionNames} value={value} onChange={handleFunctionChange} />
        </li>
      );
    });

  const handleSearchSubmit = onSubmit(({ query }) => onSearchSubmit(query));

  return (
    <>
      <form className={styles.form} onSubmit={handleSearchSubmit}>
        <Input type="search" placeholder="Search by function name" {...getInputProps('query')} />
      </form>
      <div className={styles.wrapper}>
        <Box>
          <h3 className={styles.heading}>Uploaded Functions</h3>
          {isAnyUploadedState ? (
            <ul className={styles.functions}>{getStateWasms()}</ul>
          ) : (
            <FunctionsPlaceholder isEmpty={isUploadedStatesListEmpty} />
          )}
        </Box>

        <Box className={styles.fileFunctions}>
          <h3 className={styles.heading}>File Functions</h3>

          {isAnyFileFunction ? (
            <Functions
              list={fileFunctions}
              value={value}
              onChange={(id) => onFunctionChange({ id, name: id, isFileFunction: true })}
            />
          ) : (
            <FunctionsPlaceholder isEmpty={isFileFunctionListEmpty} file />
          )}

          {isAnyFileFunction && (
            <Button
              text="Upload"
              color="secondary"
              size="small"
              className={styles.uploadFileButton}
              onClick={onUploadButtonClick}
            />
          )}
        </Box>
      </div>
    </>
  );
};

export { WasmStates };
