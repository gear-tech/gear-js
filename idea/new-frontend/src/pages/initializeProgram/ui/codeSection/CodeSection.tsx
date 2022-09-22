import { useNavigate } from 'react-router-dom';
import { Metadata, Hex } from '@gear-js/api';
import { Button } from '@gear-js/ui';

import { useProgramActions } from 'hooks';
import { Payload } from 'hooks/useProgramActions/types';
import { RenderButtonsProps, SubmitHelpers, ProgramForm } from 'widgets/programForm';
import { routes, GasMethod } from 'shared/config';
import { FormText } from 'shared/ui/form';
import { Subheader } from 'shared/ui/subheader';
import plusSVG from 'shared/assets/images/actions/plus.svg';
import closeSVG from 'shared/assets/images/actions/close.svg';

import styles from '../InitializeProgram.module.scss';

type Props = {
  codeId: string;
  metadata?: Metadata;
  metadataBuffer?: string;
};

const CodeSection = ({ codeId, metadata, metadataBuffer }: Props) => {
  const navigate = useNavigate();

  const { createProgram } = useProgramActions();

  const goBack = () => navigate(-1);

  const handleSubmit = (payload: Payload, helpers: SubmitHelpers) =>
    createProgram({
      payload,
      codeId: codeId as Hex,
      reject: helpers.enableButtons,
      resolve: () => navigate(routes.programs),
    });

  const renderButtons = ({ isDisabled }: RenderButtonsProps) => (
    <>
      <Button icon={plusSVG} type="submit" text="Initialize Program" disabled={isDisabled} />
      <Button icon={closeSVG} text="Cancel" color="light" onClick={goBack} />
    </>
  );

  return (
    <section className={styles.pageSection}>
      <Subheader size="big" title="Enter program parameters" />
      <div className={styles.lining}>
        <FormText label="Code ID" text={codeId} direction="y" className={styles.codeId} />
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
