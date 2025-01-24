import { useAlert } from '@gear-js/react-hooks';
import { Button, Input } from '@gear-js/ui';
import { useParams } from 'react-router-dom';

import TablePlaceholderSVG from '@/shared/assets/images/placeholders/table.svg?react';
import CopySVG from '@/shared/assets/images/actions/copyGreen.svg?react';
import RefreshSVG from '@/features/code-verifier/assets/refresh.svg?react';
import { VerificationStatus as Status, useVerificationStatus } from '@/features/code-verifier';
import { Box, Skeleton, Table, TableRow } from '@/shared/ui';
import { copyToClipboard } from '@/shared/helpers';

import styles from './verification-status.module.scss';

type Params = {
  id: string;
};

function VerificationStatus() {
  const { id } = useParams() as Params;
  const alert = useAlert();

  const { data, isFetching, refetch } = useVerificationStatus(id);

  return (
    <>
      <header className={styles.header}>
        <div>
          <h1 className={styles.heading}>Verify Code</h1>

          {data && !isFetching ? <Status value={data.status} /> : <Status.Skeleton disabled={!isFetching} />}
        </div>

        <Button
          icon={RefreshSVG}
          text="Check Status"
          color="secondary"
          onClick={() => refetch()}
          disabled={isFetching}
        />
      </header>

      <Box className={styles.idBox}>
        <Input label="Verification ID" value={id} gap="4/6" readOnly />
        <Button icon={CopySVG} color="transparent" onClick={() => copyToClipboard(id, alert)} />
      </Box>

      {data && !isFetching ? (
        <Table>
          <TableRow name="Created At">{new Date(data.created_at).toLocaleString()}</TableRow>

          {data.failed_reason && <TableRow name="Failure Reason">{data.failed_reason}</TableRow>}
        </Table>
      ) : (
        <Skeleton SVG={TablePlaceholderSVG} disabled={!isFetching} />
      )}
    </>
  );
}

export { VerificationStatus };
