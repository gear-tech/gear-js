import { HexString, ProgramMetadata } from '@gear-js/api';
import { useOutletContext } from 'react-router-dom';
import { Sails } from 'sails-js';

import { ProgramMessages } from '@/features/message';
import { MetadataTable } from '@/features/metadata';
import { ProgramEvents, SailsPreview } from '@/features/sails';
import { ProgramVouchers } from '@/features/voucher';
import { Box } from '@/shared/ui';

type ProgramTabContext = {
  programId: HexString;
  sails: Sails | undefined;
  metadata: ProgramMetadata | undefined;
  isLoading: boolean;
};

function Messages() {
  const { programId, sails } = useOutletContext<ProgramTabContext>();

  return <ProgramMessages programId={programId} sails={sails} />;
}

function Events() {
  const { programId, sails } = useOutletContext<ProgramTabContext>();

  return <ProgramEvents programId={programId} sails={sails} />;
}

function Vouchers() {
  const { programId } = useOutletContext<ProgramTabContext>();

  return <ProgramVouchers programId={programId} />;
}

function Metadata() {
  const { sails, metadata, isLoading } = useOutletContext<ProgramTabContext>();

  if (!sails) return <MetadataTable metadata={metadata} isLoading={isLoading} />;

  return (
    <Box>
      <SailsPreview value={sails} />
    </Box>
  );
}

const ProgramTab = { Messages, Events, Vouchers, Metadata };

export { ProgramTab };
export type { ProgramTabContext };
