import React, { VFC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/reducers';
import { uploadMetaResetAction } from 'store/actions/actions';
import { PAGE_TYPES } from 'consts';
import { PageHeader } from 'components/blocks/PageHeader/PageHeader';
import { MetaForm } from 'components/blocks/MetaForm/MetaForm';
import { StatusPanel } from 'components/blocks/StatusPanel/StatusPanel';
import './Meta.scss';

type Props = {
  programName: string;
  programHash: string;
  handleClose: () => void;
};

export const Meta: VFC<Props> = ({ programName, programHash, handleClose }) => {
  const dispatch = useDispatch();

  const { metaUploadingError } = useSelector((state: RootState) => state.programs);

  let statusPanelText: string | null = null;

  if (metaUploadingError) {
    statusPanelText = metaUploadingError;
  }

  return (
    <div className="meta-form">
      <PageHeader programName={programName} handleClose={handleClose} pageType={PAGE_TYPES.META_FORM_PAGE} />
      <MetaForm programHash={programHash} programName={programName} handleClose={handleClose} />
      {statusPanelText && (
        <StatusPanel
          onClose={() => {
            dispatch(uploadMetaResetAction());
          }}
          statusPanelText={statusPanelText}
          isError={!!metaUploadingError}
        />
      )}
    </div>
  );
};
