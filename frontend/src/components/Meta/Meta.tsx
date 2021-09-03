import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "store/reducers";
import { uploadMetaResetAction } from "store/actions/actions";
import { PAGE_TYPES } from "consts";
import { SocketService } from "services/SocketService";

import { PageHeader } from "components/blocks/PageHeader";
import { MetaForm } from "components/blocks/MetaForm";
import StatusPanel from "components/blocks/StatusPanel";

import './Meta.scss';

type Props = {
    programName: string;
    programHash: string;
    socketService: SocketService;
    handleClose: () => void;
}

const Meta = ({ programName, programHash, socketService, handleClose }: Props) => {

    const dispatch = useDispatch();

    const { metaUploadingError } = useSelector((state: RootState) => state.programs);

    let statusPanelText: string | null = null;

    if (metaUploadingError) {
        statusPanelText = metaUploadingError
    }

    return (
        <div className="meta-form">
            <PageHeader programName={programName} handleClose={handleClose} pageType={PAGE_TYPES.META_FORM_PAGE}/>
            <MetaForm programHash={programHash} programName={programName} handleClose={handleClose} socketService={socketService}/>
            {statusPanelText && <StatusPanel onClose={() => {
                dispatch(uploadMetaResetAction())
            }} statusPanelText={statusPanelText} isError={!!metaUploadingError}/>}
        </div>
    )
}

export { Meta };