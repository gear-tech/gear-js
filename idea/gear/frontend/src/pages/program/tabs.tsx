import type { HexString, ProgramMetadata } from '@gear-js/api';
import { useOutletContext } from 'react-router-dom';
import { ProgramMessages } from '@/features/message';
import { MetadataTable } from '@/features/metadata';
import { ProgramEvents, SailsPreview } from '@/features/sails';
import type { ParsedSails } from '@/features/sails/types';
import { ProgramVouchers } from '@/features/voucher';
import { Box } from '@/shared/ui';

type TabsContext = {
  programId: HexString;
  sails: ParsedSails | undefined;
  metadata: ProgramMetadata | undefined;
  isLoading: boolean;
};

function MessagesTab() {
  const { programId, sails } = useOutletContext<TabsContext>();

  return <ProgramMessages programId={programId} sails={sails} />;
}

function EventsTab() {
  const { programId, sails } = useOutletContext<TabsContext>();

  return <ProgramEvents programId={programId} sails={sails} />;
}

function VouchersTab() {
  const { programId } = useOutletContext<TabsContext>();

  return <ProgramVouchers programId={programId} />;
}

function MetadataTab() {
  const { sails, metadata, isLoading } = useOutletContext<TabsContext>();

  if (!sails) return <MetadataTable metadata={metadata} isLoading={isLoading} />;

  return (
    <Box>
      <SailsPreview value={sails} />
    </Box>
  );
}

export type { TabsContext };
export { EventsTab, MessagesTab, MetadataTab, VouchersTab };
