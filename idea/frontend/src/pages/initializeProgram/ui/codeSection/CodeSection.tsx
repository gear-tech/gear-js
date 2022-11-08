import { useNavigate } from 'react-router-dom';
import { Metadata, Hex } from '@gear-js/api';
import { Button, Input } from '@gear-js/ui';

import { useProgramActions } from 'hooks';
import { Payload } from 'hooks/useProgramActions/types';
import { RenderButtonsProps, SubmitHelpers, ProgramForm } from 'widgets/programForm';
import { GasMethod } from 'shared/config';
import { Subheader } from 'shared/ui/subheader';
import { ReactComponent as plusSVG } from 'shared/assets/images/actions/plus.svg';
import { ReactComponent as closeSVG } from 'shared/assets/images/actions/close.svg';

import styles from '../InitializeProgram.module.scss';

type Props = {
  codeId: string;
  metadata?: Metadata;
  metadataBuffer?: string;
  resetMetadada: () => void;
};

const CodeSection = ({ codeId, metadata, metadataBuffer, resetMetadada }: Props) => {
  const navigate = useNavigate();

  const { createProgram } = useProgramActions();

  const goBack = () => navigate(-1);

  const handleSubmit = (payload: Payload, helpers: SubmitHelpers) =>
    createProgram({
      payload,
      codeId: codeId as Hex,
      resolve: () => {
        helpers.resetForm();
        resetMetadada();
        helpers.enableButtons();
      },
      reject: helpers.enableButtons,
    });

  const renderButtons = ({ isDisabled }: RenderButtonsProps) => (
    <>
      <Button icon={plusSVG} type="submit" text="Create Program" disabled={isDisabled} />
      <Button icon={closeSVG} text="Cancel" color="light" onClick={goBack} />
    </>
  );

  return (
    <section className={styles.pageSection}>
      <Subheader size="big" title="Enter program parameters" />
      <div className={styles.lining}>
        <Input label="Code ID" value={codeId} direction="y" className={styles.codeId} readOnly />
        <ProgramForm
          source={codeId as Hex}
          metadata={metadata}
          gasMethod={GasMethod.InitCreate}
          metadataBuffer={metadataBuffer}
          renderButtons={renderButtons}
          onSubmit={handleSubmit}
        />
      </div>
    </section>
  );
};

export { CodeSection };
