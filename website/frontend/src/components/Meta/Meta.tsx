import React, { VFC } from 'react';
import { PAGE_TYPES } from 'consts';
import { PageHeader } from 'components/blocks/PageHeader/PageHeader';
import { MetaForm } from 'components/blocks/MetaForm/MetaForm';
// import { StatusPanel } from 'components/blocks/StatusPanel/StatusPanel';
import './Meta.scss';

type Props = {
  programName: string;
  programId: string;
  handleClose: () => void;
};

export const Meta: VFC<Props> = ({ programName, programId, handleClose }) => {
  return (
    <div className="meta-form">
      <PageHeader programName={programName} handleClose={handleClose} pageType={PAGE_TYPES.META_FORM_PAGE} />
      <MetaForm programId={programId} programName={programName} handleClose={handleClose} />
      {/* {statusPanelText && (
      <StatusPanel
        onClose={() => {
          dispatch(uploadMetaResetAction());
        }}
        statusPanelText={statusPanelText}
        isError={!!metaUploadingError}
      />
      )} */}
    </div>
  );
};
