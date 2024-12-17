import { useAlert } from '@gear-js/react-hooks';
import { Button, Input } from '@gear-js/ui';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import TablePlaceholderSVG from '@/shared/assets/images/placeholders/table.svg?react';
import CopySVG from '@/shared/assets/images/actions/copyGreen.svg?react';
import RefreshSVG from '@/features/code-verifier/assets/refresh.svg?react';
import { getVerificationStatus, VerificationStatus as Status } from '@/features/code-verifier';
import { Box, IdBlock, Skeleton, Table, TableRow } from '@/shared/ui';
import { copyToClipboard } from '@/shared/helpers';

import styles from './verification-status.module.scss';

type Params = {
  id: string;
};

function VerificationStatus() {
  const { id } = useParams() as Params;
  const alert = useAlert();

  const { data, isFetching, refetch, error } = useQuery({
    queryKey: ['verification-status', id],
    queryFn: () => getVerificationStatus(id),
  });

  useEffect(() => {
    if (error) alert.error(error.message);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <>
      <header className={styles.header}>
        <div>
          <h1 className={styles.heading}>Verify Code</h1>

          {data && !isFetching ? <Status value={data.status} /> : <Status.Skeleton />}
        </div>

        <Button icon={RefreshSVG} text="Check Status" color="secondary" onClick={() => refetch()} />
      </header>

      <Box className={styles.idBox}>
        <Input label="Verification ID" value={id} gap="4/6" readOnly />
        <Button icon={CopySVG} color="transparent" onClick={() => copyToClipboard(id, alert)} />
      </Box>

      {data && !isFetching ? (
        <Table>
          <TableRow name="Created At">{new Date(data.created_at).toLocaleDateString()}</TableRow>

          {data.failed_reason && <TableRow name="Failure Reason">{data.failed_reason}</TableRow>}

          {/* <TableRow name="Docker image version">{data.version}</TableRow>

          <TableRow name="Code hash">
            <IdBlock id={data.code_id} size="big" />
          </TableRow>

          <TableRow name="Repository link">
            <a href={data.repo_link} target="_blank" rel="noreferrer" className={styles.link}>
              test
            </a>
          </TableRow>

          <TableRow name="Project">
            {'Name' in data.project ? data.project.Name : data.project.PathToCargoToml}
          </TableRow>

          <TableRow name="Network ID">{data.network}</TableRow>
          <TableRow name="Build IDL">{data.build_idl}</TableRow> */}
        </Table>
      ) : (
        <Skeleton SVG={TablePlaceholderSVG} />
      )}
    </>
  );
}

export { VerificationStatus };
